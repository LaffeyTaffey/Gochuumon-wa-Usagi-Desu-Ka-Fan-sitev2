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
    }
];

let currentQuestion = 0;
let score = 0;

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
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('result').textContent = '';
}

function selectChoice(index) {
    const choices = document.querySelectorAll('.quiz-choice');
    choices.forEach(choice => choice.classList.remove('selected'));
    choices[index].classList.add('selected');
}

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

    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('next-question').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showFinalScore();
    }
}

function showFinalScore() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h3>Quiz Complete!</h3>
        <p>Your score: ${score} out of ${quizData.length}</p>
        <button onclick="restartQuiz()">Restart Quiz</button>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

document.getElementById('submit-answer').addEventListener('click', submitAnswer);
document.getElementById('next-question').addEventListener('click', nextQuestion);

loadQuestion();