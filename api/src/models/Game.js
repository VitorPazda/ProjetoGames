const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Games = sequelize.define('Games', {
    idGame: {
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

module.exports = Games;