// ============================================
// Dashboard - Frontend User
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    loadProgressSummary();
});

function checkAuth() {
    if (!localStorage.getItem(CONFIG.TOKEN_KEY)) {
        window.location.href = '../login.html';
    }
}

async function loadProgressSummary() {
    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.PROGRESS);
        if (!res.ok) return;
        const data = await res.json();

        const elWords   = document.getElementById('words-learned-count');
        const elCorrect = document.getElementById('correct-answers-count');
        if (elWords)   elWords.textContent   = data.wordsLearned   ?? 0;
        if (elCorrect) elCorrect.textContent = data.correctAnswers ?? 0;
    } catch (e) {
        console.error('loadProgressSummary:', e);
    }
}
