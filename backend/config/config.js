require('dotenv').config();

module.exports = {
  development: {
    username: "root",
    password: process.env.LOCALHOST_PASSWORD,
    database: "expense_tracker",
    host: "localhost",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: process.env.LOCALHOST_PASSWORD,
    database: "database_test",
    host: "localhost",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: process.env.LOCALHOST_PASSWORD,
    database: "database_production",
    host: "localhost",
    dialect: "mysql"
  }
};