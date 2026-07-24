const jwt = require('jsonwebtoken')
const signinServices = require('../services/signinServices')

exports.signinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await signinServices.signIn({ email, password })

    // create JWT with user id
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

    // set cookie here
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path:'/'
    })

    res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      name: user.name
    })
  } catch (err) {
    next(err)
  }
}
