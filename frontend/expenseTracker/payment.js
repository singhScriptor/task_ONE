document.addEventListener("DOMContentLoaded", verifyAndUpdateStatus);

const cashfree = Cashfree({ mode: "sandbox" });
const premiumBtn = document.getElementById("premiumBtn");

const p_URL = "http://localhost:3000/api/premium/payment";
const V_URL = "http://localhost:3000/api/premium/verify";
const STATUS_URL = "http://localhost:3000/api/premium/status";
const LEADERBOARD_URL = "http://localhost:3000/api/premium/showLeaderboard";
const REPORT_URL = "http://localhost:3000/api/reports/download";

if (premiumBtn) {
    premiumBtn.addEventListener("click", async () => {
        try {
            const response = await axios.post(p_URL, {}, { withCredentials: true });
            const data = response.data;

            if (data.payment_session_id) {
                cashfree.checkout({
                    paymentSessionId: data.payment_session_id,
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
    const pBtn = document.getElementById("premiumBtn");

    if (pBtn) {
        const parent = pBtn.parentElement;
        pBtn.remove();

        if (!document.getElementById("prime-header")) {
            const header = document.createElement("h4");
            header.id = "prime-header";
            header.style.color = "#ffffff";
            header.style.margin = "0";
            header.style.fontWeight = "bold";
            header.style.fontSize = "1rem";
            header.innerHTML = `<i class="fa-solid fa-crown" style="color: #ffd700;"></i> You are a prime member now`;

            if (parent) parent.appendChild(header);
        }
    }
    const graphDefault = document.getElementById("graphs-default");
    if (graphDefault) graphDefault.remove();
};

async function verifyAndUpdateStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    try {
        if (orderId && orderId !== 'null' && orderId !== 'undefined') {
            await axios.post(`${V_URL}/${orderId}`, {}, { withCredentials: true });
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const res = await axios.get(STATUS_URL, { withCredentials: true });

        if (res.data?.isPremiumUser === true) {
            window.updatePremiumUI();
            window.showLeaderboard();
            window.showReport();
        } else {
            // --- Non-Premium State ---

            // 1. Leaderboard: Show default message, hide table and footer
            const leaderboardDefault = document.getElementById("leaderboard-default");
            if (leaderboardDefault) leaderboardDefault.style.display = "block";

            const leaderboardTable = document.querySelector("#leaderboard table");
            if (leaderboardTable) leaderboardTable.style.display = "none";

            const leaderboardFooter = document.querySelector("#leaderboard .table-footer-container");
            if (leaderboardFooter) leaderboardFooter.style.display = "none";

            // 2. Report: Show default warning paragraph, hide switcher, table, and download button
            const reportDefault = document.getElementById("report-default");
            if (reportDefault) reportDefault.style.display = "block";

            const reportSwitcher = document.getElementById("report-switcher");
            if (reportSwitcher) reportSwitcher.style.display = "none";

            // Fixed ID from #report to #reports to match your CSS
            const reportTable = document.querySelector("#reports table");
            if (reportTable) reportTable.style.display = "none";

            const downloadBtn = document.getElementById("downloadReportBtn");
            if (downloadBtn) downloadBtn.style.display = "none";
        }
    } catch (err) {
        console.error("Status error:", err);
    }
}

window.showLeaderboard = async function () {
    const leaderboardSection = document.getElementById("leaderboard");
    if (!leaderboardSection) return;

    try {
        const response = await axios.get(LEADERBOARD_URL, { withCredentials: true });
        const data = response.data;

        const defaultText = document.getElementById("leaderboard-default");
        if (defaultText) defaultText.style.display = "none";

        const leaderboardTable = document.querySelector("#leaderboard table");
        if (leaderboardTable) leaderboardTable.style.display = "table";

        const leaderboardFooter = document.querySelector("#leaderboard .table-footer-container");
        if (leaderboardFooter) leaderboardFooter.style.display = "flex";

        if (Array.isArray(data) && data.length > 0) {
            const formattedData = data.map(user => ({
                name: user.name,
                totalExpenses: user.total_expense || 0
            }));

            if (typeof window.setLeaderboardData === 'function') {
                window.setLeaderboardData(formattedData);
            }
        } else {
            const tbody = document.getElementById("leader-board-table");
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;">No leaderboard data available.</td></tr>`;
            }
        }
    } catch (err) {
        console.error("Leaderboard error:", err);
    }
};

window.showReport = async function () {
    const reportDefault = document.getElementById("report-default");
    const reportSwitcher = document.getElementById("report-switcher");
    const reportTable = document.querySelector("#reports table");
    const downloadBtn = document.getElementById("downloadReportBtn");

    try {
        if (reportDefault) reportDefault.style.display = "none";

        if (reportSwitcher) reportSwitcher.style.display = "flex";

        if (reportTable) {
            reportTable.style.display = "table";
            reportTable.classList.add("active-report");
        }

        if (downloadBtn) {
            downloadBtn.style.display = "flex";
            downloadBtn.disabled = false;
            downloadBtn.style.backgroundColor = "teal";
            downloadBtn.style.cursor = "pointer";
        }
    } catch (err) {
        console.error("Report error:", err);
    }
};

async function downloadReport() {
    try {
        const response = await axios.get(REPORT_URL, {
            withCredentials: true,
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'expense-report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.log("Download failed:", err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById("downloadReportBtn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", downloadReport);
    }
});