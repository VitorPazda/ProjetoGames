const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Release = sequelize.define('Releases', {
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

    game: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Release;