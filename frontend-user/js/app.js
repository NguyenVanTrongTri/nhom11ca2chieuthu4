// ============================================
// Main App - Frontend User
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    const user = getStoredUser();
    updateNavbar(user);
}

function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('currentUser')); } catch { return null; }
}

function getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY) || '';
}

function updateNavbar(user) {
    const el = document.querySelector('#navbarDropdown');
    if (el && user) el.innerHTML = `<i class="fas fa-user"></i> ${user.email}`;
}

function logout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = '/pages/login.html';
}

// Chuyển sang trang login Admin (frontend-admin)
// Đường dẫn tương đối từ frontend-user/pages/user/ sang frontend-admin/pages/login.html
function goToAdminPanel(e) {
    e.preventDefault();
    // Mở trang login của frontend-admin trong tab mới
    window.open('../../../frontend-admin/pages/login.html', '_blank');
}

// Helper: gọi API User backend với token tự động
async function apiFetch(endpoint, options = {}) {
    const url = CONFIG.USER_API_BASE_URL + endpoint;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
        logout();
        throw new Error('Phiên đăng nhập hết hạn');
    }
    return res;
}

function showNotification(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `alert alert-${type} alert-dismissible fade show`;
    el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:280px;';
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
