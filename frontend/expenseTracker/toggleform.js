function showSection(section) {
    const expenseForm = document.getElementById('form');
    const budgetForm = document.getElementById('budgetForm');
    const expenseBtn = document.getElementById('expenseHeader');
    const budgetBtn = document.getElementById('budgetHeader');
    const budgetInput = document.getElementById('budgetInput');
    const saveBudgetBtn = document.getElementById('saveBudgetBtn');

    if (section === 'expense') {
        expenseForm.style.display = 'block';
        budgetForm.style.display = 'none';

        expenseBtn.style.background = 'var(--primary-gradient)';
        expenseBtn.style.color = '#fff';
        expenseBtn.style.border = '1px solid var(--accent-purple)';

        budgetBtn.style.background = 'var(--card-bg)';
        budgetBtn.style.color = 'var(--text-muted)';
        budgetBtn.style.border = '1px solid var(--border-color)';
    } else {
        expenseForm.style.display = 'none';
        budgetForm.style.display = 'block';

        // FIX: Check userCurrentBudget from expense.js or check if input already has a value
        let activeBudgetAmount = typeof userCurrentBudget !== 'undefined' ? userCurrentBudget : parseFloat(budgetInput.value);

        if (activeBudgetAmount > 0) {
            budgetInput.value = activeBudgetAmount;
            budgetBtn.innerText = 'Edit Budget';
            saveBudgetBtn.innerText = 'Update Budget';
        } else {
            budgetInput.value = '';
            budgetBtn.innerText = 'Add Budget';
            saveBudgetBtn.innerText = 'Save Budget';
        }

        budgetBtn.style.background = 'var(--primary-gradient)';
        budgetBtn.style.color = '#fff';
        budgetBtn.style.border = '1px solid var(--accent-purple)';

        expenseBtn.style.background = 'var(--card-bg)';
        expenseBtn.style.color = 'var(--text-muted)';
        expenseBtn.style.border = '1px solid var(--border-color)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('expense');
});