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
}

// ─── Módulo: Formações ───────────────────────────────────────────────────────

/**
 * loadFormations — busca as formações na API e renderiza na tabela.
 * Usamos axios público (sem token) pois GET /formations é rota pública.
 */
async function loadGames() {
    try {
        const { data } = await axios.get(`${API_URL}/game`);
        const tbody = document.getElementById('tbody-formations');

        // Usamos template literal para montar o HTML de cada linha da tabela
        tbody.innerHTML = data.map(g => `
            <tr>
                <td>${g.id}</td>
                <td>${g.title}</td>
                <td>${g.description}</td>
                <td>${g.genre}</td>
                <td>
                    <img src="${API_URL}${g.image_url}" alt="${g.title}"
                         style="height: 50px; width: 70px; object-fit: cover; border-radius: 4px; border: 1px solid #e2e8f0;">
                </td>
                <td>
                    <button onclick="deleteGame(${g.id})"
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
document.getElementById('f-img').addEventListener('change', (e) => {
    const file    = e.target.files[0];
    const preview = document.getElementById('f-preview');
    const img     = document.getElementById('f-preview-img');

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
 * Ouvinte do formulário de Formações.
 * e.preventDefault() impede o recarregamento da página.
 */
document.getElementById('form-formations').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Criamos o FormData e adicionamos cada campo manualmente
    const formData = new FormData();
    formData.append('title',            document.getElementById('f-title').value);
    formData.append('description',      document.getElementById('f-desc').value);
    formData.append('genre',            document.getElementById('f-genre').value);
    formData.append('image',            document.getElementById('f-img').files[0]); // O arquivo!

    // api.post já tem o token JWT configurado via interceptor
    await api.post('/game', formData);

    // Limpa o formulário, esconde a prévia e recarrega a tabela
    e.target.reset();
    document.getElementById('f-preview').style.display = 'none';
    loadNews();
});

/**
 * deleteFormation — exclui uma formação pelo ID.
 * Chamado pelo botão "Excluir" em cada linha da tabela.
 */
async function deleteGame(id) {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        await api.delete(`/game/${id}`);
        loadGames(); // Atualiza a tabela após excluir
    }
}

// ─── Módulo: Notícias/Publisher ────────────────────────────────────────────────────────

/**
 * loadNews — busca as notícias e exibe na tabela com thumbnail da imagem.
 * A image_url agora é um caminho relativo servido pela API (ex: /uploads/news/foto.jpg).
 */
async function loadPublishers() {
    try {
        const { data } = await axios.get(`${API_URL}/publisher`);
        document.getElementById('tbody-news').innerHTML = data.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.country}</td>
                <td>
                    <button onclick="deletePublisher(${p.id})"
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


/**
 * Submit do formulário de Notícias — agora usa FormData.
 *
 * FormData é o objeto nativo do JavaScript para enviar dados no formato
 * multipart/form-data, que é necessário quando há upload de arquivo.
 *
 * Ao passar um FormData para o axios.post(), ele automaticamente
 * define o Content-Type correto (multipart/form-data com boundary).
 */
document.getElementById('form-news').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name      = document.getElementById('n-title').value;
    const country   = document.getElementById('n-date').value;

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

// ─── Módulo: Eventos/Releases ─────────────────────────────────────────────────────────

async function loadReleases() {
    try {
        const { data } = await axios.get(`${API_URL}/release`);
        document.getElementById('tbody-events').innerHTML = data.map(re => `
            <tr>
                <td>${re.idRelease}</td>
                <td>${re.title}</td>
                <td>${re.description}</td>
                <td>${re.game}</td>
                <td>${re.date}</td>
                <td>
                    <button onclick="deleteEvent(${re.idRelease})"
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

document.getElementById('form-events').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api.post('/release', {
        title:              document.getElementById('e-title').value,
        description:        document.getElementById('e-day').value,
        game:               document.getElementById('e-month').value,
        date:               document.getElementById('e-time').value,
    });
    e.target.reset();
    loadReleases();
});

async function deleteEvent(idRelease) {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
        await api.delete(`/release/${idRelease}`);
        loadReleases();
    }
}

// ─── Carga Inicial ────────────────────────────────────────────────────────────
// Ao abrir o dashboard, já carregamos as formações (painel padrão)
loadGames();
