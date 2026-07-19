const express = require('express')
const path = require('path')
const cors = require('cors')
const database = require('./config/db-connection')


const app = express()
const port = 3000

app.use(express.json())

//accessing routes files
const signupRoutes = require('./routes/signupRoutes')

//routes
app.use('/users',signupRoutes)

//accessing frontend folder
app.use(express.static(path.join(__dirname,'../frontend')))


//html pages
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/signup/signup.html'))
})


database.sync({alter:true})
.then(()=>{
    app.listen(port,()=>{
        console.log('server is listening...')
    })
})
.catch((err)=>{
    console.log(err.message)
})

