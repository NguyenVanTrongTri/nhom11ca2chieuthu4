// ============================================
// Admin JavaScript - Nhóm 11
// ============================================

const API_BASE_URL = "https://backend-admin-0e0j.onrender.com";

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

    // Lấy token từ localStorage (đã được lưu khi gọi API /auth/login)
    const token = localStorage.getItem('token');

    try {
        // Sửa URL: Nếu UserController nhận thì là /users/all, 
        // nhưng phải gửi kèm Header Authorization
        const response = await fetch(`${API_BASE_URL}/users/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi "chìa khóa" JWT lên Server
                'Content-Type': 'application/json'
            }
        });

        // Kiểm tra nếu lỗi quyền truy cập (403 Forbidden)
        if (response.status === 403) {
            console.error('Lỗi 403: Token không hợp lệ hoặc không có quyền Admin');
            showNotification('Bạn không có quyền thực hiện hành động này!', 'danger');
            return;
        }

        const users = await response.json();

        tableBody.innerHTML = '';

        // Đảo ngược danh sách để hiện user mới nhất lên đầu
        const latestUsers = users.slice(-5).reverse();

        latestUsers.forEach(user => {
            // Hiển thị ngày tháng theo định dạng VN
            const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---';
            
            // Dựa vào trường 'enabled' từ database để hiện trạng thái
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
