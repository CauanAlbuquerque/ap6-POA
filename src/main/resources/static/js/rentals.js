/* ============================================================
   CineFlix - pagina "Meus Alugueis"
   ============================================================ */

const user = Session.requireAuth();

const grid = document.getElementById('rentals-grid');
const empty = document.getElementById('rentals-empty');
const userNameEl = document.getElementById('user-name');

// Player
const playerModal = document.getElementById('player-modal');
const playerVideo = document.getElementById('player-video');
const playerTitle = document.getElementById('player-title');
const playerClose = document.getElementById('player-close');

init();

async function init() {
    if (!user) return;
    userNameEl.textContent = user.name;

    document.getElementById('logout-btn').addEventListener('click', () => {
        Session.clear();
        window.location.href = 'login.html';
    });

    playerClose.addEventListener('click', closePlayer);
    playerModal.addEventListener('click', (e) => {
        if (e.target === playerModal) closePlayer();
    });

    await loadRentals();
}

async function loadRentals() {
    try {
        const rentals = await API.myRentals(user.id);
        if (!rentals.length) {
            empty.classList.remove('hidden');
            return;
        }
        grid.innerHTML = '';
        rentals.forEach(r => grid.appendChild(buildRentalCard(r)));
    } catch (e) {
        grid.innerHTML = `<p style="color:var(--red)">Erro ao carregar: ${e.message}</p>`;
    }
}

function buildRentalCard(rental) {
    const movie = rental.movie;
    const card = document.createElement('div');
    card.className = 'rental-card';

    const statusClass = rental.active ? 'active' : 'expired';
    const statusText = rental.active ? 'Ativo' : 'Expirado';
    const expiryText = rental.active
        ? `Disponivel ate ${formatDate(rental.expiresAt)}`
        : `Expirou em ${formatDate(rental.expiresAt)}`;

    card.innerHTML = `
        <span class="status-badge ${statusClass}">${statusText}</span>
        <img src="${movie.posterUrl}" alt="${movie.title}">
        <div class="rental-card-info">
            <h3>${movie.title}</h3>
            <p class="rental-expiry ${rental.active ? '' : 'expired'}">${expiryText}</p>
            <button class="btn-watch" ${rental.active ? '' : 'disabled'}>
                ${rental.active ? '▶ Assistir' : 'Aluguel expirado'}
            </button>
        </div>
    `;

    if (rental.active) {
        card.querySelector('.btn-watch').addEventListener('click', () => {
            openPlayer(movie);
        });
    }
    return card;
}

async function openPlayer(movie) {
    try {
        // Revalida o aluguel no backend antes de reproduzir
        const rental = await API.watch(user.id, movie.id);
        playerTitle.textContent = movie.title;
        playerVideo.src = rental.movie.videoUrl;
        playerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        playerVideo.play();
    } catch (e) {
        alert(e.message);
    }
}

function closePlayer() {
    playerVideo.pause();
    playerVideo.removeAttribute('src');
    playerVideo.load();
    playerModal.classList.add('hidden');
    document.body.style.overflow = '';
}
