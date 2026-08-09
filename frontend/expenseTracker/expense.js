// backend api endpoints
const BASE_URL = 'http://localhost:3000/api';
const EXPENSE_URL = `${BASE_URL}/expenses`;
const BUDGET_URL = `${BASE_URL}/budget`;
const summary_URL = `${BASE_URL}/expenses/ai`;

const form = document.getElementById('form');
if (form) {
    form.addEventListener('submit', addExpense);
}

// Track budget and pagination in memory
let currentBudget = 0;
let currentPage = 1;
const rowsPerPage = 10;
let allExpenses = [];

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

        allExpenses.push(expense);
        currentPage = Math.ceil(allExpenses.length / rowsPerPage); // Jump to last page to see new entry
        renderExpensesPage();

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

// Render  10 Expenses in one page  & Update Pagination UI
function renderExpensesPage() {
    let tableBody = document.getElementById('expense-table');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    let totalPages = parseInt(allExpenses.length / rowsPerPage);
    if (allExpenses.length % rowsPerPage !== 0) {
        totalPages = totalPages + 1;
    }
    if (totalPages < 1) {
        totalPages = 1;
    }
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let pageItems = allExpenses.slice(start, end);

    pageItems.forEach(expense => {
        let row = document.createElement('tr');
        row.id = `expense_row_${expense.id}`;
        row.innerHTML = `
            <td>${expense.price}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td><button onclick="deleteExpense(${expense.id})" style="border:none; cursor:pointer; background:none"><i class="fa fa-trash"></i></button></td>
        `;
        tableBody.appendChild(row);
    });

    // Updated expense section Pagination Controls
    const expenseSection = document.getElementById('expenses');
    if (expenseSection) {
        let pageInfo = expenseSection.querySelector('.pageInfo');
        let prevBtn = expenseSection.querySelector('.prevPageBtn');
        let nextBtn = expenseSection.querySelector('.nextPageBtn');

        if (pageInfo) {
            pageInfo.innerText =
                `Page ${currentPage} of ${totalPages}`;
        }
        if (prevBtn) {
            prevBtn.disabled = (currentPage === 1);
        }
        if (nextBtn) {
            nextBtn.disabled = (currentPage >= totalPages);
        }
    }
}

async function deleteExpense(id) {
    try {
        let result = await axios.delete(`${EXPENSE_URL}/${id}`, { withCredentials: true });

        if (result) {
            allExpenses = allExpenses.filter(item => item.id !== id);
            renderExpensesPage();
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

        const totalExpense = allExpenses.reduce((sum, item) => sum + parseFloat(item.price), 0);
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
        allExpenses = res.data || [];
        currentPage = 1;
        renderExpensesPage();
        await updateDashboard();
        await updateSummary();
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

// Class-based Pagination
document.addEventListener('click', (event) => {
    const btn = event.target.closest('.pagination-btn');
    if (!btn) return;

    const section = btn.closest('.tab-section');
    if (!section || section.id !== 'expenses') return;

    let totalPages = parseInt(allExpenses.length / rowsPerPage);
    if (allExpenses.length % rowsPerPage !== 0) {
        totalPages = totalPages + 1;
    }
    if (totalPages < 1) {
        totalPages = 1;
    }

    if (btn.classList.contains('firstPageBtn')) {
        currentPage = 1;
    } else if (btn.classList.contains('prevPageBtn') && currentPage > 1) {
        currentPage--;
    } else if (btn.classList.contains('nextPageBtn') && currentPage < totalPages) {
        currentPage++;
    } else if (btn.classList.contains('lastPageBtn')) {
        currentPage = totalPages;
    }

    renderExpensesPage();
});

// logout handler
const logoutBtn = document.createElement("button");
logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
logoutBtn.id = "logoutBtn";

logoutBtn.addEventListener("click", async () => {
    try {
        window.location.href = "../signin/signin.html";
    } catch (err) {
        console.error("Logout failed:", err.message);
    }
});

document.body.appendChild(logoutBtn);