/**
 * ============================================================================
 * ADMIN — Dashboard (dashboard.js)
 * ============================================================================
 * Este é o script principal do painel de administração.
 * Ele é responsável por:
 *
 *   1. Verificar se o usuário está autenticado (tem token no localStorage)
 *   2. Configurar o Axios com o token para as requisições protegidas
 *   3. Carregar os dados de cada módulo (Formações, Notícias, Eventos)
 *   4. Lidar com os formulários de cadastro de novos itens
 *   5. Permitir a exclusão de itens já cadastrados
 * ============================================================================
 */

// ─── Configuração Inicial ────────────────────────────────────────────────────

const API_URL = 'http://localhost:3000';

/**
 * Recuperamos o token JWT que foi salvo no login.
 * Se não existir (usuário não fez login), redirecionamos para a tela de login.
 */
const token = localStorage.getItem('adminToken');
if (!token) {
    window.location.href = 'index.html';
}

/**
 * Criamos uma instância do Axios já configurada com o token.
 * Todas as requisições feitas através desta instância (api.post, api.delete)
 * enviarão automaticamente o header "Authorization: Bearer <token>".
 * Isso é necessário para as rotas protegidas pelo authMiddleware.
 */
const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
});

// ─── Funções de Navegação ────────────────────────────────────────────────────

/**
 * logout — remove o token do localStorage e redireciona para o login.
 * Chamado ao clicar no botão "Sair" na sidebar.
 */
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
}

/**
 * showPanel — exibe um painel específico e oculta os demais.
 * @param {string} panelName - 'formations', 'news' ou 'events'
 */
function showPanel(panelName) {
    // Remove a classe 'active' de todos os painéis e links do menu
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

    // Ativa o painel e o item de menu correspondentes
    document.getElementById(`panel-${panelName}`).classList.add('active');
    document.getElementById(`menu-${panelName}`).classList.add('active');

    // Carrega os dados do módulo ativo
    if (panelName === 'games')          loadGames();
    if (panelName === 'publishers')     loadPublishers();
    if (panelName === 'releases')       loadReleases();
    if (panelName === 'studios')        loadStudios();
}

// ─── Módulo: Games ───────────────────────────────────────────────────────

/**
 * loadGames — busca as formações na API e renderiza na tabela.
 * Usamos axios público (sem token) pois GET /formations é rota pública.
 */
async function loadGames() {
    try {
        const { data } = await axios.get(`${API_URL}/game`);
        const tbody = document.getElementById('tbody-games');

        // Usamos template literal para montar o HTML de cada linha da tabela
        tbody.innerHTML = data.map(game => `
            <tr>
                <td>${game.id}</td>
                <td>${game.title}</td>
                <td>${game.description}</td>
                <td>${game.genre}</td>
                <td>
                    <img src="${API_URL}${game.image_url}" alt="${game.title}"
                         style="height: 50px; width: 70px; object-fit: cover; border-radius: 4px; border: 1px solid #e2e8f0;">
                </td>
                <td>
                    <button onclick="deleteGame(${game.id})"
                            style="color:#ef4444; border-color:#ef4444;"
                            class="btn btn-outline btn-sm">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Erro ao carregar formações:', err);
    }
}

/**
 * Preview de imagem — ao selecionar um arquivo, mostra uma prévia antes de enviar.
 * Usamos FileReader para ler o arquivo localmente sem enviar ao servidor.
 */
document.getElementById('game-img').addEventListener('change', (e) => {
    const file    = e.target.files[0];
    const preview = document.getElementById('game-preview');
    const img     = document.getElementById('game-preview-img');

    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            img.src = ev.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});

/**
 * Ouvinte do formulário de Games.
 * e.preventDefault() impede o recarregamento da página.
 */
document.getElementById('form-games').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Criamos o FormData e adicionamos cada campo manualmente
    const formData = new FormData();
    formData.append('title',            document.getElementById('game-title').value);
    formData.append('description',      document.getElementById('game-description').value);
    formData.append('genre',            document.getElementById('game-genre').value);
    formData.append('image',            document.getElementById('game-img').files[0]); // O arquivo!

    // api.post já tem o token JWT configurado via interceptor
    await api.post('/game', formData);

    // Limpa o formulário, esconde a prévia e recarrega a tabela
    e.target.reset();
    document.getElementById('game-preview').style.display = 'none';
    loadGames();
});

/**
 * deleteGame — exclui uma formação pelo ID.
 * Chamado pelo botão "Excluir" em cada linha da tabela.
 */
async function deleteGame(id) {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        await api.delete(`/game/${id}`);
        loadGames(); // Atualiza a tabela após excluir
    }
}

// ─── Módulo: Publisher ────────────────────────────────────────────────────────

/**
 * loadPublishers
 */
async function loadPublishers() {
    try {
        const { data } = await axios.get(`${API_URL}/publisher`);
        document.getElementById('tbody-publishers').innerHTML = data.map(publisher => `
            <tr>
                <td>${publisher.id}</td>
                <td>${publisher.name}</td>
                <td>${publisher.country}</td>
                <td>
                    <button onclick="deletePublisher(${publisher.id})"
                            style="color:#ef4444; border-color:#ef4444;"
                            class="btn btn-outline btn-sm">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Erro ao carregar as publicadoras:', err);
    }
}

document.getElementById('form-publishers').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name      = document.getElementById('publisher-name').value;
    const country   = document.getElementById('publisher-country').value;

    // api.post já tem o token JWT configurado via interceptor
    await api.post('/publisher', { name, country });

    // Limpa o formulário, esconde a prévia e recarrega a tabela
    e.target.reset();
    loadPublishers();
});

async function deletePublisher(id) {
    if (confirm('Tem certeza que deseja excluir esta publicadora?')) {
        await api.delete(`/publisher/${id}`);
        loadPublishers();
    }
}

// ─── Módulo: Releases ─────────────────────────────────────────────────────────

async function loadReleases() {
    try {
        const { data } = await axios.get(`${API_URL}/release`);
        document.getElementById('tbody-releases').innerHTML = data.map(release => `
            <tr>
                <td>${release.id}</td>
                <td>${release.title}</td>
                <td>${release.description}</td>
                <td>${release.game}</td>
                <td>${release.date}</td>
                <td>
                    <button onclick="deleteEvent(${release.id})"
                            style="color:#ef4444; border-color:#ef4444;"
                            class="btn btn-outline btn-sm">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Erro ao carregar eventos:', err);
    }
}

document.getElementById('form-releases').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api.post('/release', {
        title:              document.getElementById('release-title').value,
        description:        document.getElementById('release-description').value,
        game:               document.getElementById('release-game').value,
        date:               document.getElementById('release-date').value,
    });
    e.target.reset();
    loadReleases();
});

async function deleteEvent(id) {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
        await api.delete(`/release/${id}`);
        loadReleases();
    }
}

// ─── Módulo: Studios ────────────────────────────────────────────────────────

/**
 * loadNews — busca as notícias e exibe na tabela com thumbnail da imagem.
 * A image_url agora é um caminho relativo servido pela API (ex: /uploads/news/foto.jpg).
 */
async function loadStudios() {
    try {
        const { data } = await axios.get(`${API_URL}/studio`);
        document.getElementById('tbody-studios').innerHTML = data.map(studio => `
            <tr>
                <td>${studio.id}</td>
                <td>${studio.name}</td>
                <td>${studio.foundationYear}</td>
                <td>${studio.country}</td>
                <td>
                    <button onclick="deleteStudio(${studio.id})"
                            style="color:#ef4444; border-color:#ef4444;"
                            class="btn btn-outline btn-sm">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Erro ao carregar os estúdios:', err);
    }
}

document.getElementById('form-studios').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api.post('/studio', {
        name:                   document.getElementById('studio-name').value,
        foundationYear:         document.getElementById('studio-foundationYear').value,
        country:                document.getElementById('studio-country').value,
    });
    e.target.reset();
    loadStudios();
});

async function deleteStudio(id) {
    if (confirm('Tem certeza que deseja excluir este estúdio?')) {
        await api.delete(`/studio/${id}`);
        loadStudios();
    }
}

// ─── Carga Inicial ────────────────────────────────────────────────────────────
// Ao abrir o dashboard, já carregamos as formações (painel padrão)
loadGames();
