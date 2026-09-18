/* ============================================================
   CineFlix - catalogo principal
   ============================================================ */

const user = Session.requireAuth();

// Estado
let allMovies = [];
let activeRentalMovieIds = new Set();
let currentModalMovie = null;

// Elementos
const navbar = document.getElementById('navbar');
const rowsEl = document.getElementById('rows');
const heroEl = document.getElementById('hero');
const searchInput = document.getElementById('search-input');
const userNameEl = document.getElementById('user-name');

// Modal
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalVideo = document.getElementById('modal-video');
const modalActions = document.getElementById('modal-actions');
const modalStatus = document.getElementById('modal-status');

/* ---------- Inicializacao ---------- */
init();

async function init() {
    if (!user) return;
    userNameEl.textContent = user.name;

    document.getElementById('logout-btn').addEventListener('click', () => {
        Session.clear();
        window.location.href = 'login.html';
    });

    // Efeito de navbar ao rolar
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Filtros por genero
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const genre = link.dataset.genre;
            searchInput.value = '';
            if (genre) renderGenre(genre);
            else renderHome();
        });
    });

    // Busca (com debounce)
    let debounce;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => doSearch(searchInput.value.trim()), 350);
    });

    // Modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    await loadRentals();
    await renderHome();
}

/* ---------- Carrega alugueis ativos do usuario ---------- */
async function loadRentals() {
    try {
        const rentals = await API.myRentals(user.id);
        activeRentalMovieIds = new Set(
            rentals.filter(r => r.active).map(r => r.movie.id)
        );
    } catch (e) {
        console.warn('Nao foi possivel carregar alugueis:', e.message);
    }
}

/* ---------- Tela inicial: hero + trilhos por genero ---------- */
async function renderHome() {
    rowsEl.innerHTML = '<p style="padding:0 50px;color:#888">Carregando...</p>';
    try {
        allMovies = await API.listMovies();
        const featured = await API.featured();

        // Hero: primeiro destaque (ou primeiro filme)
        const hero = featured[0] || allMovies[0];
        if (hero) renderHero(hero);

        // Agrupa por genero
        const byGenre = {};
        allMovies.forEach(m => {
            (byGenre[m.genre] = byGenre[m.genre] || []).push(m);
        });

        rowsEl.innerHTML = '';
        // Trilho de destaques primeiro
        if (featured.length) rowsEl.appendChild(buildRow('Em destaque', featured));
        Object.keys(byGenre).sort().forEach(genre => {
            rowsEl.appendChild(buildRow(genre, byGenre[genre]));
        });
    } catch (e) {
        rowsEl.innerHTML = `<p style="padding:0 50px;color:var(--red)">Erro ao carregar: ${e.message}</p>`;
    }
}

/* ---------- Filtro por genero (grid) ---------- */
async function renderGenre(genre) {
    heroEl.style.display = 'none';
    rowsEl.innerHTML = '<p style="padding:0 50px;color:#888">Carregando...</p>';
    try {
        const movies = await API.byGenre(genre);
        rowsEl.innerHTML = '';
        const row = buildRow(genre, movies, true);
        rowsEl.appendChild(row);
    } catch (e) {
        rowsEl.innerHTML = `<p style="padding:0 50px;color:var(--red)">Erro: ${e.message}</p>`;
    }
}

/* ---------- Busca ---------- */
async function doSearch(query) {
    if (!query) {
        heroEl.style.display = '';
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[data-genre=""]').classList.add('active');
        return renderHome();
    }
    heroEl.style.display = 'none';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    try {
        const movies = await API.search(query);
        rowsEl.innerHTML = '';
        if (movies.length === 0) {
            rowsEl.innerHTML = `<p style="padding:0 50px;color:#888">Nenhum filme encontrado para "${query}".</p>`;
            return;
        }
        rowsEl.appendChild(buildRow(`Resultados para "${query}"`, movies, true));
    } catch (e) {
        rowsEl.innerHTML = `<p style="padding:0 50px;color:var(--red)">Erro: ${e.message}</p>`;
    }
}

/* ---------- Hero ---------- */
function renderHero(movie) {
    heroEl.style.display = '';
    heroEl.style.backgroundImage =
        `linear-gradient(to right, rgba(0,0,0,.8) 0%, rgba(0,0,0,.3) 60%, transparent 100%), url('${movie.backdropUrl}')`;
    document.getElementById('hero-title').textContent = movie.title;
    document.getElementById('hero-desc').textContent = movie.description;
    document.getElementById('hero-play').onclick = () => openModal(movie);
    document.getElementById('hero-info').onclick = () => openModal(movie);
}

/* ---------- Constroi um trilho de filmes ---------- */
function buildRow(title, movies, isGrid = false) {
    const row = document.createElement('section');
    row.className = 'row' + (isGrid ? ' grid' : '');
    const h = document.createElement('h2');
    h.className = 'row-title';
    h.textContent = title;
    row.appendChild(h);

    const cards = document.createElement('div');
    cards.className = 'row-cards';
    movies.forEach(m => cards.appendChild(buildCard(m)));
    row.appendChild(cards);
    return row;
}

/* ---------- Constroi um card ---------- */
function buildCard(movie) {
    const card = document.createElement('div');
    card.className = 'card';
    const owned = activeRentalMovieIds.has(movie.id);
    card.innerHTML = `
        ${owned ? '<span class="card-owned">Alugado</span>' : ''}
        <img src="${movie.posterUrl}" alt="${movie.title}" loading="lazy">
        <div class="card-info">
            <h3>${movie.title}</h3>
            <span class="card-price">${owned ? 'Assistir' : formatPrice(movie.rentalPrice)}</span>
        </div>
    `;
    card.addEventListener('click', () => openModal(movie));
    return card;
}

/* ---------- Modal de detalhes / aluguel ---------- */
function openModal(movie) {
    currentModalMovie = movie;
    modalStatus.className = 'modal-status hidden';
    modalStatus.textContent = '';

    // reset video
    modalVideo.classList.add('hidden');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();

    modalBackdrop.style.backgroundImage = `url('${movie.backdropUrl}')`;
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-year').textContent = movie.year;
    document.getElementById('modal-duration').textContent = formatDuration(movie.durationMin);
    document.getElementById('modal-rating').textContent = movie.rating || 'L';
    document.getElementById('modal-genre').textContent = movie.genre;
    document.getElementById('modal-desc').textContent = movie.description;
    document.getElementById('modal-price').textContent = formatPrice(movie.rentalPrice);
    document.getElementById('modal-rental-info').textContent =
        `Acesso por ${movie.rentalDays} dia(s) apos o aluguel`;

    renderModalActions(movie);

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function renderModalActions(movie) {
    const owned = activeRentalMovieIds.has(movie.id);
    modalActions.innerHTML = '';
    if (owned) {
        const btn = document.createElement('button');
        btn.className = 'btn-play';
        btn.textContent = '▶ Assistir agora';
        btn.onclick = () => playMovie(movie);
        modalActions.appendChild(btn);
    } else {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.style.maxWidth = '260px';
        btn.textContent = `Alugar por ${formatPrice(movie.rentalPrice)}`;
        btn.onclick = () => rentMovie(movie, btn);
        modalActions.appendChild(btn);
    }
}

async function rentMovie(movie, btn) {
    btn.disabled = true;
    btn.textContent = 'Processando...';
    try {
        await API.rent(user.id, movie.id);
        activeRentalMovieIds.add(movie.id);
        modalStatus.className = 'modal-status success';
        modalStatus.textContent = 'Filme alugado com sucesso! Aproveite.';
        renderModalActions(movie);
        // Atualiza cards ao fundo
        refreshCurrentView();
    } catch (e) {
        modalStatus.className = 'modal-status error';
        modalStatus.textContent = e.message;
        btn.disabled = false;
        btn.textContent = `Alugar por ${formatPrice(movie.rentalPrice)}`;
    }
}

async function playMovie(movie) {
    try {
        // Valida no backend se o aluguel esta ativo e obtem os dados
        const rental = await API.watch(user.id, movie.id);
        const src = rental.movie.videoUrl;
        modalVideo.src = src;
        modalVideo.classList.remove('hidden');
        modalVideo.play();
    } catch (e) {
        modalStatus.className = 'modal-status error';
        modalStatus.textContent = e.message;
    }
}

function closeModal() {
    modal.classList.add('hidden');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    document.body.style.overflow = '';
}

/* Re-renderiza a view atual para atualizar selos "Alugado" */
function refreshCurrentView() {
    const q = searchInput.value.trim();
    const activeGenreLink = document.querySelector('.nav-link.active');
    if (q) return doSearch(q);
    if (activeGenreLink && activeGenreLink.dataset.genre) {
        return renderGenre(activeGenreLink.dataset.genre);
    }
    return renderHome();
}
