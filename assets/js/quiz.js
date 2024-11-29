const quizData = [
    {
        question: "What is the name of the coffee shop where Cocoa works?",
        choices: ["Rabbit House", "Cat's Paw", "Fleur de Lapin", "Ama Usa An"],
        correctAnswer: 0
    },
    {
        question: "Who is the youngest character in the main cast?",
        choices: ["Cocoa", "Chino", "Megu", "Maya"],
        correctAnswer: 1
    },
    {
        question: "What is the name of Chino's pet rabbit?",
        choices: ["Tippy", "Hoppy", "Fluffy", "Bunny"],
        correctAnswer: 0
    },
    {
        question: "Which character is a skilled barista?",
        choices: ["Cocoa", "Chino", "Rize", "Megu"],
        correctAnswer: 2
    },
    {
        question: "What is the name of the cafe that Chino's grandfather owns?",
        choices: ["Rabbit House", "Floral Dreams", "Ama Usa An", "Cafe Fluffy"],
        correctAnswer: 0
    },
    {
        question: "Who is the author of the manga 'Gochuumon wa Usagi desu ka'?",
        choices: ["Koi", "Himura", "Uchida", "Katsu"],
        correctAnswer: 0
    }
];


let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15; // 15 seconds per question

// Start Timer
function startTimer() {
    timeLeft = 15;
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer();
        }
    }, 1000);
}

// Reset Timer
function resetTimer() {
    clearInterval(timer);
    startTimer();
}

// Load Question
function loadQuestion() {
    const questionEl = document.getElementById('question');
    const choicesEl = document.getElementById('choices');
    const currentQuiz = quizData[currentQuestion];

    questionEl.textContent = currentQuiz.question;
    choicesEl.innerHTML = '';
    currentQuiz.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('quiz-choice');
        button.addEventListener('click', () => selectChoice(index));
        choicesEl.appendChild(button);
    });

    document.getElementById('submit-answer').style.display = 'inline-block';
    document.getElementById('result').textContent = '';
    resetTimer();
    updateProgressBar();
}

// Update Progress Bar
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = (currentQuestion / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function selectChoice(index) {
    const choices = document.querySelectorAll('.quiz-choice');
    choices.forEach(choice => choice.classList.remove('selected'));
    choices[index].classList.add('selected');
}

// Submit Answer
function submitAnswer() {
    const selectedChoice = document.querySelector('.quiz-choice.selected');
    if (!selectedChoice) return;

    const selectedAnswer = Array.from(selectedChoice.parentNode.children).indexOf(selectedChoice);
    const currentQuiz = quizData[currentQuestion];

    if (selectedAnswer === currentQuiz.correctAnswer) {
        score++;
        document.getElementById('result').textContent = 'Correct!';
    } else {
        document.getElementById('result').textContent = 'Incorrect. The correct answer was: ' + currentQuiz.choices[currentQuiz.correctAnswer];
    }

    // Hide the submit button and show the next question after the timer ends or answer is submitted
    document.getElementById('submit-answer').style.display = 'none';

    // Automatically move to the next question after a small delay
    setTimeout(() => {
        nextQuestion();
    }, 1000); // Delay before moving to the next question
}

// Go to Next Question
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showFinalScore();
    }
}

// Show Final Score
function showFinalScore() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h3>Quiz Complete!</h3>
        <p>Your score: ${score} out of ${quizData.length}</p>
        <button id="restart-button" onclick="restartQuiz()" class="quiz-button">Restart Quiz</button>
    `;
}

// Restart Quiz
function restartQuiz() {
    // Reset quiz state
    currentQuestion = 0;
    score = 0;

    // Clear the timer
    clearInterval(timer);

    // Clear the previous results and load the first question
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h3 id="question"></h3>
        <div id="choices"></div>
        <p id="timer" class="timer">Time Left: 15s</p>
        <div class="progress-container">
            <div id="progress-bar" class="progress-bar"></div>
        </div>
        <button id="submit-answer">Submit Answer</button>
        <p id="result"></p>
        <button id="next-question" style="display: none;">Next Question</button>
    `;

    // Reload the quiz and start timer again
    loadQuestion();
}

function showFinalScore() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h3>Quiz Complete!</h3>
        <p>Your score: ${score} out of ${quizData.length}</p>
        <button id="restart-button" onclick="restartQuiz()" class="quiz-button">Restart Quiz</button>
    `;
}



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit-answer').addEventListener('click', submitAnswer);
    loadQuestion();
    startTimer();
});