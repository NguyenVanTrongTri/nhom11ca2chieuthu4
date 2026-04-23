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

    // 1. Lấy token và kiểm tra ngay lập tức
    const token = localStorage.getItem('token');

    // KIỂM TRA TOKEN TRƯỚC KHI FETCH
    if (!token || token.split('.').length !== 3) {
        console.error("Token không hợp lệ hoặc bị thiếu:", token);
        showNotification('Phiên đăng nhập lỗi. Vui lòng đăng nhập lại!', 'warning');
        // Tùy chọn: window.location.href = 'login.html'; 
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.trim()}`, // .trim() để tránh dư khoảng trắng
                'Content-Type': 'application/json'
            }
        });

        // 2. Xử lý các mã lỗi HTTP phổ biến
        if (response.status === 401) {
            showNotification('Hết hạn đăng nhập. Hãy đăng nhập lại!', 'danger');
            return;
        }

        if (response.status === 403) {
            console.error("Lỗi 403: Token hợp lệ nhưng Role không có quyền ADMIN.");
            showNotification('Bạn không có quyền xem danh sách này!', 'danger');
            return;
        }

        if (!response.ok) {
            throw new Error(`Server trả về lỗi: ${response.status}`);
        }

        const users = await response.json();
        
        // 3. Xóa dữ liệu cũ và Render
        tableBody.innerHTML = '';
        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có người dùng nào.</td></tr>';
            return;
        }

        // Lấy 5 user mới nhất
        const latestUsers = users.slice(-5).reverse();

        latestUsers.forEach(user => {
            const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---';
            const isEnabled = user.enabled !== false;
            
            const row = `
                <tr>
                    <td><strong>#${user.userId}</strong></td>
                    <td>${user.fullName || 'N/A'}</td>
                    <td>${user.email}</td>
                    <td><small>${date}</small></td>
                    <td>
                        <span class="badge ${isEnabled ? 'badge-success' : 'badge-danger'}">
                            ${isEnabled ? 'Hoạt Động' : 'Khóa'}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <a href="user-management.html?id=${user.userId}" class="btn btn-sm btn-outline-info">
                                <i class="fas fa-eye"></i>
                            </a>
                            <button onclick="deleteUser(${user.userId})" class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Cập nhật con số tổng trên Dashboard
        if (typeof updateStatValues === "function") {
            updateStatValues(users.length);
        }

    } catch (error) {
        console.error('Lỗi khi tải user:', error);
        // Kiểm tra nếu là lỗi kết nối mạng (Server Render ngủ đông hoặc sai URL)
        showNotification('Lỗi kết nối Server! (Có thể Server đang khởi động)', 'danger');
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
