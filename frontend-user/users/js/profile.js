// ============================================
// Profile JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Load user profile data
    loadProfileData();
    
    // Setup form submissions
    setupFormListeners();
}

function loadProfileData() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        // Update profile display
        document.getElementById('firstName').value = userData.name.split(' ')[0] || '';
        document.getElementById('lastName').value = userData.name.split(' ')[1] || '';
        document.getElementById('email').value = userData.email || '';
    }
}

function setupFormListeners() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Process form data
    console.log('Form submitted:', Object.fromEntries(formData));
    
    showNotification('Thay đổi đã được lưu', 'success');
}

function changeAvatar() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        console.log('Avatar selected:', file);
        showNotification('Avatar đã được cập nhật', 'success');
    };
    input.click();
}

function showNotification(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
