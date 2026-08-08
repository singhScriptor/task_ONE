document.addEventListener("DOMContentLoaded", () => {
    const reportSwitcher = document.getElementById("report-switcher");

    if (reportSwitcher) {
        const buttons = reportSwitcher.querySelectorAll("button");
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                // Use currentTarget to guarantee you target the button element
                const clickedBtn = e.currentTarget;

                buttons.forEach(b => b.classList.remove("active-header"));
                clickedBtn.classList.add("active-header");

                const reportType = clickedBtn.getAttribute("data-report");
                const periodHeader = document.querySelector("#reports table th:first-child");

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