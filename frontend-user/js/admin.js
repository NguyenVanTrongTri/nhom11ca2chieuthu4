// ============================================
// Admin JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Check if user is admin
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
            alert('Bạn không có quyền truy cập trang này');
            window.location.href = '../login.html';
        }
    }
    
    // Setup admin functionality
    setupAdminFunctionality();
}

function setupAdminFunctionality() {
    // Setup search/filter
    setupSearch();
    
    // Setup delete buttons
    setupDeleteButtons();
    
    // Setup edit buttons
    setupEditButtons();
}

function setupSearch() {
    const searchInputs = document.querySelectorAll('input[placeholder*="Tìm"]');
    searchInputs.forEach(input => {
        input.addEventListener('keyup', debounce(function() {
            filterResults(this.value);
        }, 300));
    });
}

function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('button[title*="Xóa"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn xóa?')) {
                this.closest('tr').remove();
                showNotification('Đã xóa thành công', 'success');
            }
        });
    });
}

function setupEditButtons() {
    const editButtons = document.querySelectorAll('button[title*="Chỉnh sửa"], button[title*="sửa"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Edit clicked');
            // Modal will be triggered by Bootstrap
        });
    });
}

function filterResults(searchTerm) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function showNotification(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    alert.style.marginBottom = '1rem';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container-fluid');
    if (container) {
        container.insertBefore(alert, container.firstChild);
    }
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Lock/Unlock user
function toggleUserStatus(userId, currentStatus) {
    if (confirm(`Bạn có chắc chắn muốn ${currentStatus === 'locked' ? 'mở khoá' : 'khóa'} tài khoản này?`)) {
        console.log('Toggle user status:', userId);
        showNotification(`Đã ${currentStatus === 'locked' ? 'mở khoá' : 'khóa'} tài khoản`, 'success');
    }
}

// Delete user
function deleteUser(userId) {
    if (confirm('Xóa tài khoản này sẽ xoá vĩnh viễn tất cả dữ liệu. Tiếp tục không?')) {
        console.log('Delete user:', userId);
        showNotification('Đã xóa tài khoản', 'success');
    }
}

// Add vocabulary
function addVocabulary(e) {
    e.preventDefault();
    console.log('Adding vocabulary...');
    showNotification('Đã thêm từ vựng mới', 'success');
}

// Edit vocabulary
function editVocabulary(e) {
    e.preventDefault();
    console.log('Editing vocabulary...');
    showNotification('Đã cập nhật từ vựng', 'success');
}

// Delete vocabulary
function deleteVocabulary(vocabId) {
    if (confirm('Bạn có chắc chắn muốn xóa từ vựng này?')) {
        console.log('Delete vocabulary:', vocabId);
        showNotification('Đã xóa từ vựng', 'success');
    }
}
