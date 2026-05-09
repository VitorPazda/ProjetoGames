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
const NewsController = require('../controllers/NewsController');
const { authMiddleware } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');

const routes = Router();

// Exibe todas as notícias para o site de forma aberta
routes.get('/news', NewsController.index);

// Apenas usuários que passarem na checagem do Token poderão injetar ou apagar notícias.
// upload.single('image') → processa UM arquivo cujo campo se chama "image" no FormData.
routes.post('/news', authMiddleware, upload.single('image'), NewsController.store);
routes.delete('/news/:id', authMiddleware, NewsController.destroy);

module.exports = routes;
