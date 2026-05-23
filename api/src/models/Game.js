const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Games', {
    id: {
        type:   DataTypes.INTEGER,
        primaryKey:     true,
        autoIncrement: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    genre: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Game;