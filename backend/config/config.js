require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER||"root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "expense_tracker",
    host: process.env.DB_HOST||"localhost",
    dialect: "mysql"
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST||"database_test",
    host: process.env.DB_HOST ||"localhost",
    dialect: "mysql"
  },
  production: {
    username:process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database:process.env.DB_PRODUCTION || "database_production",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  }
};