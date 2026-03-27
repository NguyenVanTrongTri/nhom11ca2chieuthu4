// ============================================
// Main App JavaScript
// ============================================

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('English Learning App initialized');
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const user = getStoredUser();
    
    // Update navbar based on login status
    updateNavbarBasedOnLoginStatus(user);
    
    // Set up event listeners
    setupEventListeners();
}

// Get stored user from localStorage
function getStoredUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Save user to localStorage
function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Remove user from localStorage
function removeUser() {
    localStorage.removeItem('currentUser');
}

// Update navbar based on login status
function updateNavbarBasedOnLoginStatus(user) {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (user) {
        // User is logged in
        const userMenu = document.querySelector('#navbarDropdown');
        if (userMenu) {
            userMenu.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add any global event listeners here
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(notification, document.body.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Show loading spinner
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading-spinner';
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                    background-color: rgba(0, 0, 0, 0.5); display: flex; 
                    align-items: center; justify-content: center; z-index: 9999;">
            <div class="spinner-border" role="status" style="color: #2563eb;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    document.body.appendChild(loading);
}

// Hide loading spinner
function hideLoading() {
    const loading = document.getElementById('loading-spinner');
    if (loading) {
        loading.remove();
    }
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('vi-VN', options);
}

// API Call Helper
async function apiCall(endpoint, options = {}) {
    const baseURL = 'http://localhost:3000/api'; // Update with your API URL
    const url = `${baseURL}${endpoint}`;
    
    try {
        showLoading();
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        hideLoading();
        showNotification(`Lỗi: ${error.message}`, 'danger');
        console.error('API Error:', error);
        throw error;
    }
}

// Get stored token
function getToken() {
    return localStorage.getItem('authToken') || '';
}

// Save token
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

// Remove token
function removeToken() {
    localStorage.removeItem('authToken');
}

// Logout
function logout() {
    removeUser();
    removeToken();
    window.location.href = 'pages/login.html';
    showNotification('Đã đăng xuất thành công', 'success');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions
export {
    getStoredUser,
    saveUser,
    removeUser,
    saveToken,
    getToken,
    removeToken,
    showNotification,
    showLoading,
    hideLoading,
    formatDate,
    apiCall,
    logout
};
