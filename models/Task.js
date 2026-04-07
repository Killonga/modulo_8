const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('todo', 'in-progress', 'done'),
        defaultValue: 'todo'
    }
});

// Associations
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

// Comment Associations
const Comment = require('./Comment');
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Task;
