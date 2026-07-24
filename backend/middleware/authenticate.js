const jwt = require('jsonwebtoken')

const authenticate  = async(req,res, next)=>{
    try{
        const token = req.cookies.token

        if(!token){
            return res.status(401).json({error:'Token missing'})
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decode
        next()
    }
    catch(err){
        err.statusCode = 401
        err.message = 'unauthorised '
        next(err)
    }
}
 module.exports = authenticate