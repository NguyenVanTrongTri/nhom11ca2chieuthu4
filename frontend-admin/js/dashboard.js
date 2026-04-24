// ============================================
// Dashboard - Frontend Admin
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    loadAdminDashboard();
});

function checkAuth() {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (!token || (role && role.toUpperCase() !== 'ADMIN')) {
        window.location.href = '../login.html';
    }
}

async function loadAdminDashboard() {
    await Promise.all([
        loadUserStats(),
        loadVocabStats()
    ]);
}

async function loadUserStats() {
    const countEl = document.getElementById('total-users-count');
    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.USERS);
        if (!res.ok) return;
        const users = await res.json();
        if (countEl) countEl.textContent = users.length;
    } catch (e) {
        console.error('loadUserStats:', e);
    }
}

async function loadVocabStats() {
    const countEl = document.getElementById('total-vocab-count');
    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.VOCABULARY);
        if (!res.ok) return;
        const vocabs = await res.json();
        if (countEl) countEl.textContent = vocabs.length;
    } catch (e) {
        console.error('loadVocabStats:', e);
    }
}
