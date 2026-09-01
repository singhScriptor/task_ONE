const baseUrl = 'http://localhost:3000/api';
const expenseApiUrl = `${baseUrl}/expenses`;
const budgetApiUrl = `${baseUrl}/budget`;
const summaryApiUrl = `${baseUrl}/expenses/ai`;


let userCurrentBudget = 0;

const expenseFormElement = document.getElementById('form');
if (expenseFormElement) {
    expenseFormElement.addEventListener('submit', addExpenseToDatabase);
}


let currentExpensePageNumber = parseInt(localStorage.getItem('expense_currentPage')) || 1;
let currentLeaderboardPageNumber = parseInt(localStorage.getItem('leader_currentPage')) || 1;
let itemsPerRowLimit = parseInt(localStorage.getItem('expense_rowsPerPage')) || 10;

let allUserExpensesList = [];
let allLeaderboardRecordsList = [];

// Listen for row selector dropdown changes to change pagination limits
document.addEventListener('change', function(event) {
    if (event.target.classList.contains('row-select')) {
        itemsPerRowLimit = parseInt(event.target.value) || 10;
        currentExpensePageNumber = 1;
        currentLeaderboardPageNumber = 1;

        localStorage.setItem('expense_rowsPerPage', itemsPerRowLimit);
        localStorage.setItem('expense_currentPage', currentExpensePageNumber);
        localStorage.setItem('leader_currentPage', currentLeaderboardPageNumber);

        renderExpensesPage();
        if (typeof renderLeaderboardPage === 'function') {
            renderLeaderboardPage();
        }
    }
});

// Add new expense function
async function addExpenseToDatabase(event) {
    event.preventDefault();
    try {
        let expensePayload = {
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            note: document.getElementById('note').value
        };

        let response = await axios.post(expenseApiUrl, expensePayload, { withCredentials: true });
        allUserExpensesList.push(response.data);

        let remainder = allUserExpensesList.length % itemsPerRowLimit;
        if (remainder > 0) {
            currentExpensePageNumber = Math.floor(allUserExpensesList.length / itemsPerRowLimit) + 1;
        } else {
            currentExpensePageNumber = allUserExpensesList.length / itemsPerRowLimit;
        }

        if (currentExpensePageNumber < 1) {
            currentExpensePageNumber = 1;
        }

        localStorage.setItem('expense_currentPage', currentExpensePageNumber);
        renderExpensesPage();

        if (expenseFormElement) {
            expenseFormElement.reset();
        }

        await updateDashboardMetrics();

        // Instantly update the report table and numbers without refreshing the page
        if (typeof window.updateReportView === 'function') {
            let activeReportType = localStorage.getItem("savedReportType") || "daily";
            window.updateReportView(activeReportType);
        }

        if (typeof window.showLeaderboard === 'function') {
            window.showLeaderboard();
        }
    } catch (error) {
        console.log("Error adding expense:", error.message);
    }
}

// Render the expense table rows for the current page
function renderExpensesPage() {
    let tableBody = document.getElementById('expense-table');
    if (!tableBody) {
        return;
    }
    tableBody.innerHTML = '';

    let remainder = allUserExpensesList.length % itemsPerRowLimit;
    let totalPagesCount = remainder > 0 ? Math.floor(allUserExpensesList.length / itemsPerRowLimit) + 1 : allUserExpensesList.length / itemsPerRowLimit;

    if (totalPagesCount < 1) {
        totalPagesCount = 1;
    }

    if (currentExpensePageNumber > totalPagesCount) {
        currentExpensePageNumber = totalPagesCount;
    }
    if (currentExpensePageNumber < 1) {
        currentExpensePageNumber = 1;
    }

    localStorage.setItem('expense_currentPage', currentExpensePageNumber);

    let startIndex = (currentExpensePageNumber - 1) * itemsPerRowLimit;
    let paginatedExpenses = allUserExpensesList.slice(startIndex, startIndex + itemsPerRowLimit);

    paginatedExpenses.forEach(function(singleExpense) {
        let tableRow = document.createElement('tr');
        tableRow.id = `expense_row_${singleExpense.id}`;
        tableRow.innerHTML = `
            <td>${singleExpense.price}</td>
            <td>${singleExpense.description}</td>
            <td>${singleExpense.category}</td>
            <td><button onclick="deleteExpenseFromDatabase(${singleExpense.id})" style="border:none; cursor:pointer; background:none"><i class="fa fa-trash"></i></button></td>
        `;
        tableBody.appendChild(tableRow);
    });

    let expensesSection = document.getElementById('expenses');
    if (expensesSection) {
        let pageInfoDisplay = expensesSection.querySelector('.pageInfo');
        let previousButton = expensesSection.querySelector('.prevPageBtn');
        let nextButton = expensesSection.querySelector('.nextPageBtn');

        if (pageInfoDisplay) {
            pageInfoDisplay.innerText = `Page ${currentExpensePageNumber} of ${totalPagesCount}`;
        }
        if (previousButton) {
            previousButton.disabled = currentExpensePageNumber === 1;
        }
        if (nextButton) {
            nextButton.disabled = currentExpensePageNumber >= totalPagesCount;
        }

        let rowSelectDropdown = expensesSection.querySelector('.row-select');
        if (rowSelectDropdown) {
            rowSelectDropdown.value = itemsPerRowLimit;
        }
    }
}

// Render leaderboard table rows with pagination
function renderLeaderboardPage() {
    let leaderboardTableBody = document.getElementById('leader-board-table');
    if (!leaderboardTableBody) {
        return;
    }
    leaderboardTableBody.innerHTML = '';

    let remainder = allLeaderboardRecordsList.length % itemsPerRowLimit;
    let totalLeaderPages = remainder > 0 ? Math.floor(allLeaderboardRecordsList.length / itemsPerRowLimit) + 1 : allLeaderboardRecordsList.length / itemsPerRowLimit;

    if (totalLeaderPages < 1) {
        totalLeaderPages = 1;
    }

    if (currentLeaderboardPageNumber > totalLeaderPages) {
        currentLeaderboardPageNumber = totalLeaderPages;
    }
    if (currentLeaderboardPageNumber < 1) {
        currentLeaderboardPageNumber = 1;
    }

    localStorage.setItem('leader_currentPage', currentLeaderboardPageNumber);

    let startIndex = (currentLeaderboardPageNumber - 1) * itemsPerRowLimit;
    let paginatedLeaderboard = allLeaderboardRecordsList.slice(startIndex, startIndex + itemsPerRowLimit);

    paginatedLeaderboard.forEach(function(leaderRecord) {
        let tableRow = document.createElement('tr');
        tableRow.innerHTML = `<td>${leaderRecord.name}</td><td>₹${leaderRecord.totalExpenses}</td>`;
        leaderboardTableBody.appendChild(tableRow);
    });

    let leaderboardSection = document.getElementById('leaderboard');
    if (leaderboardSection) {
        let pageInfoDisplay = leaderboardSection.querySelector('.pageInfo');
        let previousButton = leaderboardSection.querySelector('.prevPageBtn');
        let nextButton = leaderboardSection.querySelector('.nextPageBtn');

        if (pageInfoDisplay) {
            pageInfoDisplay.innerText = `Page ${currentLeaderboardPageNumber} of ${totalLeaderPages}`;
        }
        if (previousButton) {
            previousButton.disabled = currentLeaderboardPageNumber === 1;
        }
        if (nextButton) {
            nextButton.disabled = currentLeaderboardPageNumber >= totalLeaderPages;
        }

        let rowSelectDropdown = leaderboardSection.querySelector('.row-select');
        if (rowSelectDropdown) {
            rowSelectDropdown.value = itemsPerRowLimit;
        }
    }
}

window.renderLeaderboardPage = renderLeaderboardPage;
window.setLeaderboardData = function(data) {
    allLeaderboardRecordsList = data || [];
    renderLeaderboardPage();
};

// Delete expense function
async function deleteExpenseFromDatabase(expenseId) {
    try {
        let deleteResponse = await axios.delete(`${expenseApiUrl}/${expenseId}`, { withCredentials: true });
        if (deleteResponse) {
            allUserExpensesList = allUserExpensesList.filter(function(item) {
                return item.id !== expenseId;
            });

            let remainder = allUserExpensesList.length % itemsPerRowLimit;
            let totalPagesCount = remainder > 0 ? Math.floor(allUserExpensesList.length / itemsPerRowLimit) + 1 : allUserExpensesList.length / itemsPerRowLimit;

            if (totalPagesCount < 1) {
                totalPagesCount = 1;
            }

            if (currentExpensePageNumber > totalPagesCount) {
                currentExpensePageNumber = totalPagesCount;
            }

            renderExpensesPage();
            await updateDashboardMetrics();

            // Instantly update the report table and numbers when an expense is deleted
            if (typeof window.updateReportView === 'function') {
                let activeReportType = localStorage.getItem("savedReportType") || "daily";
                window.updateReportView(activeReportType);
            }

            if (typeof window.showLeaderboard === 'function') {
                window.showLeaderboard();
            }
        }
    } catch (error) {
        console.log("Delete error:", error.message);
    }
}

// Recalculate and display budget, total expenses, and balance

async function updateDashboardMetrics() {
    try {
        let responsesArray = await Promise.all([
            axios.get(expenseApiUrl, { withCredentials: true }),
            axios.get(`${budgetApiUrl}/get-budget`, { withCredentials: true })
        ]);

        allUserExpensesList = responsesArray[0].data || [];

        let calculatedTotalExpenses = allUserExpensesList.reduce(function(accumulator, currentItem) {
            return accumulator + Number(currentItem.price || 0);
        }, 0);

        let retrievedBudgetAmount = parseFloat(responsesArray[1].data?.amount) || 0;
        userCurrentBudget = retrievedBudgetAmount;

        // DOM Elements for Metrics
        let budgetDisplayElement = document.getElementById('budget');
        let expenseDisplayElement = document.getElementById('expense');
        let balanceDisplayElement = document.getElementById('balance');
        let totalIncomeDisplayElement = document.getElementById('total-income'); // Target your Income Box

        if (budgetDisplayElement) {
            budgetDisplayElement.innerText = `₹${retrievedBudgetAmount}`;
        }
        if (expenseDisplayElement) {
            expenseDisplayElement.innerText = `₹${calculatedTotalExpenses}`;
        }
        if (balanceDisplayElement) {
            balanceDisplayElement.innerText = `₹${retrievedBudgetAmount - calculatedTotalExpenses}`;
        }

        // Use userCurrentBudget as Total Income so they match and update instantly
        if (totalIncomeDisplayElement) {
            totalIncomeDisplayElement.innerText = `₹${userCurrentBudget}`;
        }

        // Instantly update the report table and summary view without needing a page refresh
        if (typeof window.updateReportView === 'function') {
            let activeReportType = localStorage.getItem("savedReportType") || "daily";
            window.updateReportView(activeReportType);
        }

    } catch (error) {
        console.log("Dashboard error:", error);
    }
}

// Initial page load event
document.addEventListener('DOMContentLoaded', async function() {
    try {
        let expensesResponse = await axios.get(expenseApiUrl, { withCredentials: true });
        allUserExpensesList = expensesResponse.data || [];

        let activeTabName = localStorage.getItem('active_tab');
        if (activeTabName) {
            document.querySelectorAll('.tab-btn').forEach(function(button) {
                if (button.getAttribute('data-tab') === activeTabName) {
                    button.click();
                }
            });
        }

        renderExpensesPage();
        await updateDashboardMetrics();
        await updateAiSummary();
    } catch (error) {
        console.log("Load error:", error);
    }
});

// Save active tab preference
document.addEventListener('click', function(event) {
    let tabButton = event.target.closest('.tab-btn');
    if (tabButton && tabButton.getAttribute('data-tab')) {
        localStorage.setItem('active_tab', tabButton.getAttribute('data-tab'));
    }
});

// Fetch Gen-AI summary
async function updateAiSummary() {
    try {
        let summaryResponse = await axios.get(`${summaryApiUrl}/summary`, { withCredentials: true });
        let summaryBoxElement = document.querySelector('.summary');
        if (summaryBoxElement && summaryResponse.data.summary) {
            summaryBoxElement.innerHTML = `<p>${summaryResponse.data.summary}</p>`;
        }
    } catch (error) {
        console.log("Summary error:", error.message);
    }
}

// Handle pagination button clicks
document.addEventListener('click', function(event) {
    let clickedButton = event.target.closest('.pagination-btn');
    if (!clickedButton) {
        return;
    }

    let parentSection = clickedButton.closest('.tab-section');
    if (!parentSection) {
        return;
    }

    if (parentSection.id === 'expenses') {
        let remainder = allUserExpensesList.length % itemsPerRowLimit;
        let totalPagesCount = remainder > 0 ? Math.floor(allUserExpensesList.length / itemsPerRowLimit) + 1 : allUserExpensesList.length / itemsPerRowLimit;

        if (totalPagesCount < 1) {
            totalPagesCount = 1;
        }

        if (clickedButton.classList.contains('firstPageBtn')) {
            currentExpensePageNumber = 1;
        }
         else if (clickedButton.classList.contains('prevPageBtn') && currentExpensePageNumber > 1) {
            currentExpensePageNumber--;
        }
        else if (clickedButton.classList.contains('nextPageBtn') && currentExpensePageNumber < totalPagesCount) {
            currentExpensePageNumber++;
        }
        else if (clickedButton.classList.contains('lastPageBtn')) {
            currentExpensePageNumber = totalPagesCount;
        }

        localStorage.setItem('expense_currentPage', currentExpensePageNumber);
        renderExpensesPage();
    } else if (parentSection.id === 'leaderboard') {
        let remainder = allLeaderboardRecordsList.length % itemsPerRowLimit;
        let totalPagesCount = remainder > 0 ? Math.floor(allLeaderboardRecordsList.length / itemsPerRowLimit) + 1 : allLeaderboardRecordsList.length / itemsPerRowLimit;

        if (totalPagesCount < 1) {
            totalPagesCount = 1;
        }

        if (clickedButton.classList.contains('firstPageBtn')) {
            currentLeaderboardPageNumber = 1;
        }
        else if (clickedButton.classList.contains('prevPageBtn') && currentLeaderboardPageNumber > 1) {
            currentLeaderboardPageNumber--;
        }
        else if (clickedButton.classList.contains('nextPageBtn') && currentLeaderboardPageNumber < totalPagesCount) {
            currentLeaderboardPageNumber++;
        }
        else if (clickedButton.classList.contains('lastPageBtn')) {
            currentLeaderboardPageNumber = totalPagesCount;
        }

        localStorage.setItem('leader_currentPage', currentLeaderboardPageNumber);
        renderLeaderboardPage();
    }
});

// Logout feature setup
let userLogoutButton = document.createElement("button");
userLogoutButton.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
userLogoutButton.id = "logoutBtn";
userLogoutButton.addEventListener("click", function() {
    localStorage.clear();
    window.location.href = "../signin/signin.html";
});
document.body.appendChild(userLogoutButton);