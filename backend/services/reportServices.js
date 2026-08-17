const Expense = require('../models/expenses');
const User = require('../models/users');
const Budget = require('../models/budget');

exports.getFilteredExpenses = async function (userId, reportType, selectedDate) {
    // 1. Check if the user exists
    const foundUser = await User.findByPk(userId);
    if (!foundUser) {
        throw new Error("User not found");
    }

    // 2. Fetch the user's budget from the budget table
    const userBudgetRecord = await Budget.findOne({ where: { userId: userId } });
    const userBudgetAmount = userBudgetRecord && userBudgetRecord.amount ? Number(userBudgetRecord.amount) : 0;

    // 3. Fetch all expenses for this user
    const allUserExpenses = await Expense.findAll({
        where: { userId: userId },
        order: [['date', 'DESC']]
    });

    let groupedReportData = {};
    let finalTotalIncome = 0;
    let finalTotalExpense = 0;

    // 4. Loop through expenses to group them by date, month, or year
    allUserExpenses.forEach(function (singleExpense) {
        let transactionDate = new Date(singleExpense.date || singleExpense.createdAt);
        if (isNaN(transactionDate)) {
            return;
        }

        let fullDateString = transactionDate.toISOString().split('T')[0];
        let yearMonthString = fullDateString.slice(0, 7);
        let yearString = transactionDate.getFullYear().toString();

        let groupingKey = fullDateString;
        if (reportType === 'monthly') {
            groupingKey = yearMonthString;
        } else if (reportType === 'yearly') {
            groupingKey = yearString;
        }

        // Filter out if it doesn't match the selected date/year/month
        if (selectedDate) {
            if (reportType === 'yearly' && !fullDateString.startsWith(selectedDate)) {
                return;
            }
            if (reportType === 'monthly' && !fullDateString.startsWith(selectedDate)) {
                return;
            }
            if (reportType === 'daily' && groupingKey !== selectedDate) {
                return;
            }
        }

        // If this time period doesn't exist yet, start its income with the user's budget
        if (!groupedReportData[groupingKey]) {
            groupedReportData[groupingKey] = { income: userBudgetAmount, expense: 0 };
        }

        let expenseAmount = Number(singleExpense.price || singleExpense.amount) || 0;

        // Add to income or expense accordingly
        if (singleExpense.type === 'income') {
            groupedReportData[groupingKey].income += expenseAmount;
        } else {
            groupedReportData[groupingKey].expense += expenseAmount;
        }
    });

    // 5. Convert grouped data into final rows for the frontend
    let periodKeysList = Object.keys(groupedReportData).sort().reverse();
    let generatedRows = periodKeysList.map(function (currentPeriodKey) {
        let periodIncomeValue = groupedReportData[currentPeriodKey].income;
        let periodExpenseValue = groupedReportData[currentPeriodKey].expense;
        let periodSavingsValue = periodIncomeValue - periodExpenseValue;

        finalTotalIncome += periodIncomeValue;
        finalTotalExpense += periodExpenseValue;

        return {
            period: currentPeriodKey,
            income: periodIncomeValue,
            expense: periodExpenseValue,
            saving: periodSavingsValue
        };
    });

    return {
        totalIncome: finalTotalIncome,
        totalExpense: finalTotalExpense,
        netSavings: finalTotalIncome - finalTotalExpense,
        rows: generatedRows,
        budget: userBudgetAmount
    };
};