const fs = require('fs')
const path = require('path')


module.exports = async (err, req, res, next) => {
    const logEntry = `[${new Date().toISOString()}]${err.name}: ${err.message}\nStack:${err.stack}\n--\n`;

    fs.appendFile(path.join(__dirname,'../error.log'),logEntry,(writeErr)=>{
        if(writeErr){
            console.error('Failed to write to error log file:',writeErr)
        }
    })

    res.status(err.statusCode || 500).json({
        message: err.message
    });

};
