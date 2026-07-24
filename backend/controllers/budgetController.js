const budgetServices = require('../services/budgetServices')

exports.addBudget = async(req,res,next)=>{
    try{
        const {amount} = req.body
        const userId = req.user.id

        const result = await budgetServices.addBudget({amount},userId)

        res.status(201).json(result)
    }
    catch(err){
        next(err)
    }
}

exports.getBudget = async(req,res,next)=>{
    try{
        const userId = req.user.id
        const result = await budgetServices.getBudget(userId)

        res.status(200).json(result)
    }
    catch(err){
        next(err)
    }
}