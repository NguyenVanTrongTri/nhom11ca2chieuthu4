// ============================================
// Admin JavaScript - Nhóm 11
// ============================================

const API_BASE_URL = "https://backend-admin-vekl.onrender.com";

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    // Tự động tải dữ liệu khi trang dashboard mở ra
    if (document.getElementById('user-table-body')) {
        loadRecentUsers();
    }
});

function initializeAdmin() {
    // 1. Kiểm tra quyền Admin
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        if (userData.role !== 'ADMIN') {
            alert('Bạn không có quyền truy cập trang này');
            window.location.href = '../login.html';
            return;
        }
    }
    
    // 2. Setup các tính năng UI
    setupAdminFunctionality();
}

// --- HÀM LẤY DỮ LIỆU THẬT TỪ BACKEND ---
async function loadRecentUsers() {
    const tableBody = document.getElementById('user-table-body');
    if (!tableBody) return;

    // Lấy token từ localStorage (đã lưu khi đăng nhập thành công)
    const token = localStorage.getItem('token');

    try {
        // SỬA TẠI ĐÂY: 
        // 1. Bỏ "/all" vì trong Java chỉ để @GetMapping (trống)
        // 2. Thêm headers để gửi Token (giải quyết lỗi 403)
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi kèm token JWT
                'Content-Type': 'application/json'
            }
        });

        // Nếu vẫn bị 403, có thể do Token hết hạn hoặc sai Role
        if (response.status === 403) {
            console.error("Lỗi 403: Không có quyền truy cập.");
            showNotification('Bạn không có quyền Admin hoặc phiên đăng nhập hết hạn', 'danger');
            return;
        }

        const users = await response.json();
        tableBody.innerHTML = '';

        // Lấy 5 user mới nhất
        const latestUsers = users.slice(-5).reverse();

        latestUsers.forEach(user => {
            const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---';
            
            // Khớp với trường 'enabled' trong model User.java của bạn
            const isEnabled = user.enabled !== false;
            const statusClass = isEnabled ? 'badge-success' : 'badge-danger';
            const statusText = isEnabled ? 'Hoạt Động' : 'Khóa';

            const row = `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.fullName || 'N/A'}</td>
                    <td>${user.email}</td>
                    <td>${date}</td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <a href="user-management.html?id=${user.userId}" class="btn btn-sm btn-outline-primary" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button onclick="deleteUser(${user.userId})" class="btn btn-sm btn-outline-danger" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Cập nhật tổng số user lên Dashboard
        updateStatValues(users.length);

    } catch (error) {
        console.error('Lỗi khi tải user:', error);
        showNotification('Không thể kết nối với Server Render', 'danger');
    }
}

// Cập nhật các con số trên Stats Grid
function updateStatValues(totalCount) {
    const totalStat = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (totalStat) {
        totalStat.innerText = totalCount.toLocaleString();
    }
}

// --- CÁC HÀM XỬ LÝ UI CỦA BẠN (GIỮ NGUYÊN) ---

function setupAdminFunctionality() {
    setupSearch();
    // Bỏ setupDeleteButtons vì mình đã dùng onclick trực tiếp trong row
}

function setupSearch() {
    const searchInputs = document.querySelectorAll('input[placeholder*="Tìm"]');
    searchInputs.forEach(input => {
        input.addEventListener('keyup', debounce(function() {
            filterResults(this.value);
        }, 300));
    });
}

function filterResults(searchTerm) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
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
    alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Delete user (Gọi API thật nếu cần)
async function deleteUser(userId) {
    if (confirm('Xóa tài khoản này sẽ xoá vĩnh viễn tất cả dữ liệu. Tiếp tục không?')) {
        console.log('Đang xóa user ID:', userId);
        // Ở đây bạn có thể gọi fetch(`${API_BASE_URL}/users/delete/${userId}`, { method: 'DELETE' })
        showNotification('Tính năng xóa đang được đồng bộ với DB...', 'warning');
    }
}
