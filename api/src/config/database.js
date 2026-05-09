/**
 * ============================================================================
 * CONFIGURAÇÃO DO BANCO DE DADOS (database.js)
 * ============================================================================
 * O Sequelize é um ORM (Object Relational Mapper).
 * Isso significa que ele permite trabalharmos com o banco de dados
 * usando OBJETOS JavaScript, em vez de escrever SQL na mão.
 *
 * Aqui criamos e exportamos a instância de conexão com o MySQL.
 * Todos os Models (tabelas) irão importar esse arquivo para se conectar.
 * ============================================================================
 */

const { Sequelize } = require('sequelize');

/**
 * new Sequelize(banco, usuario, senha, opções)
 * Parâmetros:
 *   - 'codeschool' → nome do banco de dados criado no MySQL
 *   - 'root'       → usuário do MySQL
 *   - '...'        → senha do MySQL
 */
const sequelize = new Sequelize('projetogames', 'root', 'mitona@', {
    host:    'localhost', // endereço do servidor de banco de dados
    port:    3306,        // porta padrão do MySQL
    dialect: 'mysql',     // tipo do banco (mysql, postgres, sqlite, etc.)
    logging: false,       // false = não exibe as queries SQL no console (deixe true para debug)
});

module.exports = sequelize;
