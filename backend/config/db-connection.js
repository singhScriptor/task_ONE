const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    'expense_tracker',
    'root',
    'Supra@A90',
    {
        host:'localhost',
        dialect:'mysql'
    }
);

(
    async()=>{
        try{
            await sequelize.authenticate()
            console.log('connection created')
        }
        catch(err){
            console.log(err.message)
        }
    }
)()

module.exports = sequelize

