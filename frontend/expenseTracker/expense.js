// backend api endpoints
const BASE_URL = 'http://localhost:3000/api';
const EXPENSE_URL = `${BASE_URL}/expenses`;
const BUDGET_URL = `${BASE_URL}/budget`;
const summary_URL = `${BASE_URL}/expenses/ai`;

const form = document.getElementById('form');
if (form) {
    form.addEventListener('submit', addExpense);
}

// track budget in memory
let currentBudget = 0;

// add new expense
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

        // refresh numbers
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
        if (balanceEl) balanceEl.innerText = `₹${budgetValue - totalExpense}`;
    } catch (err) {
        console.error("Dashboard update failed:", err);
    }
}

// set or edit user budget
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

// load initial data on page load
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

async function updateSummary() {
    try {
        const res = await axios.get(`${summary_URL}/summary`, { withCredentials: true });
        const summaryEl = document.querySelector('.summary');

        if (summaryEl && res.data.summary) {
            summaryEl.innerHTML = `<p>${res.data.summary}</p>`;
        }
    } catch (err) {
        console.error("Failed to load summary:", err.message);
    }
}

// fetch ai summary
document.addEventListener('DOMContentLoaded', async () => {
    await updateSummary();
});

// logout handler
const logoutBtn = document.createElement("button");
logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
logoutBtn.id = "logoutBtn";

logoutBtn.addEventListener("click", async () => {
    try {
        // await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true });
        window.location.href = "../signin/signin.html";
    } catch (err) {
        console.error("Logout failed:", err.message);
    }
});

document.body.appendChild(logoutBtn);