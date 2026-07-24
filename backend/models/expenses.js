const { DataTypes } = require('sequelize')

const sequelize = require('../config/db-connection')

const expenses = sequelize.define('expenses',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    price:{
        type:DataTypes.DECIMAL,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
    {
        timestamps:false,
        tableName:'expenses'
    }
)

module.exports = expenses
