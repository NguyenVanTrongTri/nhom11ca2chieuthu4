// ============================================
// Dashboard JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Load user learning statistics
    loadLearningStats();
    
    // Initialize charts (if using a chart library)
    initializeCharts();
}

function loadLearningStats() {
    // This would typically load from API
    // For now, static data is shown in HTML
    console.log('Loading learning statistics...');
}

function initializeCharts() {
    // If using Chart.js or similar library, initialize here
    // Example:
    // const ctx = document.getElementById('chartCanvas').getContext('2d');
    // new Chart(ctx, { ... });
}

function updateProgress() {
    // Update progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        // Animate or update as needed
    });
}

// Export function to be called from other pages
function getDashboardData() {
    return {
        wordsLearned: 245,
        quizCorrect: 189,
        streakDays: 12,
        accuracy: 76
    };
}
