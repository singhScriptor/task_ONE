const express = require('express')
const router = express.Router()

const signinControl = require('../controllers/signinController')
const jwt = require('jsonwebtoken')

router.post('/signin',signinControl.signinUser)

module.exports = router