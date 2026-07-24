// Base API URL configuration
const BASE_URL = 'http://localhost:3000/api';
const EXPENSE_URL = `${BASE_URL}/expenses`;
const BUDGET_URL = `${BASE_URL}/budget`;

const form = document.getElementById('form');
form.addEventListener('submit', addExpense);

// Track current budget dynamically
let currentBudget = 0;

// Section Switcher (Expense / Budget Tabs)
function showSection(section) {
    const expenseForm = document.getElementById('form');
    const budgetForm = document.getElementById('budgetForm');
    const expenseBtn = document.getElementById('expenseHeader');
    const budgetBtn = document.getElementById('budgetHeader');
    const budgetInput = document.getElementById('budgetInput');
    const saveBudgetBtn = document.getElementById('saveBudgetBtn');

    if (section === 'expense') {
        // Show Expense Form
        expenseForm.style.display = 'block';
        budgetForm.style.display = 'none';

        // Style Expense Button as Active
        expenseBtn.style.background = '#11998e';
        expenseBtn.style.color = 'white';
        expenseBtn.style.border = '1px solid #11998e';

        // Style Budget Button as Inactive
        budgetBtn.style.background = 'white';
        budgetBtn.style.color = '#636e72';
        budgetBtn.style.border = '1px solid #ccc';
    } else {
        // Show Budget Form
        expenseForm.style.display = 'none';
        budgetForm.style.display = 'block';

        // Pre-fill existing budget if available and change button label
        if (currentBudget > 0) {
            budgetInput.value = currentBudget;
            saveBudgetBtn.innerText = 'Update Budget';
        } else {
            budgetInput.value = '';
            saveBudgetBtn.innerText = 'Save Budget';
        }

        // Style Budget Button as Active
        budgetBtn.style.background = '#11998e';
        budgetBtn.style.color = 'white';
        budgetBtn.style.border = '1px solid #11998e';

        // Style Expense Button as Inactive
        expenseBtn.style.background = 'white';
        expenseBtn.style.color = '#636e72';
        expenseBtn.style.border = '1px solid #ccc';
    }
}

// Combined addExpense function
async function addExpense(event) {
    event.preventDefault();
    try {
        const details = {
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value
        };

        let result = await axios.post(EXPENSE_URL, details, { withCredentials: true });
        const expense = result.data;

        addRow(expense);
        form.reset();

        // Refresh the dashboard totals after adding
        updateDashboard();
    } catch (err) {
        console.log(err.message);
    }
}

function addRow(expense) {
    let tableBody = document.getElementById('expense-table');
    let row = document.createElement('tr');
    row.id = `expense_row_${expense.id}`;
    row.innerHTML = `
            <td>${expense.price}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td><button onclick="deleteExpense(${expense.id})" style="border:none; cursor:pointer; background:none"><i class="fa fa-trash"></i></button></td>
        `;
    tableBody.appendChild(row);
}

async function deleteExpense(id) {
    try {
        let result = await axios.delete(`${EXPENSE_URL}/${id}`, { withCredentials: true });
        if (result) {
            document.getElementById(`expense_row_${id}`)?.remove();
            updateDashboard(); // Refresh after deleting
        } else {
            alert('failed to delete');
        }
    } catch (err) {
        console.log(err.message);
    }
}

async function updateDashboard() {
    try {
        const [expenseRes, budgetRes] = await Promise.all([
            axios.get(EXPENSE_URL, { withCredentials: true }),
            axios.get(`${BUDGET_URL}/get-budget`, { withCredentials: true })
        ]);

        const totalExpense = expenseRes.data.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const budgetValue = parseFloat(budgetRes.data?.amount) || 0;

        // Keep local tracking variable in sync
        currentBudget = budgetValue;

        document.getElementById('budget').innerText = `₹${budgetValue}`;
        document.getElementById('expense').innerText = `₹${totalExpense}`;
        document.getElementById('balance').innerText = `₹${(budgetValue - totalExpense)}`;
    } catch (err) {
        console.error("Dashboard update failed:", err);
    }
}

// Save / Edit Budget Handler
document.getElementById('saveBudgetBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const val = document.getElementById('budgetInput').value;

    if (!val || val <= 0) {
        alert('Please enter a valid budget amount');
        return;
    }

    try {
        await axios.post(`${BUDGET_URL}/add-budget`, { amount: val }, { withCredentials: true });

        await updateDashboard();
        showSection('expense');
    } catch (err) {
        console.error('Failed to save budget:', err);
    }
});

// Single DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await axios.get(EXPENSE_URL, { withCredentials: true });
        res.data.forEach(element => addRow(element));
        await updateDashboard();
    } catch (err) {
        console.log('Error while loading', err);
    }
});