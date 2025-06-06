class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.quizData = null;
        this.userAnswers = [];
        
        // Get movie ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('movie');
        
        if (!movieId || !quizData[movieId]) {
            window.location.href = 'index.html';
            return;
        }
        
        this.quizData = quizData[movieId];
        document.title = this.quizData.title;
        
        this.initializeQuiz();
        this.setupEventListeners();
    }
    
    initializeQuiz() {
        this.updateProgressBar();
        this.displayQuestion();
    }
    
    setupEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
    }
    
    displayQuestion() {
        const question = this.quizData.questions[this.currentQuestion];
        document.getElementById('questionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            if (this.userAnswers[this.currentQuestion] === index) {
                button.classList.add('selected');
            }
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(button);
        });
        
        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentQuestion === 0;
        document.getElementById('nextBtn').textContent = 
            this.currentQuestion === this.quizData.questions.length - 1 ? 'Finish' : 'Next';
    }
    
    selectAnswer(index) {
        this.userAnswers[this.currentQuestion] = index;
        this.displayQuestion(); // Refresh to show selection
    }
    
    nextQuestion() {
        if (this.currentQuestion === this.quizData.questions.length - 1) {
            this.finishQuiz();
            return;
        }
        
        this.currentQuestion++;
        this.updateProgressBar();
        this.displayQuestion();
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.updateProgressBar();
            this.displayQuestion();
        }
    }
    
    updateProgressBar() {
        const progress = ((this.currentQuestion + 1) / this.quizData.questions.length) * 100;
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }
    
    calculateScore() {
        let score = 0;
        this.quizData.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct) {
                score++;
            }
        });
        return score;
    }
    
    finishQuiz() {
        const score = this.calculateScore();
        const totalQuestions = this.quizData.questions.length;
        const percentage = (score / totalQuestions) * 100;
        
        document.getElementById('finalScore').textContent = `${score}/${totalQuestions}`;
        
        let message = '';
        if (percentage >= 90) {
            message = 'Outstanding! You\'re a true movie expert!';
        } else if (percentage >= 70) {
            message = 'Great job! You know your movies well!';
        } else if (percentage >= 50) {
            message = 'Good effort! Keep watching and learning!';
        } else {
            message = 'Time to rewatch the movie!';
        }
        
        document.getElementById('resultMessage').textContent = message;
        
        const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
        resultsModal.show();
    }
}

// Initialize quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});