/**
 * ============================================================================
 * MIDDLEWARE DE AUTENTICAÇÃO (auth.js)
 * ============================================================================
 * Um "middleware" no Express é uma função que fica no MEIO do caminho
 * entre a requisição do cliente e a resposta do servidor.
 *
 * Quando uma rota é PRIVADA (ex: POST /formations), colocamos este middleware
 * antes do controller. Ele funciona como um "guarda na porta":
 *   → Verifica se o usuário enviou um Token JWT válido
 *   → Se sim: deixa passar e chama next()
 *   → Se não: rejeita com status 401 (Não Autorizado)
 *
 * O Token JWT (JSON Web Token) é um código gerado no login que prova
 * que o usuário é quem ele diz ser, sem precisar salvar sessões no servidor.
 * ============================================================================
 */

const jwt = require('jsonwebtoken');

/**
 * SECRET — chave secreta usada para assinar e verificar os tokens.
 * Em produção, isso deve estar em uma variável de ambiente (.env), nunca no código.
 * Para fins didáticos, deixamos aqui mesmo.
 */
const SECRET = 'codeschool_secret_key';

/**
 * authMiddleware — função que intercepta a requisição.
 * @param {Request}  req  - Objeto da requisição HTTP
 * @param {Response} res  - Objeto da resposta HTTP
 * @param {Function} next - Função que "passa o bastão" para o próximo middleware/controller
 */
const authMiddleware = (req, res, next) => {
    // O Token deve vir no cabeçalho (header) da requisição, no campo "Authorization"
    // Formato esperado: "Bearer eyJhbGciOiJIUzI1NiJ9..."
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        return res.status(401).json({ error: 'Acesso negado: nenhum token fornecido.' });
    }

    // Separamos "Bearer" do token real: ['Bearer', 'eyJ...']
    const token = tokenHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido.' });
    }

    // jwt.verify() tenta decodificar o token usando nossa chave secreta.
    // Se o token for inválido ou expirado, ele lança um erro.
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }

        // Salvamos o ID do usuário no objeto req para que o controller possa usar se quiser
        req.userId = decoded.id;

        // Tudo OK! Chama o próximo passo (o controller)
        next();
    });
};

module.exports = { authMiddleware, SECRET };