const cashfree = Cashfree({ mode: "sandbox" });
const premiumBtn = document.getElementById("premiumBtn");
const p_URL = "http://localhost:3000/api/premium/payment";
const V_URL = "http://localhost:3000/api/premium/verify";
const STATUS_URL = "http://localhost:3000/api/premium/status";
const LEADERBOARD_URL = "http://localhost:3000/api/premium/showLeaderboard";

// 1. Payment Initiation
if (premiumBtn) {
    premiumBtn.addEventListener("click", async () => {
        try {
            const response = await axios.post(
                p_URL,
                { amount: 1000.00 },
                { withCredentials: true }
            );

            const data = response.data;

            cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self"
            });
        } catch (error) {
            console.error("Payment error:", error);
            alert(error.response?.data?.message || "Failed to initiate payment");
        }
    });
}

// 2. Status & Verification Logic
async function verifyAndUpdateStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    try {
        if (orderId) {
            await axios.post(`${V_URL}/${orderId}`, {}, { withCredentials: true });
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const res = await axios.get(STATUS_URL, { withCredentials: true });
        if (res.data?.isPremiumUser === true) {
            updatePremiumUI();
        }
    } catch (err) {
        console.error("Verification/Status error:", err);
    }
}

// 3. Leaderboard
async function showLeaderboard() {
    const leaderboardSection = document.getElementById("leaderboard");
    const existingTable = document.getElementById("leaderboardTable");
    const leaderBtn = document.getElementById("leaderBtn");

    if (existingTable) {
        existingTable.remove();
        if (leaderBtn) leaderBtn.innerText = "Show Leaderboard";
        return;
    }

    try {
        const response = await axios.get(LEADERBOARD_URL, { withCredentials: true });
        const data = response.data;

        const table = document.createElement("table");
        table.id = "leaderboardTable";
        table.innerHTML = `<thead><tr><th>Name</th><th>Total Expenses</th></tr></thead><tbody></tbody>`;

        const tbody = table.querySelector("tbody");
        if (Array.isArray(data)) {
            data.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${user.name}</td><td>${user.total_expenses || 0}</td>`;
                tbody.appendChild(row);
            });
        }

        leaderboardSection.appendChild(table);
        if (leaderBtn) leaderBtn.innerText = "Hide Leaderboard";

    } catch (err) {
        console.error("Leaderboard error:", err);
    }
}

// 4. Premium UI Update
function updatePremiumUI() {
    if (premiumBtn) premiumBtn.style.display = "none";

    const premiumContainer = document.querySelector(".header-right");

    if (!document.getElementById("premium-header")) {
        const header = document.createElement("h3");
        header.innerHTML = `<i class="fa-solid fa-crown"></i> You are a Premium User!`;
        header.id = "premium-header";
        premiumContainer.appendChild(header);
    }

    if (!document.getElementById("leaderBtn")) {
        const leaderBtn = document.createElement("button");
        leaderBtn.innerText = "Show Leaderboard";
        leaderBtn.id = "leaderBtn";
        premiumContainer.appendChild(leaderBtn);
        leaderBtn.addEventListener("click", showLeaderboard);
    }
}

// Run on page load
document.addEventListener("DOMContentLoaded", verifyAndUpdateStatus);
