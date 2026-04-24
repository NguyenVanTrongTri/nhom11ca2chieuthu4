// ============================================
// Vocabulary - Frontend User
// ============================================

let allWords = [];
let currentCategoryId = 'all';

document.addEventListener('DOMContentLoaded', function () {
    loadAllWords();   // load từ trước, sau đó build chips từ data
    setupSearch();
});

// ---- Load tất cả từ vựng + build chips từ data ----
async function loadAllWords() {
    const container = document.getElementById('vocabularyList');
    if (container) container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Đang tải từ vựng...</p>
        </div>`;

    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.WORDS);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        allWords = await res.json();
        buildCategoryChips(allWords);
        renderWords(allWords);
    } catch (e) {
        console.error('loadAllWords:', e);
        if (container) container.innerHTML =
            `<div class="col-12"><div class="alert alert-danger">
                Không thể tải từ vựng. Kiểm tra backend đã chạy chưa.<br>
                <small>${e.message}</small>
             </div></div>`;
    }
}

// ---- Build chips từ data API ----
function buildCategoryChips(words) {
    const chipContainer = document.getElementById('category-chips');
    if (!chipContainer) return;

    // Extract unique categories
    const catMap = {};
    words.forEach(w => {
        if (w.categoryId && !catMap[w.categoryId]) {
            catMap[w.categoryId] = w.categoryName;
        }
    });

    const dynamicChips = Object.entries(catMap).map(([id, name]) =>
        `<span class="chip" data-category-id="${id}" onclick="filterByCategory(${id}, this)">${name}</span>`
    ).join('');

    // Giữ chip "Tất Cả" đầu tiên, thêm chips từ DB
    chipContainer.innerHTML =
        `<span class="chip active" data-category-id="all" onclick="filterByCategory('all', this)">Tất Cả</span>` +
        dynamicChips;
}

// ---- Render dạng lưới Bootstrap ----
function renderWords(words) {
    const container = document.getElementById('vocabularyList');
    if (!container) return;

    if (words.length === 0) {
        container.innerHTML = `<div class="col-12"><p class="text-center text-muted py-4">Không tìm thấy từ vựng nào.</p></div>`;
        return;
    }

    container.innerHTML = words.map(w => `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div class="card h-100 shadow-sm border-0 vocab-card-grid">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h5 class="fw-bold text-primary mb-0">${w.word}</h5>
                        <button class="btn btn-sm btn-link p-0 text-secondary"
                                onclick="playSound('${w.word}')" title="Phát âm">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <small class="text-muted mb-2">
                        ${w.phonetic ? `<span class="me-1">${w.phonetic}</span>` : ''}
                        ${w.wordType ? `<em class="badge bg-light text-secondary border">${w.wordType}</em>` : ''}
                    </small>
                    <p class="mb-1 flex-grow-1">${w.meaning}</p>
                    ${w.example
                        ? `<p class="text-muted small fst-italic mb-2 border-start border-success ps-2">"${w.example}"</p>`
                        : ''}
                    <span class="badge bg-primary bg-opacity-10 text-primary mt-auto">
                        <i class="fas fa-tag me-1"></i>${w.categoryName || ''}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// ---- Filter theo category ----
function filterByCategory(categoryId, btn) {
    currentCategoryId = categoryId;

    document.querySelectorAll('#category-chips .chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const filtered = categoryId === 'all'
        ? allWords
        : allWords.filter(w => w.categoryId == categoryId);
    renderWords(filtered);
}

// ---- Tìm kiếm ----
function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('keyup', debounce(function () {
        const q = this.value.trim();
        if (q.length === 0) {
            filterByCategory(currentCategoryId, null);
            return;
        }
        searchWords(q);
    }, 400));
}

// Nút search
function searchVocabulary() {
    const q = document.getElementById('searchInput')?.value.trim();
    if (!q) { filterByCategory(currentCategoryId, null); return; }
    searchWords(q);
}

async function searchWords(query) {
    try {
        const res = await apiFetch(`${CONFIG.ENDPOINTS.WORDS_SEARCH}?query=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const words = await res.json();
        renderWords(words);
    } catch (e) {
        console.error('searchWords:', e);
    }
}

// ---- Phát âm ----
function playSound(word) {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
}
