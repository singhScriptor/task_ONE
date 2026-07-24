const expenses = require('../models/expenses')

exports.createExpense = async(data,userId)=>{
    try{
        const result = await expenses.create({
            price : data.price,
            description: data.description,
            category : data.category,
            userId:userId
        })
        return result.toJSON()
    }
    catch(err){
        err.statusCode = 500
        throw err
    }
}

exports.getAllExpenseById = async(userId)=>{
    try{
        const result = await expenses.findAll({
            where : {userId: userId}
        })
        return result.map(e=>e.toJSON())
    }
    catch(err){
        err.statusCode = 500
        throw err
    }
}

exports.getAllExpenseByIdAndUserId = async (id ,userId) =>{
    try{
        return await expenses.findOne({
            where : {id, userId}
        })
    }
    catch(err){
        err.statusCode = 500
        throw err
    }
}

exports.deleteExpenseByIdAndUserId = async(id,userId) =>{
    try{
        const result = await expenses.findOne({
            where : {id, userId}
        })
        if(!result){
            return null
        }
        await result.destroy()
        return true
    }
    catch(err){
        err.statusCode = 500
        throw err
    }
}