// ============================================
// Admin - Dashboard, Users, Vocabulary
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    if (document.getElementById('user-table-body'))  loadRecentUsers();
    if (document.getElementById('vocab-table-body')) loadRecentVocabs();
    if (document.getElementById('vocab-full-body'))  initVocabManagement();
    if (document.getElementById('user-full-body'))   initUserManagement();
});

function checkAdminAuth() {
    const token = getToken();
    const role  = localStorage.getItem('userRole');
    if (!token || (role && role.toUpperCase() !== 'ADMIN')) {
        alert('Bạn không có quyền truy cập trang này!');
        window.location.href = '../login.html';
    }
}

// ================================================================
// DASHBOARD - load tóm tắt
// ================================================================
async function loadRecentUsers() {
    const tbody   = document.getElementById('user-table-body');
    const countEl = document.getElementById('total-users-count');
    const badgeEl = document.getElementById('total-users-badge');
    if (!tbody) return;

    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.USERS);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const users = await res.json();

        if (countEl) countEl.textContent = users.length;
        if (badgeEl) badgeEl.textContent = `${users.length} người dùng`;

        tbody.innerHTML = '';
        if (!users.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Danh sách trống.</td></tr>';
            return;
        }
        [...users].reverse().slice(0, 6).forEach(u => renderUserRow(tbody, u));
    } catch (e) {
        console.error(e);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi kết nối Server!</td></tr>';
    }
}

async function loadRecentVocabs() {
    const tbody   = document.getElementById('vocab-table-body');
    const countEl = document.getElementById('total-vocab-count');
    if (!tbody) return;

    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.VOCABULARY);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const vocabs = await res.json();

        if (countEl) countEl.textContent = vocabs.length;
        tbody.innerHTML = '';
        if (!vocabs.length) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có từ vựng nào.</td></tr>';
            return;
        }
        [...vocabs].reverse().slice(0, 6).forEach(v => renderVocabRow(tbody, v, false));
    } catch (e) {
        console.error(e);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Lỗi kết nối Server!</td></tr>';
    }
}

// ================================================================
// USER MANAGEMENT - trang user-management.html
// ================================================================
let allUsers = [];

async function initUserManagement() {
    await fetchAllUsers();
    setupUserSearch();
}

async function fetchAllUsers() {
    const tbody = document.getElementById('user-full-body');
    if (!tbody) return;
    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.USERS);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        allUsers = await res.json();
        renderAllUsers(allUsers);
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu!</td></tr>';
    }
}

function renderAllUsers(users) {
    const tbody = document.getElementById('user-full-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Không có user nào.</td></tr>';
        return;
    }
    users.forEach(u => renderUserRow(tbody, u));
}

function renderUserRow(tbody, u) {
    const date = u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '---';
    tbody.insertAdjacentHTML('beforeend', `
        <tr id="user-row-${u.userId}">
            <td><strong>#${u.userId}</strong></td>
            <td>${u.fullName || 'N/A'}</td>
            <td>${u.email}</td>
            <td><small>${date}</small></td>
            <td><span class="badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}">${u.role || 'USER'}</span></td>
            <td class="text-center">
                <button onclick="deleteUser(${u.userId})" class="btn btn-sm btn-outline-danger" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `);
}

function setupUserSearch() {
    const input = document.getElementById('user-search');
    if (!input) return;
    input.addEventListener('keyup', debounce(function () {
        const q = this.value.toLowerCase();
        const filtered = allUsers.filter(u =>
            (u.fullName || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q)
        );
        renderAllUsers(filtered);
    }, 300));
}

async function deleteUser(userId) {
    if (!confirm(`Xóa user #${userId}? Không thể hoàn tác.`)) return;
    try {
        const res = await apiFetch(`${CONFIG.ENDPOINTS.USERS}/${userId}`, { method: 'DELETE' });
        if (res.ok || res.status === 204) {
            showNotification('Đã xóa user!', 'success');
            document.getElementById(`user-row-${userId}`)?.remove();
            allUsers = allUsers.filter(u => u.userId !== userId);
            // Cập nhật count
            const countEl = document.getElementById('total-users-count');
            if (countEl) countEl.textContent = allUsers.length;
        } else {
            showNotification('Xóa thất bại: HTTP ' + res.status, 'danger');
        }
    } catch (e) {
        showNotification('Lỗi: ' + e.message, 'danger');
    }
}

// ================================================================
// VOCABULARY MANAGEMENT - trang vocabulary-management.html
// ================================================================
let allVocabs = [];
let editingVocabId = null;

async function initVocabManagement() {
    await fetchAllVocabs();
    setupVocabSearch();
    setupAddVocabForm();
    setupEditVocabForm();
}

async function fetchAllVocabs() {
    const tbody = document.getElementById('vocab-full-body');
    if (!tbody) return;
    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.VOCABULARY);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        allVocabs = await res.json();
        renderAllVocabs(allVocabs);
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu!</td></tr>';
    }
}

function renderAllVocabs(vocabs) {
    const tbody = document.getElementById('vocab-full-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!vocabs.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có từ vựng nào.</td></tr>';
        return;
    }
    vocabs.forEach(v => renderVocabRow(tbody, v, true));
}

function renderVocabRow(tbody, v, showEdit = true) {
    const cat = v.category?.categoryName ?? 'N/A';
    tbody.insertAdjacentHTML('beforeend', `
        <tr id="vocab-row-${v.vocabularyId}">
            <td><strong>${v.word}</strong></td>
            <td><code style="color:#e83e8c;">${v.phonetic || ''}</code></td>
            <td>${v.meaning || ''}</td>
            <td><span class="badge bg-info text-dark">${cat}</span></td>
            <td><small class="text-muted">${v.wordType || ''}</small></td>
            <td class="text-center">
                ${showEdit ? `
                <button onclick="openEditVocab(${v.vocabularyId})" class="btn btn-sm btn-outline-warning me-1" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>` : ''}
                <button onclick="deleteVocab(${v.vocabularyId})" class="btn btn-sm btn-outline-danger" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `);
}

function setupVocabSearch() {
    const input = document.getElementById('vocab-search');
    if (!input) return;
    input.addEventListener('keyup', debounce(function () {
        const q = this.value.toLowerCase();
        const filtered = allVocabs.filter(v =>
            (v.word || '').toLowerCase().includes(q) ||
            (v.meaning || '').toLowerCase().includes(q)
        );
        renderAllVocabs(filtered);
    }, 300));
}

// ---- Thêm từ vựng ----
function setupAddVocabForm() {
    const btn = document.getElementById('btn-save-vocab');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        const word     = document.getElementById('vocabWord')?.value.trim();
        const meaning  = document.getElementById('vocabMeaning')?.value.trim();
        const phonetic = document.getElementById('vocabPhonetic')?.value.trim();
        const example  = document.getElementById('vocabExample')?.value.trim();
        const wordType = document.getElementById('vocabWordType')?.value.trim();
        const catId    = document.getElementById('vocabCategoryId')?.value.trim();

        if (!word || !meaning || !catId) {
            showNotification('Vui lòng nhập Từ, Nghĩa và Category ID!', 'warning');
            return;
        }

        const payload = {
            word, meaning, phonetic, example, wordType,
            category: { categoryId: parseInt(catId) }
        };

        try {
            const res = await apiFetch(CONFIG.ENDPOINTS.VOCABULARY, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            showNotification('Thêm từ vựng thành công!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addVocabularyModal'))?.hide();
            document.getElementById('addVocabForm')?.reset();
            await fetchAllVocabs();
        } catch (e) {
            showNotification('Lỗi: ' + e.message, 'danger');
        }
    });
}

// ---- Sửa từ vựng ----
function openEditVocab(vocabId) {
    const v = allVocabs.find(x => x.vocabularyId === vocabId);
    if (!v) return;
    editingVocabId = vocabId;

    document.getElementById('editVocabWord').value     = v.word || '';
    document.getElementById('editVocabMeaning').value  = v.meaning || '';
    document.getElementById('editVocabPhonetic').value = v.phonetic || '';
    document.getElementById('editVocabExample').value  = v.example || '';
    document.getElementById('editVocabWordType').value = v.wordType || '';
    document.getElementById('editVocabCategoryId').value = v.category?.categoryId || '';

    new bootstrap.Modal(document.getElementById('editVocabularyModal')).show();
}

function setupEditVocabForm() {
    const btn = document.getElementById('btn-update-vocab');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        if (!editingVocabId) return;

        const payload = {
            word:     document.getElementById('editVocabWord')?.value.trim(),
            meaning:  document.getElementById('editVocabMeaning')?.value.trim(),
            phonetic: document.getElementById('editVocabPhonetic')?.value.trim(),
            example:  document.getElementById('editVocabExample')?.value.trim(),
            wordType: document.getElementById('editVocabWordType')?.value.trim(),
            category: { categoryId: parseInt(document.getElementById('editVocabCategoryId')?.value) }
        };

        try {
            const res = await apiFetch(`${CONFIG.ENDPOINTS.VOCABULARY}/${editingVocabId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            showNotification('Cập nhật thành công!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editVocabularyModal'))?.hide();
            await fetchAllVocabs();
        } catch (e) {
            showNotification('Lỗi: ' + e.message, 'danger');
        }
    });
}

async function deleteVocab(vocabId) {
    if (!confirm(`Xóa từ vựng #${vocabId}?`)) return;
    try {
        const res = await apiFetch(
            CONFIG.ENDPOINTS.DELETE_VOCABULARY.replace('{id}', vocabId),
            { method: 'DELETE' }
        );
        if (res.ok) {
            showNotification('Đã xóa từ vựng!', 'success');
            document.getElementById(`vocab-row-${vocabId}`)?.remove();
            allVocabs = allVocabs.filter(v => v.vocabularyId !== vocabId);
        } else {
            showNotification('Xóa thất bại: HTTP ' + res.status, 'danger');
        }
    } catch (e) {
        showNotification('Lỗi: ' + e.message, 'danger');
    }
}

// ---- Search filter chung ----
function filterResults(searchTerm) {
    document.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}
