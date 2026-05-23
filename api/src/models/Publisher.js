const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publisher = sequelize.define('Publisher', {
    id: {
        type:   DataTypes.INTEGER,
        primaryKey:     true,
        autoIncrement: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    country: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Publisher;