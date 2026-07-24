const budget = require('../models/budget')

exports.addBudget = async(data,userId)=>{
    try{
        const result = (await budget.upsert(
            {
                amount:data.amount,
                userId:userId
            }
        ))[0]
        return result.toJSON()
    }
    catch(err){
        err.statusCode = 500
        throw err
    }
}

exports.getBudget = async(userId)=>{
    try{
        const result = await budget.findOne({where : {userId}})

        if(!result){
            return { amount : 0 }
        }

        return result.toJSON()
    }
    catch(err){
        err.statusCode = 500
        throw err
    }
}