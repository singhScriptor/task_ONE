const express = require('express')
const router = express.Router()

const signupControl = require('../controllers/signupController')

//link for routing
router.post('/signup',signupControl.signupUser)

module.exports = router

