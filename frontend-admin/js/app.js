// ============================================
// Main App - Frontend Admin
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    updateNavbar();
}

function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY) || '';
}

function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
}

function updateNavbar() {
    const el = document.querySelector('#navbarDropdown');
    const email = localStorage.getItem('userEmail');
    if (el && email) el.innerHTML = `<i class="fas fa-user-shield"></i> ${email}`;
}

function logout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = '../login.html';
}

// Helper: gọi Admin backend với token tự động
async function apiFetch(endpoint, options = {}) {
    const url = CONFIG.ADMIN_API_BASE_URL + endpoint;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
        showNotification('Phiên đăng nhập hết hạn hoặc không có quyền!', 'danger');
        setTimeout(() => logout(), 1500);
    }
    return res;
}

function showNotification(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `alert alert-${type} alert-dismissible fade show`;
    el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:300px;';
    el.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

function debounce(func, wait) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => func.apply(this, args), wait);
    };
}
