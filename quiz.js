const quizData = {
    html: [
        { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Markup Language", "None"], correct: 0 },
        { q: "Who is making the Web standards?", options: ["Google", "The World Wide Web Consortium", "Microsoft", "Mozilla"], correct: 1 },
        { q: "Choose the correct HTML element for the largest heading:", options: ["<heading>", "<h6>", "<h1>", "<head>"], correct: 2 },
        { q: "What is the correct HTML element for inserting a line break?", options: ["<lb>", "<break>", "<br>", "<a>"], correct: 2 },
        { q: "Which attribute is used to provide an image path?", options: ["href", "src", "alt", "link"], correct: 1 },
        { q: "Which HTML element is used to define important text?", options: ["<strong>", "<i>", "<important>", "<b>"], correct: 0 },
        { q: "How can you make a numbered list?", options: ["<ul>", "<dl>", "<list>", "<ol>"], correct: 3 },
        { q: "What is the correct HTML for making a checkbox?", options: ["<input type='check'>", "<check>", "<checkbox>", "<input type='checkbox'>"], correct: 3 },
        { q: "Which HTML element is used to specify a footer for a document?", options: ["<section>", "<bottom>", "<footer>", "<div>"], correct: 2 },
        { q: "In HTML, onblur and onfocus are:", options: ["Style attributes", "HTML elements", "Event attributes", "None"], correct: 2 }
    ],
    css: [
        { q: "What does CSS stand for?", options: ["Colorful Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets"], correct: 1 },
        { q: "Where in an HTML document is the correct place to refer to an external style sheet?", options: ["In the <body> section", "At the end of the document", "In the <head> section", "Inside the <div>"], correct: 2 },
        { q: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<link>"], correct: 2 },
        { q: "Which HTML attribute is used to define inline styles?", options: ["class", "font", "styles", "style"], correct: 3 },
        { q: "Which property is used to change the background color?", options: ["color", "background-color", "bgcolor", "fill"], correct: 1 },
        { q: "How do you add a background color for all <h1> elements?", options: ["h1.all {color:blue;}", "h1 {background-color:blue;}", "all.h1 {color:blue;}", "h1 {color:blue;}"], correct: 1 },
        { q: "Which CSS property is used to change the text color of an element?", options: ["text-color", "color", "fgcolor", "font-style"], correct: 1 },
        { q: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], correct: 2 },
        { q: "How do you display hyperlinks without an underline?", options: ["a {text-decoration:none;}", "a {underline:none;}", "a {decoration:no-underline;}", "a {text-decoration:no-underline;}"], correct: 0 },
        { q: "Which property is used to change the font of an element?", options: ["font-weight", "font-style", "font-family", "font-type"], correct: 2 }
    ],
    js: [
        { q: "Inside which HTML element do we put the JavaScript?", options: ["<scripting>", "<js>", "<javascript>", "<script>"], correct: 3 },
        { q: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');", "console.log('Hello World');"], correct: 2 },
        { q: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"], correct: 0 },
        { q: "How do you call a function named 'myFunction'?", options: ["call myFunction()", "myFunction()", "call function myFunction()", "Execute myFunction()"], correct: 1 },
        { q: "How to write an IF statement in JavaScript?", options: ["if i = 5 then", "if (i == 5)", "if i == 5", "if i = 5"], correct: 1 },
        { q: "How does a WHILE loop start?", options: ["while (i <= 10; i++)", "while i = 1 to 10", "while (i <= 10)", "loop while"], correct: 2 },
        { q: "How can you add a comment in a JavaScript?", options: ["'This is a comment", "//This is a comment", "<!--This is a comment-->", "*Comment*"], correct: 1 },
        { q: "What is the correct way to write a JavaScript array?", options: ["var colors = 1 = ('red'), 2 = ('green')", "var colors = 'red', 'green', 'blue'", "var colors = ['red', 'green', 'blue']", "var colors = (1:'red', 2:'green')"], correct: 2 },
        { q: "How do you round the number 7.25, to the nearest integer?", options: ["Math.round(7.25)", "rnd(7.25)", "Math.rnd(7.25)", "round(7.25)"], correct: 0 },
        { q: "Which event occurs when the user clicks on an HTML element?", options: ["onmouseclick", "onchange", "onclick", "onmouseover"], correct: 2 }
    ]
};

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timeLeft = 20 * 60; // 20 minutes in seconds
let timerInterval;
let isQuizFinished = false;

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type') || 'html';

function initQuiz() {
    currentQuiz = quizData[type];
    document.getElementById('quiz-title').innerText = `${type.toUpperCase()} Quiz`;

    // Use a SweetAlert to get the required user gesture for Fullscreen
    Swal.fire({
        title: `Ready to start the ${type.toUpperCase()} Quiz?`,
        text: "The quiz will run in full-screen mode. If you switch tabs or minimize the window, the quiz will be terminated.",
        icon: 'warning',
        confirmButtonText: 'Start Quiz Now',
        showCancelButton: true,
        cancelButtonText: 'Back to Dashboard',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            requestFullScreen();
            showQuestion();
            startTimer();
            
            // Security: Detect tab switching or minimizing
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden' && !isQuizFinished) {
                    clearInterval(timerInterval);
                    Swal.fire({
                        title: 'Quiz Terminated!',
                        text: 'Security Violation: You attempted to switch tabs or minimize the window.',
                        icon: 'error',
                        confirmButtonText: 'Exit to Dashboard',
                        allowOutsideClick: false
                    }).then(() => {
                        window.location.href = 'dashboard.html';
                    });
                }
            });
        } else {
            window.location.href = 'dashboard.html';
        }
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            Swal.fire({
                title: "Time's Up!",
                text: "Your time has expired. Submitting your quiz now.",
                icon: "warning",
                timer: 2000,
                showConfirmButton: false
            }).then(() => finishQuiz());
        }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById('timer').innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari/Chrome */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function showQuestion() {
    selectedOption = null;
    document.getElementById('next-btn').style.display = 'none';
    const question = currentQuiz[currentQuestionIndex];
    
    // Update Progress
    const progress = ((currentQuestionIndex) / currentQuiz.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;

    document.getElementById('question-text').innerText = `${currentQuestionIndex + 1}. ${question.q}`;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(index, btn) {
    selectedOption = index;
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').addEventListener('click', () => {
    requestFullScreen(); // Reinforce fullscreen
    if (selectedOption === currentQuiz[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuiz.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
});

function finishQuiz() {
    isQuizFinished = true;
    clearInterval(timerInterval);
    document.getElementById('progress-fill').style.width = `100%`;
    const total = currentQuiz.length;
    const percentage = (score / total) * 100;

    Swal.fire({
        title: 'Quiz Completed! 🎉',
        html: `
            <div style="font-size: 1.1rem; text-align: left; padding: 10px;">
                <p style="margin-bottom: 8px;">Total Questions: <span style="float: right;"><b>${total}</b></span></p>
                <p style="margin-bottom: 8px;">Correct Answers: <span style="float: right; color: #27ae60;"><b>${score}</b></span></p>
                <hr style="margin: 10px 0;">
                <p style="font-size: 1.4rem; text-align: center;">Final Score: <b>${percentage}%</b></p>
            </div>`,
        icon: 'success',
        confirmButtonText: 'Back to Dashboard'
    }).then(() => {
        window.location.href = 'dashboard.html';
    });
}

initQuiz();