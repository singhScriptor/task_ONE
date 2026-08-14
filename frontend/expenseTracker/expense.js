const BASE_URL = 'http://localhost:3000/api';
const EXPENSE_URL = `${BASE_URL}/expenses`;
const BUDGET_URL = `${BASE_URL}/budget`;
const SUMMARY_URL = `${BASE_URL}/expenses/ai`;

const form = document.getElementById('form');
if (form) form.addEventListener('submit', addExpense);

let currentBudget = 0;
let currentExpensePage = parseInt(localStorage.getItem('expense_currentPage')) || 1;
let currentLeaderPage = parseInt(localStorage.getItem('leader_currentPage')) || 1;
let rowsPerPage = parseInt(localStorage.getItem('expense_rowsPerPage')) || 10;

let allExpenses = [];
let allLeaderboardData = [];

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-select')) {
        rowsPerPage = parseInt(e.target.value) || 10;
        currentExpensePage = 1;
        currentLeaderPage = 1;

        localStorage.setItem('expense_rowsPerPage', rowsPerPage);
        localStorage.setItem('expense_currentPage', currentExpensePage);
        localStorage.setItem('leader_currentPage', currentLeaderPage);

        renderExpensesPage();
        if (typeof renderLeaderboardPage === 'function'){
            renderLeaderboardPage();
        }
    }
});

async function addExpense(e) {
    e.preventDefault();
    try {
        const payload = {
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value
        };

        const res = await axios.post(EXPENSE_URL, payload,
            { withCredentials: true }
        );
        allExpenses.push(res.data);

        const rem = allExpenses.length % rowsPerPage;
        currentExpensePage = rem > 0 ? (allExpenses.length - rem) / rowsPerPage + 1 : (allExpenses.length - rem) / rowsPerPage;
        if (currentExpensePage < 1) currentExpensePage = 1;

        localStorage.setItem('expense_currentPage', currentExpensePage);
        renderExpensesPage();

        if (form){
            form.reset();
        }
        await updateDashboard();

        if (typeof window.showLeaderboard === 'function'){
            window.showLeaderboard();
        }
    } catch (err) {
        console.log("Error adding expense:", err.message);
    }
}

function renderExpensesPage() {
    const tbody = document.getElementById('expense-table');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rem = allExpenses.length % rowsPerPage;
    let totalPages = rem > 0 ? (allExpenses.length - rem) / rowsPerPage + 1 : (allExpenses.length - rem) / rowsPerPage;
    if (totalPages < 1){
        totalPages = 1;
    }

    if (currentExpensePage > totalPages){
        currentExpensePage = totalPages;
    }
    if (currentExpensePage < 1){
        currentExpensePage = 1;
    }

    localStorage.setItem('expense_currentPage', currentExpensePage);

    const start = (currentExpensePage - 1) * rowsPerPage;
    const pageItems = allExpenses.slice(start, start + rowsPerPage);

    pageItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.id = `expense_row_${item.id}`;
        tr.innerHTML = `
            <td>${item.price}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td><button onclick="deleteExpense(${item.id})" style="border:none; cursor:pointer; background:none"><i class="fa fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });

    const section = document.getElementById('expenses');
    if (section) {
        const info = section.querySelector('.pageInfo');
        const prev = section.querySelector('.prevPageBtn');
        const next = section.querySelector('.nextPageBtn');

        if (info) {
            info.innerText = `Page ${currentExpensePage} of ${totalPages}`;
        }
        if (prev) {
            prev.disabled = currentExpensePage === 1;
        }
        if (next) {
            next.disabled = currentExpensePage >= totalPages;
        }

        const select = section.querySelector('.row-select');
        if (select) {
            select.value = rowsPerPage;
        }
    }
}

function renderLeaderboardPage() {
    const tbody = document.getElementById('leader-board-table');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rem = allLeaderboardData.length % rowsPerPage;
    let totalPages = rem > 0 ? (allLeaderboardData.length - rem) / rowsPerPage + 1 : (allLeaderboardData.length - rem) / rowsPerPage;
    if (totalPages < 1) totalPages = 1;

    if (currentLeaderPage > totalPages) {
        currentLeaderPage = totalPages;
    }
    if (currentLeaderPage < 1) {
        currentLeaderPage = 1;
    }

    localStorage.setItem('leader_currentPage', currentLeaderPage);

    const start = (currentLeaderPage - 1) * rowsPerPage;
    const pageItems = allLeaderboardData.slice(start, start + rowsPerPage);

    pageItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.name}</td><td>₹${item.totalExpenses}</td>`;
        tbody.appendChild(tr);
    });

    const section = document.getElementById('leaderboard');
    if (section) {
        const info = section.querySelector('.pageInfo');
        const prev = section.querySelector('.prevPageBtn');
        const next = section.querySelector('.nextPageBtn');

        if (info) {
            info.innerText = `Page ${currentLeaderPage} of ${totalPages}`;
        }
        if (prev) {
            prev.disabled = currentLeaderPage === 1;
        }
        if (next) {
            next.disabled = currentLeaderPage >= totalPages;
        }

        const select = section.querySelector('.row-select');
        if (select) {
            select.value = rowsPerPage;
        }
    }
}

window.renderLeaderboardPage = renderLeaderboardPage;
window.setLeaderboardData = (data) => {
    allLeaderboardData = data || [];
    renderLeaderboardPage();
};

async function deleteExpense(id) {
    try {
        const res = await axios.delete(`${EXPENSE_URL}/${id}`, { withCredentials: true });
        if (res) {
            allExpenses = allExpenses.filter(item => item.id !== id);

            const rem = allExpenses.length % rowsPerPage;
            let totalPages = rem > 0 ? (allExpenses.length - rem) / rowsPerPage + 1 : (allExpenses.length - rem) / rowsPerPage;
            if (totalPages < 1) totalPages = 1;

            if (currentExpensePage > totalPages) {
                currentExpensePage = totalPages;
            }

            renderExpensesPage();
            await updateDashboard();

            if (typeof window.showLeaderboard === 'function') {
                window.showLeaderboard();
            }
        }
    } catch (err) {
        console.log("Delete error:", err.message);
    }
}

async function updateDashboard() {
    try {
        const [expRes, budRes] = await Promise.all([
            axios.get(EXPENSE_URL, { withCredentials: true }),
            axios.get(`${BUDGET_URL}/get-budget`, { withCredentials: true })
        ]);

        allExpenses = expRes.data || [];
        const totalExp = allExpenses.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
        const budgetVal = parseFloat(budRes.data?.amount) || 0;

        currentBudget = budgetVal;

        const bEl = document.getElementById('budget');
        const eEl = document.getElementById('expense');
        const balEl = document.getElementById('balance');

        if (bEl) {
            bEl.innerText = `₹${budgetVal}`;
        }
        if (eEl) {
            eEl.innerText = `₹${totalExp}`;
        }
        if (balEl) {
            balEl.innerText = `₹${budgetVal - totalExp}`;
        }
    } catch (err) {
        console.log("Dashboard error:", err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await axios.get(EXPENSE_URL, { withCredentials: true });
        allExpenses = res.data || [];

        const activeTab = localStorage.getItem('active_tab');
        if (activeTab) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.getAttribute('data-tab') === activeTab) btn.click();
            });
        }

        renderExpensesPage();
        await updateDashboard();
        await updateSummary();
    } catch (err) {
        console.log("Load error:", err);
    }
});

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (btn && btn.getAttribute('data-tab')) {
        localStorage.setItem('active_tab', btn.getAttribute('data-tab'));
    }
});

async function updateSummary() {
    try {
        const res = await axios.get(`${SUMMARY_URL}/summary`, { withCredentials: true });
        const summaryBox = document.querySelector('.summary');
        if (summaryBox && res.data.summary) {
            summaryBox.innerHTML = `<p>${res.data.summary}</p>`;
        }
    } catch (err) {
        console.log("Summary error:", err.message);
    }
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pagination-btn');
    if (!btn) return;

    const section = btn.closest('.tab-section');
    if (!section) return;

    if (section.id === 'expenses') {
        const rem = allExpenses.length % rowsPerPage;
        let totalPages = rem > 0 ? (allExpenses.length - rem) / rowsPerPage + 1 : (allExpenses.length - rem) / rowsPerPage;
        if (totalPages < 1) totalPages = 1;

        if (btn.classList.contains('firstPageBtn')) {
            currentExpensePage = 1;
        }
        else if (btn.classList.contains('prevPageBtn') && currentExpensePage > 1) {
            currentExpensePage--;
        }
        else if (btn.classList.contains('nextPageBtn') && currentExpensePage < totalPages) {
            currentExpensePage++;
        }
        else if (btn.classList.contains('lastPageBtn')) {
            currentExpensePage = totalPages;
        }

        localStorage.setItem('expense_currentPage', currentExpensePage);
        renderExpensesPage();
    } else if (section.id === 'leaderboard') {
        const rem = allLeaderboardData.length % rowsPerPage;
        let totalPages = rem > 0 ? (allLeaderboardData.length - rem) / rowsPerPage + 1 : (allLeaderboardData.length - rem) / rowsPerPage;
        if (totalPages < 1) totalPages = 1;

        if (btn.classList.contains('firstPageBtn')) {
            currentLeaderPage = 1;
        }
        else if (btn.classList.contains('prevPageBtn') && currentLeaderPage > 1) {
            currentLeaderPage--;
        }
        else if (btn.classList.contains('nextPageBtn') && currentLeaderPage < totalPages) {
            currentLeaderPage++;
        }
        else if (btn.classList.contains('lastPageBtn')) {
            currentLeaderPage = totalPages;
        }

        localStorage.setItem('leader_currentPage', currentLeaderPage);
        renderLeaderboardPage();
    }
});

const logoutBtn = document.createElement("button");
logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
logoutBtn.id = "logoutBtn";
logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../signin/signin.html";
});
document.body.appendChild(logoutBtn);