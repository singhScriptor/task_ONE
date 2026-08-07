const {DataTypes} = require('sequelize')

const Sequelize = require('../config/db-connection')



const reset =  Sequelize.define('forgotPasswordRequest',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'id'
        }
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    }
},
    {
        timestamps:true,
        tableName:'forgotPasswordRequest'
    }
)

module.exports = reset