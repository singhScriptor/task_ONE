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
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'expense'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
    {
        timestamps:true,
        tableName:'expenses'
    }
)

module.exports = expenses
