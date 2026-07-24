const sequelize = require('../config/db-connection')
const User = require('./users')
const expenses = require('./expenses')
const budget = require('./budget')
const subscribtion = require('./subscription')

User.hasMany(expenses, { as: 'expenses', foreignKey: 'userId' });
expenses.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(budget, { as: 'budget', foreignKey: 'userId' });
budget.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(subscribtion, { as: 'subscriptions', foreignKey: 'userId' });
subscribtion.belongsTo(User, { foreignKey: 'userId' });


module.exports = {
    user:User,
    expense:expenses,
    budget:budget,
    subscribtion:subscribtion,
    sequelize
}
