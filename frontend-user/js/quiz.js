// ============================================
// Quiz - Frontend User
// ============================================

let questions  = [];
let answers    = {};   // { quizId: selectedOption }
let categoryId = null;
let catName    = '';
let currentIdx = 0;

// Icon theo chủ đề
const CAT_ICONS = {
    'Chao hoi':    'fa-hand-wave',
    'Gia dinh':    'fa-house-user',
    'Mau sac':     'fa-palette',
    'Thuc an':     'fa-utensils',
    'Dong vat':    'fa-paw',
    'Nghe nghiep': 'fa-briefcase',
    'Thoi tiet':   'fa-cloud-sun',
    'Truong hoc':  'fa-school',
};
function getCatIcon(name) {
    for (const [k, v] of Object.entries(CAT_ICONS)) {
        if (name && name.toLowerCase().includes(k.toLowerCase().split(' ')[0])) return v;
    }
    return 'fa-book-open';
}

document.addEventListener('DOMContentLoaded', function () {
    loadCategoryList();
});

// ============================================================
// BƯỚC 1: Load danh sách chủ đề từ API
// ============================================================
async function loadCategoryList() {
    const container = document.getElementById('quiz-category-list');
    if (!container) return;

    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.WORDS);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const words = await res.json();

        // Extract unique categories
        const catMap = {};
        words.forEach(w => {
            if (w.categoryId && !catMap[w.categoryId]) {
                catMap[w.categoryId] = { name: w.categoryName, count: 0 };
            }
            if (w.categoryId) catMap[w.categoryId].count++;
        });

        if (Object.keys(catMap).length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-muted text-center">Chưa có chủ đề nào.</p></div>';
            return;
        }

        container.innerHTML = Object.entries(catMap).map(([id, cat]) => `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <div class="card quiz-category-card h-100 shadow-sm border-0"
                     onclick="startQuiz(${id}, '${cat.name}')">
                    <div class="card-body text-center py-4">
                        <div class="cat-icon-wrap mb-3">
                            <i class="fas ${getCatIcon(cat.name)} fa-2x text-primary"></i>
                        </div>
                        <h6 class="fw-bold mb-1">${cat.name}</h6>
                        <small class="text-muted">${cat.count} từ vựng</small>
                        <div class="mt-3">
                            <span class="btn btn-primary btn-sm w-100">
                                <i class="fas fa-play me-1"></i> Bắt Đầu
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error('loadCategoryList:', e);
        container.innerHTML = `<div class="col-12">
            <div class="alert alert-danger">Không thể tải danh sách chủ đề. Kiểm tra backend đã chạy chưa.</div>
        </div>`;
    }
}

// ============================================================
// BƯỚC 2: Bắt đầu quiz — lấy câu hỏi theo category
// ============================================================
async function startQuiz(catId, name) {
    categoryId = catId;
    catName    = name;
    currentIdx = 0;
    answers    = {};
    questions  = [];

    // Hiện loading
    showView('quizPlayingView');
    const qText = document.getElementById('questionText');
    const opts  = document.getElementById('optionsContainer');
    if (qText) qText.textContent = 'Đang tải câu hỏi...';
    if (opts)  opts.innerHTML = '';

    const titleEl = document.getElementById('quiz-title');
    if (titleEl) titleEl.textContent = name;

    try {
        const endpoint = CONFIG.ENDPOINTS.QUIZ.replace('{categoryId}', catId);
        const res = await apiFetch(endpoint);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        questions = await res.json();

        if (questions.length === 0) {
            showNotification('Chủ đề này chưa có câu hỏi quiz.', 'warning');
            showView('quizSelectionView');
            return;
        }

        renderQuestion();
    } catch (e) {
        console.error('startQuiz:', e);
        showNotification('Lỗi tải câu hỏi: ' + e.message, 'danger');
        showView('quizSelectionView');
    }
}

// ============================================================
// BƯỚC 3: Render câu hỏi
// ============================================================
function renderQuestion() {
    const q     = questions[currentIdx];
    const total = questions.length;
    if (!q) return;

    // Progress
    const pct = Math.round(((currentIdx + 1) / total) * 100);
    document.getElementById('progressText').textContent = `Câu ${currentIdx + 1} / ${total}`;
    document.getElementById('progressPct').textContent  = `${pct}%`;
    document.getElementById('progressBar').style.width  = `${pct}%`;
    document.getElementById('questionNumber').textContent = currentIdx + 1;
    document.getElementById('questionText').textContent   = q.question;

    // Ẩn feedback
    const fb = document.getElementById('feedbackMessage');
    if (fb) { fb.style.display = 'none'; fb.className = 'feedback-message mb-3'; fb.innerHTML = ''; }

    // Render options
    const opts = document.getElementById('optionsContainer');
    const optList = [
        { key: 'A', val: q.optionA },
        { key: 'B', val: q.optionB },
        { key: 'C', val: q.optionC },
        { key: 'D', val: q.optionD }
    ];

    opts.innerHTML = optList.map(o => `
        <label class="option-label ${answers[q.quizId] === o.key ? 'selected' : ''}"
               for="opt-${o.key}" onclick="selectOption('${o.key}', this)">
            <input type="radio" name="option" id="opt-${o.key}" value="${o.key}"
                   ${answers[q.quizId] === o.key ? 'checked' : ''} style="display:none;">
            <span class="option-key">${o.key}</span>
            <span class="option-val">${o.val}</span>
        </label>
    `).join('');

    // Nút điều hướng
    document.getElementById('prevBtn').disabled = currentIdx === 0;
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.innerHTML = currentIdx === total - 1
        ? '<i class="fas fa-paper-plane me-1"></i> Nộp Bài'
        : 'Câu Tiếp <i class="fas fa-chevron-right ms-1"></i>';
    nextBtn.className = currentIdx === total - 1
        ? 'quiz-btn quiz-btn-submit'
        : 'quiz-btn quiz-btn-next';
}

// Chọn đáp án — highlight label
function selectOption(key, labelEl) {
    document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
    labelEl.classList.add('selected');
    document.getElementById('opt-' + key).checked = true;
}

// ============================================================
// Nút Tiếp / Nộp
// ============================================================
function nextQuestion() {
    const q        = questions[currentIdx];
    const selected = document.querySelector('input[name="option"]:checked');

    if (!selected) {
        showNotification('Vui lòng chọn một đáp án!', 'warning');
        return;
    }

    answers[q.quizId] = selected.value;
    currentIdx++;

    if (currentIdx < questions.length) {
        renderQuestion();
    } else {
        submitQuiz();
    }
}

function previousQuestion() {
    if (currentIdx > 0) {
        const selected = document.querySelector('input[name="option"]:checked');
        if (selected) answers[questions[currentIdx].quizId] = selected.value;
        currentIdx--;
        renderQuestion();
    }
}

// ============================================================
// BƯỚC 4: Nộp bài
// ============================================================
async function submitQuiz() {
    const userId = getUserId();
    if (!userId) {
        showNotification('Không xác định được user. Vui lòng đăng nhập lại.', 'danger');
        return;
    }

    const answerList = Object.entries(answers).map(([quizId, selectedOption]) => ({
        quizId: parseInt(quizId),
        selectedOption
    }));

    const payload = { userId, categoryId, answers: answerList };

    // Disable nút tránh double submit
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) { nextBtn.disabled = true; nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang nộp...'; }

    try {
        const res = await apiFetch(CONFIG.ENDPOINTS.QUIZ_SUBMIT, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const result = await res.json();
        showResults(result);
    } catch (e) {
        console.error('submitQuiz:', e);
        showNotification('Lỗi nộp bài: ' + e.message, 'danger');
        if (nextBtn) { nextBtn.disabled = false; nextBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Nộp Bài'; }
    }
}

// ============================================================
// BƯỚC 5: Hiển thị kết quả
// ============================================================
function showResults(result) {
    showView('quizResultsView');

    const score   = result.score   ?? 0;
    const correct = result.correctAnswers ?? 0;
    const total   = result.totalQuestions ?? questions.length;
    const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;

    document.getElementById('finalScore').textContent   = `${score.toFixed(1)} / 10`;
    document.getElementById('correctCount').textContent  = correct;
    document.getElementById('incorrectCount').textContent = total - correct;
    document.getElementById('accuracyRate').textContent  = `${pct}%`;

    const msgEl  = document.getElementById('resultMessage');
    const iconEl = document.getElementById('resultIcon');
    if (pct >= 80) {
        msgEl.textContent  = 'Xuất sắc! Bạn làm rất tốt! 🎉';
        iconEl.textContent = '🏆';
    } else if (pct >= 60) {
        msgEl.textContent  = 'Tốt lắm! Tiếp tục cố gắng! 💪';
        iconEl.textContent = '👍';
    } else if (pct >= 40) {
        msgEl.textContent  = 'Khá ổn! Hãy ôn lại một chút. 📖';
        iconEl.textContent = '📚';
    } else {
        msgEl.textContent  = 'Cần cải thiện! Hãy học thêm nhé. 🌱';
        iconEl.textContent = '💡';
    }
}

// ============================================================
// Helpers
// ============================================================
function getUserId() {
    try { return JSON.parse(localStorage.getItem('currentUser'))?.userId ?? null; }
    catch { return null; }
}

function showView(viewId) {
    ['quizSelectionView', 'quizPlayingView', 'quizResultsView'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === viewId ? 'block' : 'none';
    });
}

function restartQuiz() { startQuiz(categoryId, catName); }
function backToQuizList() { showView('quizSelectionView'); }
