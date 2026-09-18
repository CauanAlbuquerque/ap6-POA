/* ============================================================
   CineFlix - camada de comunicacao com a API e sessao
   ============================================================ */

const API = {
    base: '/api',

    /** Requisicao JSON generica. */
    async request(path, options = {}) {
        const res = await fetch(this.base + path, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        let data = null;
        const text = await res.text();
        if (text) {
            try { data = JSON.parse(text); } catch (e) { data = { message: text }; }
        }
        if (!res.ok) {
            const msg = (data && data.message) ? data.message : 'Erro na requisicao.';
            throw new Error(msg);
        }
        return data;
    },

    // ---- Autenticacao ----
    register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    },
    login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    // ---- Filmes ----
    listMovies() { return this.request('/movies'); },
    featured()   { return this.request('/movies/featured'); },
    byGenre(g)   { return this.request('/movies?genre=' + encodeURIComponent(g)); },
    search(q)    { return this.request('/movies?search=' + encodeURIComponent(q)); },
    movie(id)    { return this.request('/movies/' + id); },

    // ---- Alugueis ----
    rent(userId, movieId) {
        return this.request('/rentals', {
            method: 'POST',
            body: JSON.stringify({ userId, movieId })
        });
    },
    myRentals(userId) { return this.request('/rentals?userId=' + userId); },
    watch(userId, movieId) {
        return this.request('/rentals/watch?userId=' + userId + '&movieId=' + movieId);
    }
};

/* ---- Gerenciamento de sessao (localStorage) ---- */
const Session = {
    key: 'cineflix_user',
    save(user) { localStorage.setItem(this.key, JSON.stringify(user)); },
    get() {
        const raw = localStorage.getItem(this.key);
        return raw ? JSON.parse(raw) : null;
    },
    clear() { localStorage.removeItem(this.key); },
    isLoggedIn() { return this.get() !== null; },
    /** Redireciona para login se nao autenticado. */
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return null;
        }
        return this.get();
    }
};

/* ---- Utilitarios ---- */
function formatPrice(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
}

function formatDuration(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' +
        d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
