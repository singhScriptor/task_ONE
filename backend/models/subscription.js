const {DataTypes} = require('sequelize')
const sequelize  = require('../config/db-connection')

const payment = sequelize.define('subscriptions',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
    {
        tableName:'subscriptions',
        timestamps:false
    }
)

module.exports = payment