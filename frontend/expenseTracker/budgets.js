const BUDGET_BASE_URL = 'http://localhost:3000/api/budget';

document.addEventListener('DOMContentLoaded', () => {
    const saveBudgetBtn = document.getElementById('saveBudgetBtn');
    const budgetInput = document.getElementById('budgetInput');

    if (saveBudgetBtn) {
        saveBudgetBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const amount = parseFloat(budgetInput.value);

            if (isNaN(amount) || amount < 0) {
                alert("Please enter a valid budget amount");
                return;
            }

            try {
                // Calls POST
                const res = await axios.post(`${BUDGET_BASE_URL}/add-budget`,
                    { amount },
                    { withCredentials: true }
                );

                if (res.data) {
                    // Update global state variable if it exists
                    if (typeof currentBudget !== 'undefined') {
                        currentBudget = parseFloat(res.data.amount) || amount;
                    }

                    // FIX: Call updateDashboardMetrics() matching the name in expense.js
                    if (typeof updateDashboardMetrics === 'function') {
                        await updateDashboardMetrics();
                    }

                    // Clear the input
                    budgetInput.value = '';

                    // Switch back to the expense section view
                    if (typeof showSection === 'function') {
                        showSection('expense');
                    }
                }
            } catch (err) {
                console.error("Error saving budget:", err.response?.data || err.message);
                alert(err.response?.data?.error || "Failed to save budget");
            }
        });
    }
});

