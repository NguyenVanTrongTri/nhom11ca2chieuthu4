// ============================================
// Vocabulary JavaScript
// ============================================

let currentCategory = 'all';
const vocabularyData = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeVocabulary();
});

function initializeVocabulary() {
    // Set up search functionality
    setupSearch();
    
    // Set up filter functionality
    setupFilters();
    
    // Load vocabulary data
    loadVocabulary();
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const vocabularyList = document.getElementById('vocabularyList');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterVocabulary(searchTerm);
        }, 300));
    }
}

function setupFilters() {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            chips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Get category and filter
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
}

function filterByCategory(category, element = null) {
    currentCategory = category;
    
    if (element) {
        // Update active chip
        document.querySelectorAll('.chip').forEach(chip => {
            chip.classList.remove('active');
        });
        element.classList.add('active');
    }
    
    const cards = document.querySelectorAll('.vocab-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchVocabulary() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const searchTerm = searchInput.value.toLowerCase();
        filterVocabulary(searchTerm);
    }
}

function filterVocabulary(searchTerm) {
    const cards = document.querySelectorAll('.vocab-card');
    
    cards.forEach(card => {
        const word = card.querySelector('.vocab-word').textContent.toLowerCase();
        const definition = card.querySelector('.vocab-definition').textContent.toLowerCase();
        const category = card.getAttribute('data-category');
        
        const matchesSearch = word.includes(searchTerm) || definition.includes(searchTerm);
        const matchesCategory = currentCategory === 'all' || category === currentCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function loadVocabulary() {
    // Vocabulary data will be loaded from API
}

function playSound(word) {
    // Use Web Audio API or a library like howler.js
    console.log('Playing sound for:', word);
    
    // Simple implementation using Speech Synthesis API
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function markAsLearned(button) {
    button.textContent = '✓ Đã Học';
    button.classList.add('disabled');
    button.disabled = true;
    
    // Save to backend/localStorage
    showNotification('Đã lưu vào từ vựng đã học', 'success');
}

function addBookmark(button) {
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        button.textContent = 'Bookmark';
    } else {
        button.classList.add('active');
        button.textContent = '★ Đã Bookmark';
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Setup event delegation for dynamic elements
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('vocab-btn-learn')) {
        const word = e.target.closest('.vocab-card').querySelector('.vocab-word').textContent;
        console.log('Marked as learned:', word);
        showNotification(`Đã lưu "${word}" vào từ vựng đã học`, 'success');
        e.target.disabled = true;
        e.target.textContent = '✓ Đã Học';
    }
    
    if (e.target.classList.contains('vocab-btn-bookmark')) {
        const word = e.target.closest('.vocab-card').querySelector('.vocab-word').textContent;
        e.target.classList.toggle('active');
        const action = e.target.classList.contains('active') ? 'Đã bookmark' : 'Bỏ bookmark';
        console.log(action + ':', word);
        showNotification(`${action} "${word}"`, 'info');
    }
});

function showNotification(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    alert.style.position = 'fixed';
    alert.style.top = '80px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.maxWidth = '400px';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto dismiss
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
