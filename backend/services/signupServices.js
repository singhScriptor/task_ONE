const users = require('../models/users')
const bcrypt = require('bcrypt')


exports.signup = async(data)=>{
    const {name,email,phone,password} = data

    const existingUser = await users.findOne({where : {email}});

    // if already user they can't singup
    if(existingUser){
        const error = new Error('user already has an account with this emailId')
        error.statusCode = 409
        throw error;
    }
    //hashPassword
    const hashPassword = await bcrypt.hash(password,10)

    const newUser = await users.create({
        name,email,phone,password:hashPassword
    })
    const userData = newUser.toJSON()
    // this will protect password show  inside frontend
    delete userData.password
    return userData

}
