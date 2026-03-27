// ============================================
// Quiz JavaScript
// ============================================

let currentQuizId = null;
let currentQuestion = 0;
let score = 0;
let answers = [];

const quizzes = {
    1: {
        title: 'Food Vocabulary',
        questions: [
            {
                question: 'Which word means "tuyệt vời / ngon miệng"?',
                hint: 'Từ này thường được dùng để mô tả thức ăn ngon',
                options: ['Delicious', 'Terrible', 'Bad', 'Sour'],
                correct: 0,
                explanation: 'Delicious (ngon miệng) là từ được dùng để mô tả thức ăn có vị tuyệt vời'
            },
            {
                question: 'What is the English word for "rau"?',
                hint: 'Đây là một loại thực vật ăn được',
                options: ['Vegetable', 'Fruit', 'Meat', 'Bread'],
                correct: 0,
                explanation: 'Vegetable là từ chỉ các loại rau xanh'
            },
            {
                question: 'Which one is a fruit?',
                hint: 'Loại thực phẩm có vị ngọt',
                options: ['Apple', 'Carrot', 'Onion', 'Lettuce'],
                correct: 0,
                explanation: 'Apple (táo) là một loại quả'
            }
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});

function initializeQuiz() {
    setupQuizListeners();
}

function setupQuizListeners() {
    // Quiz item listeners
    const quizItems = document.querySelectorAll('.quiz-item');
    quizItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const quizId = index + 1;
            startQuiz(quizId);
        });
    });
}

function startQuiz(quizId) {
    currentQuizId = quizId;
    currentQuestion = 0;
    score = 0;
    answers = [];
    
    // Hide selection view, show quiz view
    document.getElementById('quizSelectionView').style.display = 'none';
    document.getElementById('quizPlayingView').style.display = 'block';
    document.getElementById('quizResultsView').style.display = 'none';
    
    displayQuestion();
}

function displayQuestion() {
    const quiz = quizzes[currentQuizId];
    if (!quiz) return;
    
    const question = quiz.questions[currentQuestion];
    
    // Update progress
    const total = quiz.questions.length;
    document.getElementById('progressText').textContent = `Câu ${currentQuestion + 1} / ${total}`;
    document.getElementById('scoreText').textContent = `Điểm: ${score}`;
    document.getElementById('progressBar').style.width = `${((currentQuestion + 1) / total) * 100}%`;
    
    // Update question
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('hint').textContent = question.hint;
    
    // Clear previous state
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.style.display = 'none';
    feedbackMessage.innerHTML = '';
    
    document.getElementById('explanationBox').style.display = 'none';
    
    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerHTML = `
            <input type="radio" name="option" id="option-${index}" value="${index}" ${answers[currentQuestion] === index ? 'checked' : ''}>
            <label for="option-${index}" class="option-text" style="cursor: pointer; margin: 0;">${option}</label>
        `;
        optionsContainer.appendChild(div);
        
        // Add click listener to the entire option div
        div.addEventListener('click', () => {
            document.getElementById(`option-${index}`).checked = true;
        });
    });
    
    // Update button states
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').textContent = currentQuestion === quiz.questions.length - 1 
        ? 'Hoàn Thành <i class="fas fa-check"></i>' 
        : 'Câu Tiếp <i class="fas fa-chevron-right"></i>';
}

function nextQuestion() {
    const quiz = quizzes[currentQuizId];
    const selectedAnswer = document.querySelector('input[name="option"]:checked');
    
    if (!selectedAnswer) {
        showNotification('Vui lòng chọn một đáp án', 'warning');
        return;
    }
    
    const selectedIndex = parseInt(selectedAnswer.value);
    answers[currentQuestion] = selectedIndex;
    
    const question = quiz.questions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        score++;
    }
    
    // Show feedback
    showFeedback(isCorrect, question.explanation);
    
    currentQuestion++;
    
    if (currentQuestion < quiz.questions.length) {
        setTimeout(() => {
            displayQuestion();
        }, 2000);
    } else {
        setTimeout(() => {
            showResults();
        }, 2000);
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function showFeedback(isCorrect, explanation) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    const explanationBox = document.getElementById('explanationBox');
    
    if (isCorrect) {
        feedbackMessage.className = 'feedback-message feedback-correct';
        feedbackMessage.innerHTML = '<i class="fas fa-check-circle"></i> Chính xác!';
    } else {
        feedbackMessage.className = 'feedback-message feedback-incorrect';
        feedbackMessage.innerHTML = '<i class="fas fa-times-circle"></i> Sai rồi!';
    }
    
    feedbackMessage.style.display = 'block';
    
    // Show explanation
    document.getElementById('explanationText').textContent = explanation;
    explanationBox.style.display = 'block';
    
    // Disable options
    const options = document.querySelectorAll('input[name="option"]');
    options.forEach(option => {
        option.disabled = true;
    });
    
    // Disable next button temporarily
    document.getElementById('nextBtn').disabled = true;
}

function showResults() {
    const quiz = quizzes[currentQuizId];
    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    
    // Show results view
    document.getElementById('quizPlayingView').style.display = 'none';
    document.getElementById('quizResultsView').style.display = 'block';
    
    document.getElementById('finalScore').textContent = `${score}/${total}`;
    document.getElementById('correctCount').textContent = score;
    document.getElementById('incorrectCount').textContent = total - score;
    document.getElementById('accuracyRate').textContent = `${percentage}%`;
    
    // Set message based on performance
    let message = '';
    if (percentage >= 80) {
        message = 'Tuyệt vời! Bạn làm rất tốt!';
    } else if (percentage >= 60) {
        message = 'Tốt lắm! Tiếp tục cố gắng!';
    } else if (percentage >= 40) {
        message = 'Khá tốt! Hãy ôn lại một chút';
    } else {
        message = 'Cần cải thiện! Hãy tiếp tục học';
    }
    
    document.getElementById('resultMessage').textContent = message;
}

function restartQuiz() {
    startQuiz(currentQuizId);
}

function backToQuizList() {
    document.getElementById('quizSelectionView').style.display = 'block';
    document.getElementById('quizPlayingView').style.display = 'none';
    document.getElementById('quizResultsView').style.display = 'none';
}

function showNotification(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.quiz-card');
    if (container) {
        container.insertBefore(alert, container.firstChild);
    }
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
