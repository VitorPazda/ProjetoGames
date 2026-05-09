/**
 * ============================================================================
 * ADMIN — Login (login.js)
 * ============================================================================
 * Este script faz a requisição de autenticação para a API quando o formulário
 * de login é enviado.
 *
 * Fluxo:
 *   1. Usuário preenche e-mail e senha e clica em "Entrar"
 *   2. Fazemos o POST /login para a API com Axios
 *   3. A API retorna { user, token } em caso de sucesso
 *   4. Salvamos o token no localStorage para uso nas próximas requisições
 *   5. Redirecionamos para o dashboard.html
 *   6. Se houver erro (senha errada, usuário não existe), exibimos a mensagem
 * ============================================================================
 */

// URL base da nossa API
const API_URL = 'http://localhost:3000';

// Referências aos elementos do HTML
const form     = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

/**
 * Ouvinte do evento "submit" no formulário.
 * e.preventDefault() impede o comportamento padrão de recarregar a página.
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Lemos os valores dos campos de texto
    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Oculta mensagens de erro anteriores antes de tentar novamente
    errorMsg.style.display = 'none';

    try {
        // axios.post(url, dados) — envia os dados no corpo da requisição (body)
        // A API receberá: { email: '...', password: '...' }
        const response = await axios.post(`${API_URL}/login`, { email, password });

        // Em caso de sucesso, a API retorna o token JWT
        const token = response.data.token;

        /**
         * localStorage é um armazenamento persistente no navegador.
         * O token salvo aqui será usado no dashboard para autorizar as rotas protegidas.
         * Mesmo se o usuário fechar a aba, o token continua salvo até expirar ou ser removido.
         */
        localStorage.setItem('adminToken', token);

        // Redirecionamos para a tela principal do painel
        window.location.href = 'dashboard.html';

    } catch (err) {
        // Se a API retornar um erro (ex: 401 Senha errada), exibimos a mensagem
        const mensagem = err.response?.data?.error || 'Erro de conexão com a API.';
        errorMsg.textContent  = mensagem;
        errorMsg.style.display = 'block';
    }
});
