// ============================================
// Admin JavaScript - Nhóm 11
// ============================================

const API_BASE_URL = "https://backend-admin-vekl.onrender.com";

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();

    // Kiểm tra và tải User nếu có bảng User trên trang
    if (document.getElementById('user-table-body')) {
        loadRecentVocabs();
        loadRecentUsers();
    }

    // Kiểm tra và tải Vocabulary nếu có bảng Vocab trên trang
    // Tách riêng ra như thế này thì trang Vocabulary Management mới chạy được!
    if (document.getElementById('vocab-table-body')) {
        loadRecentVocabs();
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
    const badge = document.getElementById('total-users-badge');
    const totalStat = document.getElementById('total-users-count'); // Thêm dòng này
    const token = localStorage.getItem('token');

    if (!tableBody) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Không thể tải danh sách');

        const users = await response.json();
        
        // --- PHẦN CẬP NHẬT SỐ LIỆU ĐỘNG ---
        if(badge) badge.innerText = `${users.length} người dùng`;
        if(totalStat) totalStat.innerText = users.length.toLocaleString(); // Tự động cập nhật con số 1,245
        // ----------------------------------
        
        tableBody.innerHTML = ''; 

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Danh sách trống.</td></tr>';
            return;
        }

        users.reverse().forEach(user => {
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
                            ${isEnabled ? 'Hoạt Động' : 'Bị Khóa'}
                        </span>
                    </td>
                    <td style="text-align: center;">
                        <div class="btn-group">
                            <button onclick="viewDetail(${user.userId})" class="btn btn-sm btn-outline-primary" title="Xem">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button onclick="deleteUser(${user.userId})" class="btn btn-sm btn-outline-danger" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi kết nối Server!</td></tr>';
    }
}
async function loadRecentVocabs() {
    const vocabBody = document.getElementById('vocab-table-body');
    const token = localStorage.getItem('token');
    const totalVocabStat = document.getElementById('total-vocab-count'); 

    if (!vocabBody) return;

    try {
        // Đảm bảo URL chính xác theo Postman
        const response = await fetch(`https://backend-admin-vekl.onrender.com/api/admin/vocabulary`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Không thể tải danh sách từ vựng');

        const vocabs = await response.json();
        
        if (totalVocabStat) totalVocabStat.innerText = vocabs.length.toLocaleString();

        vocabBody.innerHTML = ''; 

        if (vocabs.length === 0) {
            vocabBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có từ vựng nào.</td></tr>';
            return;
        }

        // Đảo ngược để từ mới nhất lên đầu
        vocabs.reverse().forEach(item => {
            const categoryName = item.category ? item.category.categoryName : 'N/A';
            
            const row = `
                <tr>
                    <td><strong>${item.word}</strong></td>
                    <td><code style="color: #e83e8c;">${item.phonetic || ''}</code></td>
                    <td><span class="badge badge-info">${categoryName}</span></td>
                    <td><small class="text-muted">${item.wordType || 'noun'}</small></td>
                    <td style="text-align: center;">
                        <a href="vocabulary-management.html?edit=${item.vocabularyId}" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-edit"></i>
                        </a>
                    </td>
                </tr>
            `;
            vocabBody.insertAdjacentHTML('beforeend', row);
        });

    } catch (error) {
        console.error("Lỗi Vocab:", error);
        vocabBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Lỗi kết nối Server!</td></tr>';
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
