const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
        host: process.env.DB_HOST,
        dialect: process.env.DIALECT || 'mysql',
        logging: false
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

