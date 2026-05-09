/**
 * ============================================================================
 * CONTROLLER: AuthController (Autenticação)
 * ============================================================================
 * Um "Controller" é responsável por conter a LÓGICA de negócios da API.
 * Quando uma rota é acionada (ex: POST /login), o Express chama o método
 * correspondente neste controller.
 *
 * Fluxo do Login:
 *   1. Recebe e-mail e senha do corpo da requisição
 *   2. Busca o usuário no banco de dados pelo e-mail
 *   3. Compara a senha enviada com o hash salvo no banco (bcrypt)
 *   4. Se válido, gera e retorna um Token JWT
 * ============================================================================
 */

const User    = require('../models/User');
const bcrypt  = require('bcrypt');   // para comparar a senha com o hash salvo
const jwt     = require('jsonwebtoken');
const { SECRET } = require('../middlewares/auth'); // importamos a chave secreta centralizada

module.exports = {

    /**
     * login — lida com a requisição POST /login
     * @param {Request}  req - contém { email, password } no corpo
     * @param {Response} res - enviamos o token ou um erro
     */
    async login(req, res) {
        // Desestruturamos os campos que esperamos receber no corpo (body) da requisição
        const { email, password } = req.body;

        try {
            // Passo 1: Procura o usuário pelo e-mail
            const user = await User.findOne({ where: { email } });

            if (!user) {
                // HTTP 404 = Não encontrado
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // Passo 2: Compara a senha digitada com o hash armazenado no banco
            // bcrypt.compare() faz isso de forma segura — nunca descriptografamos a senha!
            const senhaValida = await bcrypt.compare(password, user.password);

            if (!senhaValida) {
                // HTTP 401 = Não autorizado
                return res.status(401).json({ error: 'Senha incorreta.' });
            }

            // Passo 3: Gera o Token JWT com os dados básicos do usuário
            // O token expira em 1 dia ('1d'), forçando um novo login após isso
            const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' });

            // Passo 4: Retorna os dados do usuário (SEM a senha) e o token
            return res.json({
                user: {
                    id:    user.id,
                    name:  user.name,
                    email: user.email,
                },
                token,
            });

        } catch (err) {
            // HTTP 500 = Erro interno do servidor
            return res.status(500).json({ error: err.message });
        }
    },
};
