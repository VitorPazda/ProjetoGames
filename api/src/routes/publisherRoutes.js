/**
 * ARQUIVO DE ROTAS: FORMAÇÕES
 * -----------------------------------------
 * Agrupa as rotas de listagem, criação e exclusão de Formações.
 */
const { Router } = require('express');
const PublisherController = require('../controllers/PublisherController');

// Importamos nosso "vigia" (middleware) que impede acesso não autorizado
const { authMiddleware } = require('../middlewares/auth');

const routes = Router();

// ROTA PÚBLICA: GET -> Ler dados. Qualquer visitante pode acessar essa URL.
routes.get('/publisher', PublisherController.index);

/*
 * ROTAS PRIVADAS: POST (Criar) e DELETE (Apagar).
 * Note que passamos o 'authMiddleware' ANTES do FormationController.
 * Isso significa: "Express, antes de executar o código do controlador, 
 * passe na recepção (authMiddleware) e verifique a identidade do usuário".
 */
routes.post('/publisher', authMiddleware, PublisherController.store);
routes.delete('/publisher/:id', authMiddleware, PublisherController.destroy);

module.exports = routes;
