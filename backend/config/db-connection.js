const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    'expense_tracker',
    'root',
    process.env.LOCALHOST_PASSWORD,
    {
        host:'localhost',
        dialect:'mysql',
        logging:false
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

