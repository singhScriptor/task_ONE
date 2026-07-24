const users = require('../models/users')
const bcrypt = require('bcrypt')

exports.signIn = async (data) => {
    try {
        const { email, password } = data

        // finding through unique email id
        const user = await users.findOne({ where: { email } })
        if (!user) {
            const error = new Error('user not found signup first')
            error.statusCode = 404;
            throw error;
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            const error = new Error("Invalid Credential")
            error.statusCode = 401;
            throw error;

        }
        const userData = user.toJSON()
        // this will protect password show  inside frontend
        delete userData.password
        return userData
    }
    catch (err) {
        err.statusCode = 500;
        throw err
    }
}