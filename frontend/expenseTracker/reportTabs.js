document.addEventListener("DOMContentLoaded", () => {
    const reportSwitcher = document.getElementById("report-switcher");
    const periodHeader = document.querySelector("#report-table th:first-child");

    if (reportSwitcher) {
        const buttons = reportSwitcher.querySelectorAll("button");
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                // Toggle active class on buttons
                buttons.forEach(b => b.classList.remove("active-header"));
                e.target.classList.add("active-header");

                const reportType = e.target.getAttribute("data-report");

                // Dynamically update the table header column name
                if (periodHeader) {
                    if (reportType === "daily") {
                        periodHeader.textContent = "Date";
                    } else if (reportType === "monthly") {
                        periodHeader.textContent = "Month";
                    } else if (reportType === "yearly") {
                        periodHeader.textContent = "Year";
                    }
                }
            });
        });
    }
});