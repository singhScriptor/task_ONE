const forgotServices = require("../services/forgotServices");

exports.forgotPassword = async (req, res,next) => {
  try {
    const { email } = req.body;
    const result = await forgotServices.forgotPassword(email);

    return res.status(200).json(result);
  } catch (err) {
    err.statusCode = err.statusCode || 500
    next(err)
  }
};

exports.resetPassword = async(req,res,next)=>{
  try{
    const {id}= req.params
    const result = await forgotServices.resetPassword(id)
    res.status(200).json({message: result})
  }
  catch(err){
    err.statusCode = err.statusCode || 500
    next(err)
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const result = await forgotServices.updatePassword(id, password);

    return res.status(200).json(result);
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};