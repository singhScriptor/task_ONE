const signupService = require('../services/signupServices')

exports.signupUser = async(req,res,next)=>{
    try{
        const {name,email,phone,password} = req.body

        //validation
        if(!name  || !email || !phone || !password){
            return res.status(400).json({message:'All fields are required!'})
        }
        const result = await signupService.signup({name,email,phone,password})
        res.status(200).json(result)
    }
    catch(err){
        err.statusCode = 500
        next(err)
    }
}