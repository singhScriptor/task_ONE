// Base API URL configuration
const BASE_URL = 'http://localhost:3000/api';
const EXPENSE_URL = `${BASE_URL}/expenses`;
const BUDGET_URL = `${BASE_URL}/budget`;

const form = document.getElementById('form');
if (form) {
    form.addEventListener('submit', addExpense);
}

// Track current budget dynamically
let currentBudget = 0;

// Add Expense Handler
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
        if (form) form.reset();

        // Refresh calculations and leaderboard if active
        await updateDashboard();
        if (typeof window.showLeaderboard === 'function') {
            window.showLeaderboard();
        }
    } catch (err) {
        console.error("Add expense error:", err.message);
    }
}

function addRow(expense) {
    let tableBody = document.getElementById('expense-table');
    if (!tableBody) return;

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
            await updateDashboard();
            if (typeof window.showLeaderboard === 'function') {
                window.showLeaderboard();
            }
        } else {
            alert('Failed to delete expense');
        }
    } catch (err) {
        console.error("Delete expense error:", err.message);
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

        currentBudget = budgetValue;

        const budgetEl = document.getElementById('budget');
        const expenseEl = document.getElementById('expense');
        const balanceEl = document.getElementById('balance');

        if (budgetEl) budgetEl.innerText = `₹${budgetValue}`;
        if (expenseEl) expenseEl.innerText = `₹${totalExpense}`;
        if (balanceEl) balanceEl.innerText = `₹${(budgetValue - totalExpense)}`;
    } catch (err) {
        console.error("Dashboard update failed:", err);
    }
}

// Save / Edit Budget Handler
const saveBudgetBtn = document.getElementById('saveBudgetBtn');
if (saveBudgetBtn) {
    saveBudgetBtn.addEventListener('click', async (e) => {
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
}

// Initial Expense Data Fetching
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await axios.get(EXPENSE_URL, { withCredentials: true });
        const tableBody = document.getElementById('expense-table');
        if (tableBody) tableBody.innerHTML = '';

        res.data.forEach(element => addRow(element));
        await updateDashboard();
    } catch (err) {
        console.error('Error while loading expenses:', err);
    }
});