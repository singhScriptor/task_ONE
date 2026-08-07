const expenseService = require('../services/expensesServices')

exports.addExpenses = async(req,res,next)=>{
    try{
        const {price,description,category} = req.body
        const userId = req.user.id
        const result = await expenseService.createExpense({
            price,
            description,
            category
        },userId)
        res.status(201).json(result)
    }
    catch(err){
        err.statusCode = 500
        next(err)
    }
}

exports.getExpenses = async(req,res,next)=>{
    try{
        const userId = req.user.id
        const expenses = await expenseService.getAllExpenseById(userId)

        res.status(200).json(expenses)
    }
    catch(err){
        err.statusCode = 500
        next(err)
    }
}

exports.deleteExpenses = async(req,res,next)=>{
    try{
        const id = req.params.id
        const userId = req.user.id
        const deleted = await expenseService.deleteExpenseByIdAndUserId(id,userId)

        if(!deleted){
            return res.status(404).json({
                message:"expense not found or authorised"
            })
        }
        res.status(200).json({
            message:'expense successfully deleted'
        })
    }
    catch(err){
        err.statusCode= 500
        next(err)
    }
}

