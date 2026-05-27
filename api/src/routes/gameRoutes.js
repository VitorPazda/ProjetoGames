/**
 * ARQUIVO DE ROTAS: NOTÍCIAS
 * -----------------------------------------
 * Agrupa as rotas conectadas ao módulo de Notícias/Blog.
 *
 * A rota POST agora usa o middleware de upload (Multer) para
 * processar o arquivo de imagem ANTES de chegar no controller.
 * O campo do arquivo no formulário deve se chamar "image".
 */
const { Router } = require('express');
const GameController = require('../controllers/GameController');
const { authMiddleware } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');

const routes = Router();

// Exibe todas as notícias para o site de forma aberta
routes.get('/game', GameController.index);

// Apenas usuários que passarem na checagem do Token poderão injetar ou apagar notícias.
// upload.single('image') → processa UM arquivo cujo campo se chama "image" no FormData.
routes.post('/game', authMiddleware, upload.single('image'), GameController.store);
routes.delete('/game/:id', authMiddleware, GameController.destroy);

module.exports = routes;
