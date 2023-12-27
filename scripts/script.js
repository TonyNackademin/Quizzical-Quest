const question = document.querySelector('#question');
const progressText = document.querySelector('#progressText');
const progressBarFull = document.querySelector('#progressBarFull');
const buttons = document.querySelectorAll('.btn');
const correctSound = document.querySelector('#correctSound');
const incorrectSound = document.querySelector('#incorrectSound');
const progressBar = document.querySelector('#progressBar');
const restartButton = document.querySelector('#restartButton');
const restartContainer = document.querySelector('#restartContainer');
const gameResultText = document.querySelector('#gameResult');
const timeCount = document.querySelector('#timer');

let currentQuestion = {};
let acceptingAnswer = true;
let questionCounter = 0;
let score = 0;
let availableQuestions = [];
let counters = []; 
let inResultsDisplay = false;

const SCORE_POINTS = 1;
const MAX_QUESTIONS = 10;

// Funktion för att starta spelet
startGame = () => {
    questionCounter = 0;
    inResultsDisplay = false;
    score = 0;
    availableQuestions = [...questions];    //spread-operator
    counters = [];
    getNewQuestion();
};

// Funktion för att öka poängen
incrementScore = (num) => {
    score += num;
};

// Funktion för att hämta en ny fråga
getNewQuestion = () => {
    inResultsDisplay = false;
    if (questionCounter < MAX_QUESTIONS) {
        questionCounter++;
        progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

        // Välj en slumpmässig fråga från de tillgängliga frågorna
        const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionsIndex];

        // Uppdatera HTML med den aktuella frågan och svarsalternativen
        const questionText = currentQuestion.questionen;
        question.textContent = questionText;

        buttons.forEach((btn, index) => {
            btn.innerText = currentQuestion['btn' + (index + 1)];
        });

        // Ta bort den använda frågan från tillgängliga frågor
        availableQuestions.splice(questionsIndex, 1);

        acceptingAnswer = true;
        timeCount.textContent = 10;
        counters[questionCounter - 1] = startTimer(10);
    } else {
        // Visa resultat om alla frågor har besvarats
        displayResults();
    }
};
// Funktion för att kontrollera svar
checkAnswer = (selectedAnswer) => {
    if (!acceptingAnswer) return;
    acceptingAnswer = false;

    clearInterval(counters[questionCounter - 1]);

    let classToApply = selectedAnswer == currentQuestion.correctAnswer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
        incrementScore(SCORE_POINTS);
        correctSound.play();
    } else {
        incorrectSound.play();
    }
    buttons[selectedAnswer].classList.add(classToApply);

    setTimeout(() => {
        buttons[selectedAnswer].classList.remove(classToApply);
        getNewQuestion();
    }, 1000);
};

//CheckAnswer funktionen kallas varje gång man trycker på knapparna
buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        checkAnswer(index);
    });
});


// Funktion för att starta timer
function startTimer(time) {
    const counter = setInterval(timer, 1000);
    let currentTimer = time;

    function timer() {
        timeCount.textContent = currentTimer;
        currentTimer--;

        // När tiden är slut och resultaten inte har visats, markera felaktiga svar och gå vidare
        if (currentTimer < 0 && !inResultsDisplay) {
            clearInterval(counter);
            timeCount.textContent = "0";

            buttons.forEach((btn) => {
                btn.classList.add('incorrect');
                incorrectSound.play();
            });

            setTimeout(() => {
                buttons.forEach((btn) => {
                    btn.classList.remove('incorrect');
                });
                getNewQuestion();
            }, 2000);
        }
        // Om tiden är ute och alla frågor har besvarats, stoppa timern
        if (currentTimer < 0 && questionCounter >= MAX_QUESTIONS) {
            clearInterval(counter);
        }
    }

    return counter;
}

// Funktion för att visa resultat
displayResults = () => {
    inResultsDisplay = true;
    clearInterval(counters[questionCounter - 1]);
    progressBarFull.style.width = '0%';
    progressText.style.visibility = 'hidden';
    progressBar.style.visibility = 'hidden';
    question.style.visibility = 'hidden';
    timeCount.style.visibility = 'hidden';

    const correctAnswers = score;
    gameResultText.innerText = ` Correct Answers: ${correctAnswers} of ${MAX_QUESTIONS}`;

    buttons.forEach((btn) => {
        if (btn) {
            btn.style.display = 'none';
        }
    });
    restartContainer.style.display = 'block';
};
// Hemsidan refreshas när man klickar på restart knappen
restartButton.addEventListener('click', () => {
    location.reload();
});

startGame();
