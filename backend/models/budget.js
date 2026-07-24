const { DataTypes } = require('sequelize')

const sequelize = require('../config/db-connection')

const budget = sequelize.define('budget',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true
    }
},
    {
        tableName:'budget',
        timestamps:false
    }
)

module.exports = budget