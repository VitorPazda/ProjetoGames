/**
 * ============================================================================
 * MODEL: Formation (Formação / Curso)
 * ============================================================================
 * Representa a tabela de cursos exibidos na seção "Nossas Formações" do site.
 *
 * Campos:
 *   - title:       Nome do curso (ex: "Frontend Developer")
 *   - description: Breve descrição do que o aluno aprenderá
 *   - icon:        Classe CSS do ícone do Phosphor Icons (ex: "ph ph-laptop")
 * ============================================================================
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Formation = sequelize.define('Formation', {
    id: {
        type:          DataTypes.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
    },

    // Título do curso
    title: {
        type:      DataTypes.STRING,
        allowNull: false,
    },

    // Texto de descrição que aparece no card do site
    description: {
        type:      DataTypes.TEXT, // TEXT suporta textos longos; STRING é limitado a ~255 chars
        allowNull: false,
    },

    // Classe do ícone da biblioteca Phosphor Icons
    // Exemplo: "ph ph-laptop", "ph ph-database", "ph ph-shield-check"
    icon: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Formation;
