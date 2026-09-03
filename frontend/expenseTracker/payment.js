document.addEventListener("DOMContentLoaded", verifyAndUpdateMembershipStatus);

const cashfreeInstance = Cashfree({ mode: "sandbox" });
const premiumButton = document.getElementById("premiumBtn");

// const PAYMENT_API_URL = "http://localhost:3000/api/premium/payment";
// const VERIFY_API_URL = "http://localhost:3000/api/premium/verify";
// const STATUS_API_URL = "http://localhost:3000/api/premium/status";
// const LEADERBOARD_API_URL = "http://localhost:3000/api/premium/showLeaderboard";
// const REPORT_DATA_API_URL = "http://localhost:3000/api/reports/data";
// const REPORT_DOWNLOAD_API_URL = "http://localhost:3000/api/reports/download";
// const BUDGET_API_URL = "http://localhost:3000/api/budget";

//for production aws
const PAYMENT_API_URL = "/api/premium/payment";
const VERIFY_API_URL = "/api/premium/verify";
const STATUS_API_URL = "/api/premium/status";
const LEADERBOARD_API_URL = "/api/premium/showLeaderboard";
const REPORT_DATA_API_URL = "/api/reports/data";
const REPORT_DOWNLOAD_API_URL = "/api/reports/download";
const BUDGET_API_URL = "/api/budget";

if (premiumButton) {
    premiumButton.addEventListener("click", async function () {
        try {
            let apiResponse = await axios.post(PAYMENT_API_URL, {}, { withCredentials: true });
            let paymentInfo = apiResponse.data;

            if (paymentInfo.payment_session_id) {
                cashfreeInstance.checkout({
                    paymentSessionId: paymentInfo.payment_session_id,
                    redirectTarget: "_self"
                });
            } else {
                alert("Failed to create payment session.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert(error.response?.data?.message || "Failed to initiate payment");
        }
    });
}

window.updatePremiumUI = function () {
    let upgradeButton = document.getElementById("premiumBtn");

    if (upgradeButton) {
        let parentBox = upgradeButton.parentElement;
        upgradeButton.remove();

        if (!document.getElementById("prime-header")) {
            let successTitle = document.createElement("h4");
            successTitle.id = "prime-header";
            successTitle.style.color = "#ffffff";
            successTitle.style.margin = "0";
            successTitle.style.fontWeight = "bold";
            successTitle.style.fontSize = "1rem";
            successTitle.innerHTML = `<i class="fa-solid fa-crown" style="color: #ffd700;"></i> You are a prime member now`;

            if (parentBox) {
                parentBox.appendChild(successTitle);
            }
        }
    }

    let graphDefaultNotice = document.getElementById("graphs-default");
    if (graphDefaultNotice) {
        graphDefaultNotice.remove();
    }
};

async function verifyAndUpdateMembershipStatus() {
    let pageParameters = new URLSearchParams(window.location.search);
    let orderIdentifier = pageParameters.get('order_id');

    try {
        if (orderIdentifier && orderIdentifier !== 'null' && orderIdentifier !== 'undefined') {
            await axios.post(`${VERIFY_API_URL}/${orderIdentifier}`, {}, { withCredentials: true });
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        let statusResponse = await axios.get(STATUS_API_URL, { withCredentials: true });

        if (statusResponse.data?.isPremiumUser === true) {
            window.updatePremiumUI();
            window.showLeaderboard();
            window.showReport();
        } else {
            let leaderboardDefaultNotice = document.getElementById("leaderboard-default");
            if (leaderboardDefaultNotice) {
                leaderboardDefaultNotice.style.display = "block";
            }

            let leaderboardTable = document.querySelector("#leaderboard table");
            if (leaderboardTable) {
                leaderboardTable.style.display = "none";
            }

            let leaderboardFooterBox = document.querySelector("#leaderboard .table-footer-container");
            if (leaderboardFooterBox) {
                leaderboardFooterBox.style.display = "none";
            }

            let reportDefaultNotice = document.getElementById("report-default");
            if (reportDefaultNotice) {
                reportDefaultNotice.style.display = "block";
            }

            let reportHeaderBox = document.querySelector("#reports .report-header-banner");
            if (reportHeaderBox) {
                reportHeaderBox.style.display = "block";
            }

            let reportSwitcherBar = document.getElementById("report-switcher");
            if (reportSwitcherBar) {
                reportSwitcherBar.style.display = "none";
            }

            let reportFilterSection = document.querySelector(".report-filter-bar");
            if (reportFilterSection) {
                reportFilterSection.style.display = "none";
            }

            let reportSummaryBox = document.querySelector(".report-summary-cards");
            if (reportSummaryBox) {
                reportSummaryBox.style.display = "none";
            }

            let reportTableBox = document.querySelector("#reports .table-container");
            if (reportTableBox) {
                reportTableBox.style.display = "none";
            }

            let downloadReportBtn = document.getElementById("downloadReportBtn");
            if (downloadReportBtn) {
                downloadReportBtn.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Status error:", error);
    }
}

window.showLeaderboard = async function () {
    let leaderboardSectionBox = document.getElementById("leaderboard");
    if (!leaderboardSectionBox) {
        return;
    }

    try {
        let leaderboardResponse = await axios.get(LEADERBOARD_API_URL, { withCredentials: true });
        let leaderboardUsers = leaderboardResponse.data;

        let leaderboardDefaultNotice = document.getElementById("leaderboard-default");
        if (leaderboardDefaultNotice) {
            leaderboardDefaultNotice.style.display = "none";
        }

        let leaderboardTable = document.querySelector("#leaderboard table");
        if (leaderboardTable) {
            leaderboardTable.style.display = "table";
        }

        let leaderboardFooterBox = document.querySelector("#leaderboard .table-footer-container");
        if (leaderboardFooterBox) {
            leaderboardFooterBox.style.display = "flex";
        }

        if (Array.isArray(leaderboardUsers) && leaderboardUsers.length > 0) {
            let formattedUsers = leaderboardUsers.map(function (user) {
                return {
                    name: user.name,
                    totalExpenses: user.total_expense || 0
                };
            });

            if (typeof window.setLeaderboardData === 'function') {
                window.setLeaderboardData(formattedUsers);
            }
        } else {
            let leaderboardTableBody = document.getElementById("leader-board-table");
            if (leaderboardTableBody) {
                leaderboardTableBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">No leaderboard data available.</td></tr>`;
            }
        }
    } catch (error) {
        console.error("Leaderboard error:", error);
    }
};

window.showReport = async function () {
    let reportDefaultNotice = document.getElementById("report-default");
    let reportSwitcherBar = document.getElementById("report-switcher");
    let reportFilterSection = document.querySelector(".report-filter-bar");
    let reportSummaryBox = document.querySelector(".report-summary-cards");
    let reportTableBox = document.querySelector("#reports .table-container");
    let reportTableTitleBox = document.querySelector("#reports .table-title-bar");
    let downloadReportBtn = document.getElementById("downloadReportBtn");

    try {
        if (reportDefaultNotice) {
            reportDefaultNotice.style.display = "none";
        }
        if (reportSwitcherBar) {
            reportSwitcherBar.style.display = "flex";
        }
        if (reportFilterSection) {
            reportFilterSection.style.display = "flex";
        }
        if (reportSummaryBox) {
            reportSummaryBox.style.display = "grid";
        }
        if (reportTableBox) {
            reportTableBox.style.display = "block";
        }
        if (reportTableTitleBox) {
            reportTableTitleBox.style.display = "flex";
        }

        if (downloadReportBtn) {
            downloadReportBtn.style.display = "inline-flex";
            downloadReportBtn.disabled = false;
            downloadReportBtn.style.cursor = "pointer";
        }

        initializeReportFeatures();
    } catch (error) {
        console.error("Report error:", error);
    }
};

function initializeReportFeatures() {
    let reportSwitcherBar = document.getElementById("report-switcher");
    let reportTableBody = document.getElementById("report-table");
    let reportTableTitleHeading = document.getElementById("report-table-title");
    let periodColumnHeader = document.getElementById("period-col-header");
    let downloadReportBtn = document.getElementById("downloadReportBtn");
    let dateInputField = document.getElementById("reportDateInput");
    let dateSelectorLabel = document.getElementById("selector-label");

    let totalExpenseDisplay = document.getElementById("total-expense-metric");
    let totalIncomeDisplay = document.getElementById("total-income-metric");
    let netSavingsDisplay = document.getElementById("net-savings-metric");

    let activeReportType = localStorage.getItem("savedReportType") || "daily";

    function getDefaultInputValue(reportType) {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        let currentDay = String(currentDate.getDate()).padStart(2, '0');

        if (reportType === "daily") {
            return `${currentYear}-${currentMonth}-${currentDay}`;
        }
        if (reportType === "monthly") {
            return `${currentYear}-${currentMonth}`;
        }
        if (reportType === "yearly") {
            return `${currentYear}`;
        }
        return "";
    }

    function applyReportTypeUI(reportType) {
        if (reportSwitcherBar) {
            let switchButtons = reportSwitcherBar.querySelectorAll("button");
            switchButtons.forEach(function (button) {
                if (button.getAttribute("data-report") === reportType) {
                    button.classList.add("active-header");
                }
                else {
                    button.classList.remove("active-header");
                }
            });
        }

        if (reportType === "daily") {
            dateSelectorLabel.textContent = "Select Date:";
            dateInputField.type = "date";
            periodColumnHeader.textContent = "Date";
            reportTableTitleHeading.textContent = "Daily Breakdown";
        }
        else if (reportType === "monthly") {
            dateSelectorLabel.textContent = "Select Month:";
            dateInputField.type = "month";
            periodColumnHeader.textContent = "Month";
            reportTableTitleHeading.textContent = "Monthly Breakdown";
        }
        else if (reportType === "yearly") {
            dateSelectorLabel.textContent = "Select Year:";
            dateInputField.type = "text";
            periodColumnHeader.textContent = "Year";
            reportTableTitleHeading.textContent = "Yearly Breakdown";
        }
    }

    applyReportTypeUI(activeReportType);

    if (dateInputField && !dateInputField.value) {
        dateInputField.value = getDefaultInputValue(activeReportType);
    }

    async function updateReportView(reportType) {
        try {
            let selectedDateValue = dateInputField ? dateInputField.value : '';

            // Also fetch current budget dynamically so income and metrics are accurate
            let [reportApiResponse, budgetApiResponse] = await Promise.all([
                axios.get(`${REPORT_DATA_API_URL}?reportType=${reportType}&date=${selectedDateValue}`, { withCredentials: true }),
                axios.get(`${BUDGET_API_URL}/get-budget`, { withCredentials: true }).catch(() => ({ data: { amount: 0 } }))
            ]);

            let reportData = reportApiResponse.data;
            let dynamicBudgetAmount = parseFloat(budgetApiResponse.data?.amount) || reportData.budget || 0;

            reportData.budget = dynamicBudgetAmount;

            if (!reportData.rows || reportData.rows.length === 0) {
                renderMetrics(reportData);
                renderTable({ rows: [] });
                if (downloadReportBtn) {
                    downloadReportBtn.setAttribute("disabled", "true");
                }
                return;
            }

            renderMetrics(reportData);
            renderTable(reportData);

            if (downloadReportBtn) {
                downloadReportBtn.removeAttribute("disabled");
            }
        } catch (error) {
            console.error("Failed to fetch report view data:", error);
            renderMetrics({ totalExpense: 0, budget: 0, netSavings: 0 });
            renderTable({ rows: [] });
        }
    }

    if (dateInputField) {
        dateInputField.oninput = function () {
            updateReportView(activeReportType);
        };
        dateInputField.onchange = function () {
            updateReportView(activeReportType);
        };
    }

    if (reportSwitcherBar) {
        let switchButtons = reportSwitcherBar.querySelectorAll("button");
        switchButtons.forEach(function (button) {
            button.onclick = async function (event) {
                let clickedButton = event.currentTarget;
                activeReportType = clickedButton.getAttribute("data-report");
                localStorage.setItem("savedReportType", activeReportType);

                applyReportTypeUI(activeReportType);
                dateInputField.value = getDefaultInputValue(activeReportType);
                await updateReportView(activeReportType);
            };
        });
    }

    function renderMetrics(reportData) {
        let expenseTotal = reportData.totalExpense || 0;
        if (totalExpenseDisplay) {
            totalExpenseDisplay.textContent = "₹" + expenseTotal.toFixed(2);
        }

        // Pulls correctly from reportData.budget updated via API
        let budgetTotal = reportData.budget || 0;
        if (totalIncomeDisplay) {
            totalIncomeDisplay.textContent = "₹" + parseFloat(budgetTotal).toFixed(2);
        }

        let netSavingsTotal = parseFloat(budgetTotal) - expenseTotal;
        if (netSavingsDisplay) {
            netSavingsDisplay.textContent = "₹" + netSavingsTotal.toFixed(2);
        }
    }

    function renderTable(reportData) {
        if (!reportTableBody) {
            return;
        }
        reportTableBody.innerHTML = "";

        if (!reportData.rows || reportData.rows.length === 0) {
            reportTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No records found for this selection.</td></tr>';
            return;
        }

        for (let index = 0; index < reportData.rows.length; index++) {
            let singleRow = reportData.rows[index];
            let tableRowElement = document.createElement("tr");
            let savingColorCode = singleRow.saving >= 0 ? "#10b981" : "#ef4444";

            tableRowElement.innerHTML = `
                <td>${singleRow.period}</td>
                <td>₹${singleRow.income.toFixed(2)}</td>
                <td>₹${singleRow.expense.toFixed(2)}</td>
                <td style="color: ${savingColorCode};">₹${singleRow.saving.toFixed(2)}</td>
            `;
            reportTableBody.appendChild(tableRowElement);
        }
    }

    updateReportView(activeReportType);

    // EXPOSE GLOBALLY SO EXPENSE.JS CAN TRIGGER IT INSTANTLY ON ADD/DELETE
    window.updateReportView = updateReportView;
}


// Download report event
document.addEventListener("click", function (event) {
    if (event.target.closest("#downloadReportBtn")) {
        let activeTab = document.querySelector("#report-switcher .active-header").getAttribute("data-report");
        let selectedDate = document.getElementById("reportDateInput").value;

        // Use the defined constant or strip the domain to fix the 401 cross-origin cookie issue
        axios.get(`${REPORT_DOWNLOAD_API_URL}?reportType=${activeTab}&date=${selectedDate}`, {
            withCredentials: true,
            responseType: 'blob'
        })
        .then(function (response) {
            let blob = new Blob([response.data], { type: 'text/csv' });
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `report-${activeTab}.csv`;
            link.click();
        })
        .catch(function (error) {
            console.error("Download error:", error);
            alert("Failed to download report.");
        });
    }
});