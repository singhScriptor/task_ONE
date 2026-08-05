// Run status check on page load
document.addEventListener("DOMContentLoaded",verifyAndUpdateStatus);


const cashfree = Cashfree({ mode: "sandbox" });
const premiumBtn = document.getElementById("premiumBtn");

// API Endpoints
const p_URL = "http://localhost:3000/api/premium/payment";
const V_URL = "http://localhost:3000/api/premium/verify";
const STATUS_URL = "http://localhost:3000/api/premium/status";
const LEADERBOARD_URL = "http://localhost:3000/api/premium/showLeaderboard";

// Payment Initiation
if (premiumBtn) {
    premiumBtn.addEventListener("click", async () => {
        try {
            /*
            {} empty curl for nothing in the body,
            here axios.post expect(url,data,config)
            so {} is acting as a placeholder even if
            we don't send data
            */
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

// Global Function: Update Premium UI
window.updatePremiumUI = function () {
    const pBtn = document.getElementById("premiumBtn");

    if (pBtn) {
        const parent = pBtn.parentElement;
        pBtn.remove(); // Removes Subscribe button

        if (!document.getElementById("prime-header")) {
            const header = document.createElement("h4");
            header.id = "prime-header";
            header.style.color = "#ffffff";
            header.style.margin = "0";
            header.style.fontWeight = "bold";
            header.style.fontSize = "1rem";
            header.innerHTML = `<i class="fa-solid fa-crown" style="color: #ffd700;"></i> You are a prime member now`;

            if (parent) {
                parent.appendChild(header);
            }
        }
    }
    // remove default graph placeholder when premium is active
    const graphDefault = document.getElementById("graphs-default");
    if (graphDefault) {
        graphDefault.remove();
    }
};

// Verification & Status Check Flow Handles Page Load

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
            window.showLeaderboard();   // only call if premium
        } else {
            // Not premium → leave default <p> intact
            console.log("User is not premium, showing default placeholders.");
        }
    } catch (err) {
        console.error("Verification/Status error:", err);
    }
}


//  Fetch and Display Leaderboard
window.showLeaderboard = async function () {
    const leaderboardSection = document.getElementById("leaderboard");
    if (!leaderboardSection) return;

    try {
        const response = await axios.get(LEADERBOARD_URL, { withCredentials: true });
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
            // Clear existing content only for premium users
            leaderboardSection.innerHTML = `<h3><i class="fa-solid fa-crown"></i> Leaderboard</h3>`;

            const table = document.createElement("table");
            table.id = "leaderboardTable";
            table.innerHTML = `
                <thead>
                    <tr>
                        <th style="color:teal">Name</th>
                        <th style="color:teal">Total Expenses</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = table.querySelector("tbody");
            data.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${user.name}</td><td>₹${user.total_expense || 0}</td>`;
                tbody.appendChild(row);
            });

            leaderboardSection.appendChild(table);
        } else {
            // Premium but no data
            leaderboardSection.innerHTML = `<h3><i class="fa-solid fa-crown"></i> Leaderboard</h3>`;
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No leaderboard data available.";
            leaderboardSection.appendChild(emptyMsg);
        }
    }
    catch (err) {
        console.error("Leaderboard error:", err);
    }
};


