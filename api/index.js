/**
 * ============================================================================
 * CODESCHOOL API — PONTO DE ENTRADA DA APLICAÇÃO (index.js)
 * ============================================================================
 * Este é o arquivo principal que "liga" toda a nossa API.
 * Aqui nós:
 *   1. Criamos o servidor Express
 *   2. Configuramos os middlewares globais (CORS, JSON)
 *   3. Registramos as rotas separadas por módulo
 *   4. Conectamos ao banco de dados via Sequelize
 *   5. Criamos um usuário admin padrão se ainda não existir
 * ============================================================================
 */

// ─── Importações ────────────────────────────────────────────────────────────

const express    = require('express'); // Framework que cria o servidor HTTP
const cors       = require('cors');    // Libera acesso de outras origens (ex: o site abrindo a API)
const sequelize  = require('./src/config/database'); // Nossa conexão configurada com o MySQL

// Importamos cada arquivo de rotas separado (um por módulo)
const authRoutes      = require('./src/routes/authRoutes');
const gameRoutes        = require('./src/routes/gameRoutes');
const releaseRoutes     = require('./src/routes/releaseRoutes');
const publisherRoutes   = require('./src/routes/publisherRoutes');
// ─── Criação do App Express ──────────────────────────────────────────────────

const app = express();

// Middlewares Globais:
// cors()         → Permite que o browser (site/admin) faça requisições para essa API
// express.json() → Faz o Express entender o corpo das requisições no formato JSON
app.use(cors());
app.use(express.json());

// Serve a pasta "public" como conteúdo estático.
// Qualquer arquivo dentro de /public/ ficará acessível via URL.
// Ex: public/uploads/news/foto.jpg → http://localhost:3000/uploads/news/foto.jpg
app.use(express.static('public'));

// ─── Registro das Rotas ───────────────────────────────────────────────────────
// Cada módulo tem seu próprio arquivo de rotas.
// Todos os prefixos de URL são gerenciados aqui.

app.use(authRoutes);       // POST /login
app.use(gameRoutes);        // GET/POST/DELETE /formations
app.use(releaseRoutes);        // GET/POST/DELETE /formations
app.use(publisherRoutes);        // GET/POST/DELETE /formations

// ─── Porta do Servidor ────────────────────────────────────────────────────────

const PORT = 3000;

// ─── Inicialização ────────────────────────────────────────────────────────────
/**
 * sequelize.sync() tenta conectar ao banco de dados MySQL e,
 * se necessário, cria as tabelas que ainda não existem.
 * { force: false } → NÃO apaga os dados existentes ao reiniciar.
 */
sequelize.sync({ force: false }).then(async () => {
    console.log('✅ Banco de dados conectado e sincronizado.');

    // ── Seed: Criando o Administrador Padrão ──────────────────────────────
    // Verificamos se já existe algum admin para não criar duplicatas.
    const User   = require('./src/models/User');
    const bcrypt = require('bcrypt');

    const adminExistente = await User.findOne({ where: { email: 'admin@codeschool.edu.br' } });

    if (!adminExistente) {
        // bcrypt.hash() criptografa a senha antes de salvar no banco.
        // O número "10" é o "salt rounds" — quanto maior, mais seguro (e mais lento).
        const senhaCriptografada = await bcrypt.hash('admin123', 10);

        await User.create({
            name:     'Administrador',
            email:    'admin@codeschool.edu.br',
            password: senhaCriptografada,
        });

        console.log('👤 Admin padrão criado: admin@codeschool.edu.br / admin123');
    }

    // ── Inicia o servidor na porta definida ───────────────────────────────
    app.listen(PORT, () => {
        console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });

}).catch(err => {
    // Se algo der errado ao conectar no banco, mostramos o erro e encerramos.
    console.error('❌ Falha ao conectar no banco de dados:', err);
});
