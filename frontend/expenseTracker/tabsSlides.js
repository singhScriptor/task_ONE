document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-section');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.dataset.tab;
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.classList.add('active');
            }

            if (targetId === 'leaderboard' && typeof window.showLeaderboard === 'function') {
                window.showLeaderboard();
            }
            if(targetId === 'report' && typeof window.showReport === 'function'){
                window.showReport()
            }
        });
    });
});