const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Comment;
