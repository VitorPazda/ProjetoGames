/**
 * ARQUIVO DE ROTAS: AUTENTICAÇÃO
 * -----------------------------------------
 * Aqui definimos as rotas (caminhos URLs) relacionadas ao acesso e login.
 * O Express Router nos permite separar as rotas do projeto em vários arquivos
 * para que não vire uma "bagunça" em um arquivo só.
 */
const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const routes = Router();

// Quando o navegador/Axios fizer um POST na rota /login, redirecionamos para o método 'login' do controle.
routes.post('/login', AuthController.login);

module.exports = routes;
