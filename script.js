const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const defaultColors = [
    { id: "greenColor", color: "green"},
    { id: "redColor", color: "red"},
    { id: "whiteColor", color: "white"},
    { id: "wonColor", color: "green"},
    { id: "lostColor", color: "red"},
    { id: "scoreColor", color: "blue"},
    { id: "timerColor", color: "coral"},
    { id: "boxColor", color: "yellow"},
    { id: "optionColor", color: "burlywood"},
    { id: "optionTextColor", color: "black"},
    { id: "optionBackgroundColor", color: "white"},
    { id: "optionHoverColor", color: "orange"},
    { id: "thirdBackgroundColor", color: "lightblue"},
];    
const colorInputs = [
    { id: "greenColor", variable: "--green-color"},
    { id: "redColor", variable: "--red-color"},
    { id: "whiteColor", variable: "--white-color"},
    { id: "wonColor", variable: "--won-color" },
    { id: "lostColor", variable: "--lost-color" },
    { id: "scoreColor", variable: "--score-color" },
    { id: "timerColor", variable: "--timer-color" },
    { id: "boxColor", variable: "--box-color" },
    { id: "optionColor", variable: "--option-color" },
    { id: "optionTextColor", variable: "--option-text-color" },
    { id: "optionBackgroundColor", variable: "--option-background-color" },
    { id: "optionHoverColor", variable: "--option-hover-color" },
    { id: "thirdBackgroundColor", variable: "--third-background-color" },
];

let scores = localStorage.getItem('scoreList');
scores = scores ? JSON.parse(scores) : initializeScores();
let colors = localStorage.getItem('colorsList');
colors = colors ? JSON.parse(colors) : initializeColors();

let startTime;
let currentTime;
let timeTaken;
let timeInMilliseconds = 30000
let timerInterval;
let won = 0;
let lost = 0;
let score = 0;
let greenCount;
let timesTaken = [];
let previousGreenCount = -1;
let previousGreenIndex = -1;

function initializeScores() {
    return ["N/A", "N/A", "N/A", "N/A", "N/A"];
}

function initializeColors() {
    saveList("colorsList", defaultColors);
    return defaultColors.map(color => color.color);
}

function compareRandom() {
    return Math.random() - 0.5;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getShuffledList(shuffleList) {
    return [...shuffleList].sort(compareRandom);
}

function recordStartTime() {
    startTime = new Date();
}

function recordCurrentTime() {
    currentTime = new Date();
}

function recordTimeTaken() {
    timeTaken =  currentTime - startTime;
}

function calculateAverageTime(timeList, timeLeft) {
    if (timeList.length === 0) return "N/A";
    const total = timeList.reduce((acc, time) => acc + time, 0);
    const average = (total / timeList.length) + (timeLeft / timeList.length);
    return Math.floor(average);
}

function display(optionElements) {
    const randomList = getShuffledList(list);
    getGreenCount();
    const { greenList, redList, whiteList } = getList(randomList);
    let options = getOptions();
    renderSquares(greenList, redList, whiteList);
    renderOptions(options, optionElements);
    recordStartTime();
}

function getGreenCount() {
    do {
        greenCount = getRandomInt(4, 8);
    } while (previousGreenCount == greenCount);
    previousGreenCount = greenCount;
}

function getOptions() {
    let options = [greenCount - 1, greenCount, greenCount + 1];
    do {
        options.sort(compareRandom);
    } while (options[previousGreenIndex] == greenCount);
    previousGreenIndex = options.indexOf(greenCount);
    return options;
}

function getList(randomList) {
    const redCount = getRandomInt(4, 11 - greenCount);
    const greenList = randomList.slice(0, greenCount);
    randomList.splice(0, greenCount);
    const redList = randomList.slice(0, redCount);
    randomList.splice(0, redCount);
    const whiteList = randomList;
    return { greenList, redList, whiteList };
}

function renderSquares(greenList, redList, whiteList) {
    renderDisplay(greenList, "green");
    renderDisplay(redList, "red");
    renderDisplay(whiteList, "white");
}

function renderDisplay(colorsList, color) {
    colorsList.forEach(num => {
        setColorClass(num, color);
    });
}

function updateDisplay(scores, currentScore = "N/A") {
    if (!isNaN(currentScore)) {
        scores.push(currentScore);
        scores = sortScores(scores);
    }
}

function sortScores(scores) {
    scores = scores.filter(score => !isNaN(score)).sort((a, b) => a - b);
    scores = scores.slice(0, 5);
    saveList('scoreList', scores);
    updateScores(scores);
    return scores;
}

function saveList(name, list) {
    localStorage.setItem(name, JSON.stringify(list));
}

function updateScores(scores) {
    for (let i = 0; i < 5; i++) {
        const scoreText = scores[i];
        document.querySelector(`#top_${i + 1} .score-text`).textContent = scoreText;
    }
}

function renderOptions(options, optionElements) {
    options.forEach((option, index) => {
        optionElements[index].textContent = option;
    });
}

function setColorClass(index, colorClass) {
    const element = document.querySelector(`[data-index="${index}"]`)
    element.classList.remove(...element.classList)
    element.classList.add("square")
    element.classList.add(colorClass)
}

function updateScoreDisplay() {
    document.getElementById("won").textContent = won;
    document.getElementById("lost").textContent = lost;
    
    score = won - lost;
    document.getElementById("score").textContent = score;
}

function resetValues(timerElement, timeElement) {
    timeInMilliseconds = 30000;
    timerElement.textContent = "30:00";
    timeElement.textContent = "0ms";
    won = 0;
    lost = 0;
    timesTaken = [];
}

function handleOptionClick(optionText, timeElement, optionElements) {
    if (!(optionText>='0' && optionText<='9')) {
        return;
    }
    recordCurrentTime();
    recordTimeTaken();
    
    if (parseInt(optionText) === greenCount) {
        handleCorrectOption(timeTaken, timeElement);
    } else {
        handleIncorrectOption(timeTaken, timeElement);
    }
    display(optionElements);
    updateScoreDisplay();
}

function handleIncorrectOption(timeTaken, timeElement) {
    lost++;
    timesTaken.push(timeTaken + 1000);
    timeElement.textContent = `${Math.floor(timeTaken)} ms + 1000`;
}

function handleCorrectOption(timeTaken, timeElement) {
    won++;
    timesTaken.push(timeTaken);
    timeElement.textContent = `${Math.floor(timeTaken)} ms`;
}

function updateTimerDisplay(timerElement) {
    const seconds = Math.floor(timeInMilliseconds / 1000).toString().padStart(2, '0');
    const remainingMilliseconds = timeInMilliseconds % 1000;
    const milliseconds = Math.floor(remainingMilliseconds / 10).toString().padStart(2, '0');
    timerElement.textContent = `${seconds}:${milliseconds}`;
}

function handleGameOver(timerElement) {
    stopTimer();
    timerElement.textContent = "00:00";
    recordCurrentTime();
    recordTimeTaken();
    const averageTime = calculateAverageTime(timesTaken, timeTaken);
    accuracy = (score / (won + lost)) * 100;
    updateDisplay(scores, averageTime);
    document.getElementById("finalScore").textContent = averageTime;
    document.getElementById("accuracy").textContent = accuracy.toFixed(2);
    document.getElementById("gameOver").style.display = "flex";
}

function startTimer(timerElement) {
    timerInterval = setInterval(() => updateTimer(timerElement), 50);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer(timerElement) {
    timeInMilliseconds -= 50;
    if (timeInMilliseconds < 0) {
        handleGameOver(timerElement);
    } else {
        updateTimerDisplay(timerElement);
    }
}

function resetGame(timerElement, timeElement, optionElements) {
    stopTimer();
    resetValues(timerElement, timeElement);
    display(optionElements);
    updateScoreDisplay();
    startTimer(timerElement);
}

function initializeColorInputs() {
    colorInputs.forEach(({ id, variable }) => {
        let color = colors.find(color => color.id === id)?.color || getDefaultColor(id);
        setColor(id, variable, color);
        document.getElementById(id).addEventListener("input", function() {
            setColor(id, variable, this.value);
        });
    });
}

function getDefaultColor(id) {
    return defaultColors.find(color => color.id === id).color;
}

function setColor(id, variable, value) {
    document.documentElement.style.setProperty(variable, value);
    let colorToUpdate = colors.find(color => color.id === id);
    if (colorToUpdate) {
        colorToUpdate.color = value;
    } else {
        colors.push({ id, color: value });
    }
    saveList("colorsList", colors);
}

document.addEventListener("DOMContentLoaded", () => {
    const startGameElement = document.getElementById("startGame");
    const timerElement = document.getElementById("timer");
    const timeElement = document.getElementById("time");
    const optionElements = [document.getElementById("option1"), document.getElementById("option2"), document.getElementById("option3")];
    const settingsIcon = document.getElementById("settingsIcon");
    const checkIcon = document.getElementById("checkIcon");
    const settingsContent = document.getElementById("settings");
    const deleteButtons = document.querySelectorAll(".delete");
    const resetButtons = document.querySelectorAll(".fa-rotate-right");

    initializeColorInputs();

    function settingsContentShow() {
        settingsContent.style.display = "flex";
        settingsIcon.removeEventListener("click", settingsContentShow);
        checkIcon.addEventListener("click", settingsContentHide);
    }
    function settingsContentHide() {
        settingsContent.style.display = "none";
        checkIcon.removeEventListener("click", settingsContentHide);
        settingsIcon.addEventListener("click", settingsContentShow);
    }

    startGameElement.addEventListener("click", () => {
        document.getElementById("startPopup").style.display = "none";
        display(optionElements);
        scores = sortScores(scores);
        startTimer(timerElement);
    });

    document.getElementById("retry_button").addEventListener("click", () => {
        resetGame(timerElement, timeElement, optionElements);
    });

    document.getElementById("reset_button").addEventListener("click", () => {
        localStorage.removeItem('scoreList');
        scores = initializeScores()
        scores = sortScores(scores);
        window.alert("Data has been reset");
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            let index = (button.getAttribute("data-index"));
            scores[index] = "N/A";
            scores = sortScores(scores);
        });
    });
    
    document.getElementById("gameOverButton").addEventListener("click", () => {
        document.getElementById("gameOver").style.display = "none";
        resetGame(timerElement, timeElement, optionElements);
    });

    optionElements.forEach(option => {
        option.addEventListener("click", () => {
            handleOptionClick(option.textContent, timeElement, optionElements);
        });
    });
    document.addEventListener("keydown", (event) => handleOptionClick(event.key, timeElement, optionElements));

    document.getElementById("close").addEventListener("click", () => {
        document.getElementById("gameOver").style.display = "none";
    });

    settingsIcon.addEventListener("click", settingsContentShow);
    
    resetButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedColor = button.getAttribute("data-color");
            const variable = colorInputs.find(variable => variable.id === selectedColor).variable;
            const value = defaultColors.find(color => color.id === selectedColor).color;
            setColor(selectedColor, variable, value);
        });
    });
});