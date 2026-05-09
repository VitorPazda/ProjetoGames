/**
 * ============================================================================
 * MODEL: User (Usuário Administrador)
 * ============================================================================
 * Um "Model" no Sequelize representa uma TABELA no banco de dados.
 * Cada propriedade definida aqui se torna uma COLUNA na tabela.
 *
 * O Sequelize usa o DataTypes para definir o tipo de dado de cada coluna.
 * Quando rodamos sequelize.sync(), ele cria a tabela automaticamente.
 *
 * Esta tabela armazenará apenas os usuários do painel administrativo.
 * A senha sempre deve ser salva CRIPTOGRAFADA (nunca em texto puro!)
 * ============================================================================
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const User = sequelize.define('User', {
    // Chave primária: valor único e incremental para identificar cada registro
    id: {
        type:          DataTypes.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
    },

    // Nome do usuário (ex: "João Admin")
    name: {
        type:      DataTypes.STRING,
        allowNull: false, // obrigatório — não pode ser vazio
    },

    // E-mail único usado para login
    email: {
        type:      DataTypes.STRING,
        allowNull: false,
        unique:    true, // não pode repetir no banco
    },

    // Senha — ATENÇÃO: aqui salvamos o hash (gerado com bcrypt), nunca a senha original!
    password: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;
