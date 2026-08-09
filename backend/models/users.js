const { DataTypes } = require('sequelize')

const sequelize = require('../config/db-connection')

const users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    total_expense: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rowsPerPage: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    }
},
    {
        tableName: 'users',
        timestamps: false
    }
)
module.exports = users
