document.addEventListener('DOMContentLoaded', () => {
    const quizData = {
        easy: [
            {
                question: "What is the name of Chino's café?",
                answers: [
                    { text: "Rabbit House", correct: true },
                    { text: "Ama Usa An", correct: false },
                    { text: "Fleur de Lapin", correct: false },
                    { text: "Hot Bakery", correct: false }
                ]
            },
            {
                question: "What is Cocoa's first name?",
                answers: [
                    { text: "Hoto", correct: true },
                    { text: "Kafuu", correct: false },
                    { text: "Tedeza", correct: false },
                    { text: "Ujimatsu", correct: false }
                ]
            },
            {
                question: "What color is Chino's hair?",
                answers: [
                    { text: "Blue", correct: true },
                    { text: "Brown", correct: false },
                    { text: "Pink", correct: false },
                    { text: "Blonde", correct: false }
                ]
            },
            {
                question: "Who owns the Rabbit House café?",
                answers: [
                    { text: "Chino's grandfather", correct: true },
                    { text: "Cocoa", correct: false },
                    { text: "Rize", correct: false },
                    { text: "Chiya", correct: false }
                ]
            },
            {
                question: "What is the name of Chino's pet?",
                answers: [
                    { text: "Tippy", correct: true },
                    { text: "Cocoa", correct: false },
                    { text: "Maya", correct: false },
                    { text: "Chiya", correct: false }
                ]
            },
            {
                question: "What is Rize's family business?",
                answers: [
                    { text: "Military Café", correct: true },
                    { text: "Bakery", correct: false },
                    { text: "Flower Shop", correct: false },
                    { text: "Bookstore", correct: false }
                ]
            },
            {
                question: "What is Chiya's family business?",
                answers: [
                    { text: "Traditional Japanese Café", correct: true },
                    { text: "Bakery", correct: false },
                    { text: "Restaurant", correct: false },
                    { text: "Tea Shop", correct: false }
                ]
            },
            {
                question: "What color are Cocoa's eyes?",
                answers: [
                    { text: "Purple", correct: true },
                    { text: "Blue", correct: false },
                    { text: "Green", correct: false },
                    { text: "Brown", correct: false }
                ]
            },
            {
                question: "What is the primary setting of the anime?",
                answers: [
                    { text: "A small European-style town", correct: true },
                    { text: "Tokyo", correct: false },
                    { text: "Kyoto", correct: false },
                    { text: "Osaka", correct: false }
                ]
            },
            {
                question: "What is Syaro's favorite drink?",
                answers: [
                    { text: "Coffee", correct: true },
                    { text: "Tea", correct: false },
                    { text: "Hot Chocolate", correct: false },
                    { text: "Juice", correct: false }
                ]
            }
        ],
        medium: [
            {
                question: "Who is Tippy actually?",
                answers: [
                    { text: "Chino's grandfather's spirit", correct: true },
                    { text: "A normal rabbit", correct: false },
                    { text: "A magical creature", correct: false },
                    { text: "Chino's pet", correct: false }
                ]
            },
            {
                question: "What is the name of the OVA released in 2017?",
                answers: [
                    { text: "Dear My Sister", correct: true },
                    { text: "Sing for You", correct: false },
                    { text: "Rabbit House Story", correct: false },
                    { text: "Bloom", correct: false }
                ]
            },
            {
                question: "What year was the first season of the anime released?",
                answers: [
                    { text: "2014", correct: true },
                    { text: "2015", correct: false },
                    { text: "2013", correct: false },
                    { text: "2016", correct: false }
                ]
            },
            {
                question: "What is Chiya's full name?",
                answers: [
                    { text: "Ujimatsu Chiya", correct: true },
                    { text: "Kafuu Chiya", correct: false },
                    { text: "Tedeza Chiya", correct: false },
                    { text: "Hoto Chiya", correct: false }
                ]
            },
            {
                question: "What is the name of Rize's father?",
                answers: [
                    { text: "Takahiro Tedeza", correct: true },
                    { text: "Sharo Tedeza", correct: false },
                    { text: "Cocoa Tedeza", correct: false },
                    { text: "Chino Tedeza", correct: false }
                ]
            },
            {
                question: "Which character is known for her military-like personality?",
                answers: [
                    { text: "Rize", correct: true },
                    { text: "Chino", correct: false },
                    { text: "Cocoa", correct: false },
                    { text: "Chiya", correct: false }
                ]
            },
            {
                question: "What is the name of Chino's older sister who appears in the series?",
                answers: [
                    { text: "Mocha", correct: true },
                    { text: "Maya", correct: false },
                    { text: "Megu", correct: false },
                    { text: "Megumi", correct: false }
                ]
            },
            {
                question: "In which magazine was the manga first serialized?",
                answers: [
                    { text: "Manga Time Kirara Max", correct: true },
                    { text: "Shonen Jump", correct: false },
                    { text: "Weekly Shonen Magazine", correct: false },
                    { text: "Dengeki Daioh", correct: false }
                ]
            },
            {
                question: "What is the name of Syaro's café?",
                answers: [
                    { text: "Fleur de Lapin", correct: true },
                    { text: "Rabbit House", correct: false },
                    { text: "Ama Usa An", correct: false },
                    { text: "Hot Bakery", correct: false }
                ]
            },
            {
                question: "What is unique about Tippy?",
                answers: [
                    { text: "He can talk", correct: true },
                    { text: "He can fly", correct: false },
                    { text: "He changes color", correct: false },
                    { text: "He can cook", correct: false }
                ]
            }
        ],
        hard: [
            {
                question: "What is Rize's blood type?",
                answers: [
                    { text: "A", correct: true },
                    { text: "B", correct: false },
                    { text: "O", correct: false },
                    { text: "AB", correct: false }
                ]
            },
            {
                question: "What is the exact date of Cocoa's birthday?",
                answers: [
                    { text: "April 10th", correct: true },
                    { text: "April 11th", correct: false },
                    { text: "April 9th", correct: false },
                    { text: "April 12th", correct: false }
                ]
            },
            {
                question: "Who composed the music for the anime series?",
                answers: [
                    { text: "Ruka Kawada", correct: true },
                    { text: " Yousuke Okuda", correct: false },
                    { text: "Satoshi Kousaki", correct: false },
                    { text: "Yaginuma Kazuyoshi", correct: false }
                ]
            },
            {
                question: "What is the name of the movie released in 2019?",
                answers: [
                    { text: "Is the Order a Rabbit? Sing for You", correct: true },
                    { text: "Is the Order a Rabbit? Dear My Sister", correct: false },
                    { text: "Is the Order a Rabbit? BLOOM", correct: false },
                    { text: "Is the Order a Rabbit? The Movie", correct: false }
                ]
            },
            {
                question: "What is the main theme of the series?",
                answers: [
                    { text: "Friendship and Coffee", correct: true },
                    { text: "Adventure and Magic", correct: false },
                    { text: "Romance and Drama", correct: false },
                    { text: "Mystery and Horror", correct: false }
                ]
            },
            {
                question: "Which character is known for her love of bread?",
                answers: [
                    { text: "Sharo", correct: true },
                    { text: "Chino", correct: false },
                    { text: "Cocoa", correct: false },
                    { text: "Rize", correct: false }
                ]
            },
            {
                question: "What is the name of the manga artist behind Gochuumon wa Usagi Desu Ka?",
                answers: [
                    { text: "Koi", correct: true },
                    { text: "Kagami Yoshimizu", correct: false },
                    { text: "Katsura Hoshino", correct: false },
                    { text: "Kōhei Horikoshi", correct: false }
                ]
            },
            {
                question: "What is the name of the café that Chiya runs?",
                answers: [
                    { text: "Ama Usa An", correct: true },
                    { text: "Rabbit House", correct: false },
                    { text: "Fleur de Lapin", correct: false },
                    { text: "Hot Bakery", correct: false }
                ]
            },
            {
                question: "What is the relationship between Cocoa and Mocha?",
                answers: [
                    { text: "Sisters", correct: true },
                    { text: "Cousins", correct: false },
                    { text: "Friends", correct: false },
                    { text: "Classmates", correct: false }
                ]
            },
            {
                question: "What is the primary setting of the series?",
                answers: [
                    { text: "A small town in Japan", correct: true },
                    { text: "A bustling city", correct: false },
                    { text: "A fantasy world", correct: false },
                    { text: "A school", correct: false }
                ]
            }
        ]
    };

    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const difficultySelect = document.getElementById('difficulty-level');

    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 60;
    let timerInterval;
    let currentQuestions = [];

    function startQuiz() {
        const difficulty = difficultySelect.value;
        currentQuestions = [...quizData[difficulty]].sort(() => Math.random() - 0.5).slice(0, 10);

        startScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        resultsScreen.style.display = 'none';

        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 60;

        startTimer();
        loadQuestion();
    }

    function loadQuestion() {
        const questionText = document.getElementById('question-text');
        const answerButtons = document.getElementById('answer-buttons');
        const currentQuestionNumber = document.getElementById('current-question-number');
        const totalQuestions = document.getElementById('total-questions');

        currentQuestionNumber.textContent = currentQuestionIndex + 1;
        totalQuestions.textContent = currentQuestions.length;

        const currentQuestion = currentQuestions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;

        answerButtons.innerHTML = '';
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(answer));
            answerButtons.appendChild(button);
        });
    }

    function selectAnswer(selectedAnswer) {
        const correct = selectedAnswer.correct;
        if (correct) {
            score++;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }

    function startTimer() {
        const countdownEl = document.getElementById('countdown');
        timerInterval = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                endQuiz();
            }
        }, 1000);
    }

    function endQuiz() {
        clearInterval(timerInterval);
        quizScreen.style.display = 'none';
        resultsScreen.style.display = 'block';

        const finalScoreEl = document.getElementById('final-score');
        const totalQuestionsEl = document.getElementById('total-questions-result');
        const performanceMessage = document.getElementById('performance-message');

        finalScoreEl.textContent = score;
        totalQuestionsEl.textContent = currentQuestions.length;

        const percentage = (score / currentQuestions.length) * 100;
        if (percentage === 100) {
            performanceMessage.textContent = "Perfect Score! You're a Gochuumon Expert!";
        } else if (percentage >= 70) {
            performanceMessage.textContent = "Great Job! You know a lot about Gochuumon!";
        } else if (percentage >= 50) {
            performanceMessage.textContent = "Not bad! Keep watching the anime!";
        } else {
            performanceMessage.textContent = "Maybe rewatch the series?";
        }
    }

    startQuizBtn.addEventListener('click', startQuiz);
    restartQuizBtn.addEventListener('click', () => {
        resultsScreen.style.display = 'none';
        startScreen.style.display = 'block';

        document.getElementById('share-result-btn').addEventListener('click', shareResult);

        function shareResult() {
            const difficulty = difficultySelect.value;
            const score = document.getElementById('final-score').textContent;
            const totalQuestions = document.getElementById('total-questions-result').textContent;
            const performanceMessage = document.getElementById('performance-message').textContent;

            // Check if Web Share API is supported
            if (navigator.share) {
                try {
                    navigator.share({
                        title: 'GochiUsa Quiz Result',
                        text: `I scored ${score}/${totalQuestions} on the GochiUsa Quiz (${difficulty} difficulty)! ${performanceMessage}`,
                        url: window.location.href
                    });
                } catch (error) {
                    console.error('Error sharing:', error);
                    fallbackShare();
                }
            } else {
                // Fallback for browsers that don't support Web Share API
                fallbackShare();
            }
        }

        function fallbackShare() {
            const difficulty = difficultySelect.value;
            const score = document.getElementById('final-score').textContent;
            const totalQuestions = document.getElementById('total-questions-result').textContent;
            const performanceMessage = document.getElementById('performance-message').textContent;

            const shareText = `I scored ${score}/${totalQuestions} on the GochiUsa Quiz (${difficulty} difficulty)! ${performanceMessage} #GochiUsaQuiz #Anime`;

            // Copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Result copied to clipboard! You can now paste and share.');
            }).catch(err => {
                console.error('Could not copy text: ', err);
                alert('Unable to copy result. Please manually copy the text.');
            });
        }
    });
});