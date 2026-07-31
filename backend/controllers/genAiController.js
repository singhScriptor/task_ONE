const genaiService = require('../services/genaiServices')
const Expenses = require('../models/expenses')

exports.addExpense = async(req,res,next)=>{
    try{
        const {description, amount}= req.body
        const category = await genaiService.categorizeExpenses(description)
        const expense = await Expenses.create({description,amount,category})
        res.json({success: true,data:expense})
    }catch(err){
        next(err)
    }
}

exports.getMonthlySummary = async(req,res,next)=>{
    try{
        const expenses = await Expenses.findAll()
        const summary = await genaiService.summarizeExpenses(expenses)
        res.json({success:true, summary})
    }catch(err){
        next(err)
    }
}
