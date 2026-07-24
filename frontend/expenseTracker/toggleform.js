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

        expenseBtn.style.background = '#11998e';
        expenseBtn.style.color = 'white';
        expenseBtn.style.border = '1px solid #11998e';

        budgetBtn.style.background = 'white';
        budgetBtn.style.color = '#636e72';
        budgetBtn.style.border = '1px solid #ccc';
    } else {
        expenseForm.style.display = 'none';
        budgetForm.style.display = 'block';

        // Update both the Tab Header and the Form Submit Button
        if (typeof currentBudget !== 'undefined' && currentBudget > 0) {
            budgetInput.value = currentBudget;
            budgetBtn.innerText = 'Edit Budget';       // Updates tab header text
            saveBudgetBtn.innerText = 'Update Budget'; // Updates form submit button text
        } else {
            budgetInput.value = '';
            budgetBtn.innerText = 'Add Budget';
            saveBudgetBtn.innerText = 'Save Budget';
        }

        budgetBtn.style.background = '#11998e';
        budgetBtn.style.color = 'white';
        budgetBtn.style.border = '1px solid #11998e';

        expenseBtn.style.background = 'white';
        expenseBtn.style.color = '#636e72';
        expenseBtn.style.border = '1px solid #ccc';
    }
}