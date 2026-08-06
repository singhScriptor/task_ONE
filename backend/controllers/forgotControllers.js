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