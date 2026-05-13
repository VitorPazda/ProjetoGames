/**
 * ============================================================================
 * MODEL: News (Notícias do Blog)
 * ============================================================================
 * Cada registro aqui é uma notícia/post exibida na seção "Recentes no Blog".
 *
 * Campos:
 *   - title:     Título da notícia
 *   - date:      Data em formato textual (ex: "10 de Outubro, 2024")
 *   - description: Resumo do conteúdo
 *   - image_url: Endereço (URL) da imagem que aparece ao lado do texto
 * ============================================================================
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const News = sequelize.define('News', {
    id: {
        type:          DataTypes.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
    },

    title: {
        type:      DataTypes.STRING,
        allowNull: false,
    },

    // Usamos STRING (texto livre) para a data para que o admin possa escrever
    // no formato que preferir: "10 de Outubro, 2024" ou "2024-10-10" etc.
    date: {
        type:      DataTypes.STRING,
        allowNull: false,
    },

    // Resumo ou parágrafo inicial da notícia
    description: {
        type:      DataTypes.TEXT,
        allowNull: false,
    },

    // URL completa da imagem (pode ser do próprio servidor ou de um CDN/Unsplash)
    image_url: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = News;
