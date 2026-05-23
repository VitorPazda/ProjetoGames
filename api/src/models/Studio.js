/**
 * ============================================================================
 * MODEL: Event (Próximos Eventos)
 * ============================================================================
 * Representa a tabela de eventos exibidos na seção "Próximos Eventos" do site.
 * O design do site exibe uma calendário visual com Dia e Mês separados,
 * por isso salvamos esses dois campos separadamente.
 *
 * Campos:
 *   - title:    Título do evento (ex: "Workshop de CSS Grid")
 *   - day:      Dia do evento em texto (ex: "15")
 *   - month:    Mês abreviado em maiúsculas (ex: "NOV")
 *   - location: Local onde acontecerá (ex: "Auditório Principal")
 *   - time:     Horário no formato HH:MM (ex: "19:30")
 * ============================================================================
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Studio = sequelize.define('Studio', {
    id: {
        type:          DataTypes.INTEGER,
        primaryKey:    true,
        autoIncrement: true,
    },

    name: {
        type:      DataTypes.STRING,
        allowNull: false,
    },

    // Dia numérico, salvo como texto para evitar formatações indesejadas
    foundationYear: {
        type:      DataTypes.INTEGER,
        allowNull: false,
    },

    // Mês abreviado em maiúsculas, pois o CSS do site os exibe assim
    country: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Studio;
