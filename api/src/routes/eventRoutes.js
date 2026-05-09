/**
 * ARQUIVO DE ROTAS: EVENTOS
 * -----------------------------------------
 * Controla os eventos da nossa escola.
 */
const { Router } = require('express');
const EventController = require('../controllers/EventController');
const { authMiddleware } = require('../middlewares/auth');

const routes = Router();

// Método GET: Pegar os eventos salvos
routes.get('/events', EventController.index);

// Método POST e DELETE protegidos pelo middleware
routes.post('/events', authMiddleware, EventController.store);
routes.delete('/events/:id', authMiddleware, EventController.destroy);

module.exports = routes;
