/* ============================================================
   CineFlix - tela de login / cadastro
   ============================================================ */

// Se ja estiver logado, vai direto para o catalogo.
if (Session.isLoggedIn()) {
    window.location.href = 'index.html';
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const formTitle = document.getElementById('form-title');
const switchText = document.getElementById('switch-text');
const switchLink = document.getElementById('switch-link');
const alertBox = document.getElementById('alert');

let showingLogin = true;

function showAlert(msg) {
    alertBox.textContent = msg;
    alertBox.classList.remove('hidden');
}

function hideAlert() {
    alertBox.classList.add('hidden');
}

/* Alterna entre login e cadastro */
switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    hideAlert();
    showingLogin = !showingLogin;
    if (showingLogin) {
        formTitle.textContent = 'Entrar';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        switchText.textContent = 'Novo por aqui?';
        switchLink.textContent = 'Crie uma conta agora.';
    } else {
        formTitle.textContent = 'Criar conta';
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        switchText.textContent = 'Ja tem conta?';
        switchLink.textContent = 'Entre aqui.';
    }
});

/* Login */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        const user = await API.login(email, password);
        Session.save(user);
        window.location.href = 'index.html';
    } catch (err) {
        showAlert(err.message);
    }
});

/* Cadastro */
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    try {
        const user = await API.register(name, email, password);
        Session.save(user);
        window.location.href = 'index.html';
    } catch (err) {
        showAlert(err.message);
    }
});
