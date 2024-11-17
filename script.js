const squares = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,];
const lightDefaultColors = [
    { id: "greenColor", color: "#008000"},
    { id: "redColor", color: "#ff0000"},
    { id: "whiteColor", color: "#ffffff"},
    { id: "wonColor", color: "#008000"},
    { id: "lostColor", color: "#ff0000"},
    { id: "scoreColor", color: "#0000ff"},
    { id: "timerColor", color: "#ff7f50"},
    { id: "boxColor", color: "#ffff00"},
    { id: "optionColor", color: "#deb887"},
    { id: "optionTextColor", color: "#000000"},
    { id: "optionBackgroundColor", color: "#ffffff"},
    { id: "optionHoverColor", color: "#ffa500"},
    { id: "hoverColor", color: "#0b7dda"},
    { id: "primaryColor", color: "#2196F3"},
    { id: "backgroundColor", color: "#ffffff"},
    { id: "secondaryBackgroundColor", color: "#ebebeb"},
    { id: "thirdBackgroundColor", color: "#add8e6"},
    { id: "overlayColor", color: "#00000080"},
    { id: "faColor", color: "#aaa"},
    { id: "whiteText", color: "#ffffff"},
    { id: "redText", color: "#ff0000"},
    { id: "blackText", color: "#000000"},
    { id: "redBackground", color: "#ff0000"},
    { id: "blackBorder", color: "#000000"},
    { id: "iconColor", color: "#555555"},
];
const darkDefaultColors = [
    { id: "greenColor", color: "#00e673" },
    { id: "redColor", color: "#ff4d4d" },
    { id: "whiteColor", color: "#f5f5f5" },
    { id: "wonColor", color: "#00e673" },
    { id: "lostColor", color: "#ff4d4d" },
    { id: "scoreColor", color: "#66b3ff" },
    { id: "timerColor", color: "#ffa366" },
    { id: "boxColor", color: "#ffff99" },
    { id: "optionColor", color: "#b8860b" },
    { id: "optionTextColor", color: "#ffffff" },
    { id: "optionBackgroundColor", color: "#333333" },
    { id: "optionHoverColor", color: "#ffcc80" },
    { id: "hoverColor", color: "#5fa6e2" },
    { id: "primaryColor", color: "#4da6ff" },
    { id: "backgroundColor", color: "#2a2a2a" },
    { id: "secondaryBackgroundColor", color: "#3a3a3a" },
    { id: "thirdBackgroundColor", color: "#4b6070" },
    { id: "overlayColor", color: "#00000080" },
    { id: "faColor", color: "#cccccc" },
    { id: "whiteText", color: "#ffffff" },
    { id: "redText", color: "#ff6666" },
    { id: "blackText", color: "#ffffff" },
    { id: "redBackground", color: "#e60000" },
    { id: "blackBorder", color: "#666666" },
    { id: "iconColor", color: "#dddddd"},
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
    { id: "hoverColor", variable: "--hover-color"},
    { id: "primaryColor", variable: "--primary-color"},
    { id: "backgroundColor", variable: "--background-color"},
    { id: "secondaryBackgroundColor", variable: "--secondary-background-color"},
    { id: "thirdBackgroundColor", variable: "--third-background-color" },
    { id: "overlayColor", variable: "--overlay-color"},
    { id: "faColor", variable: "--fa-color"},
    { id: "whiteText", variable: "--white-text"},
    { id: "redText", variable: "--red-text"},
    { id: "blackText", variable: "--black-text"},
    { id: "redBackground", variable: "--red-background"},
    { id: "blackBorder", variable: "--black-border"},
    { id: "iconColor", variable: "--icon-color"},
];
const gameState = {
    won: 0,
    lost: 0,
    score: 0,
    greenCount: 0,
    timesTaken: [],
    previousGreenCount: -1,
    previousGreenIndex: -1,
    
    startTime: 0,
    currentTime: 0,
    timeTaken: 0,
    timeInMilliseconds: 30000,
    timerInterval: 0,
    theme: null,
    
    reset() {
        this.won = 0;
        this.lost = 0;
        this.score = 0;
        this.timesTaken = [];
        this.timeInMilliseconds = 30000;
    },
    
    recordStartTime() {
        this.startTime = new Date();
    },
    
    recordCurrentTime() {
        this.currentTime = new Date();
    },
    
    recordTimeTaken() {
        if (this.startTime && this.currentTime) {
            this.timeTaken =  this.currentTime - this.startTime;
        }
    }
};

function initializeScores() {
    return ["N/A", "N/A", "N/A", "N/A", "N/A"];
}

function saveList(name, list) {
    localStorage.setItem(name, JSON.stringify(list));
}

function initializeLightColors() {
    saveList("lightColorsList", lightDefaultColors);
    return lightDefaultColors;
}

function initializeDarkColors() {
    saveList("darkColorsList", darkDefaultColors);
    return darkDefaultColors;
}

function getOrInitializeFromStorage(key, initializer) {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    // Initialize and save default value
    const defaultValue = initializer();
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
}

let scores = getOrInitializeFromStorage('scoreList', initializeScores);
const lightColors = getOrInitializeFromStorage('lightColorsList', initializeLightColors);
const darkColors = getOrInitializeFromStorage('darkColorsList', initializeDarkColors);

function compareRandom() {
    return Math.random() - 0.5;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getShuffledList(shuffleList) {
    return [...shuffleList].sort(compareRandom);
}

function calculateAverageTime(timeList, timeLeft) {
    if (timeList.length === 0) {
        return "N/A";
    }
    const total = timeList.reduce((acc, time) => acc + time, 0);
    const average = (total / timeList.length) + (timeLeft / timeList.length);
    return Math.floor(average);
}

function getGreenCount() {
    do {
        gameState.greenCount = getRandomInt(4, 8);
    } while (gameState.previousGreenCount === gameState.greenCount);
    gameState.previousGreenCount = gameState.greenCount;
}

function getList(randomList) {
    const redCount = getRandomInt(4, 11 - gameState.greenCount);
    const greenList = randomList.slice(0, gameState.greenCount);
    randomList.splice(0, gameState.greenCount);
    const redList = randomList.slice(0, redCount);
    randomList.splice(0, redCount);
    const whiteList = randomList;
    return { greenList, redList, whiteList };
}

function getOptions() {
    const options = [gameState.greenCount - 1, gameState.greenCount, gameState.greenCount + 1];
    do {
        options.sort(compareRandom);
    } while (options[gameState.previousGreenIndex] === gameState.greenCount);
    gameState.previousGreenIndex = options.indexOf(gameState.greenCount);
    return options;
}

function setColorClass(index, ...colorClasses) {
    const element = document.querySelector(`[data-index="${index}"]`);
    element.classList.remove(...element.classList);
    element.classList.add(...colorClasses);
}

function renderDisplay(colorsList, color) {
    colorsList.forEach(num => {
        setColorClass(num, "square", color);
    });
}

function renderSquares(greenList, redList, whiteList) {
    renderDisplay(greenList, "green");
    renderDisplay(redList, "red");
    renderDisplay(whiteList, "white");
}

function renderOptions(options, optionElements) {
    options.forEach((option, index) => {
        optionElements[index].textContent = option;
    });
}

function display(optionElements) {
    const randomList = getShuffledList(squares);
    getGreenCount();
    const { greenList, redList, whiteList } = getList(randomList);
    const options = getOptions();
    renderSquares(greenList, redList, whiteList);
    renderOptions(options, optionElements);
    gameState.recordStartTime();
}

function updateScores() {
    for (let i = 0; i < 5; i++) {
        const scoreText = scores[i];
        document.querySelector(`#top_${i + 1} .score-text`).textContent = scoreText;
    }
}

function sortScores() {
    const validScores = scores.filter(score => !isNaN(score));
    validScores.sort((a, b) => a - b);
    scores = validScores.slice(0, 5);
    saveList('scoreList', scores);
    updateScores();
}

function updateDisplay(currentScore) {
    if (!isNaN(currentScore)) {
        scores.push(currentScore);
        scores = sortScores();
    }
}

function updateScoreDisplay() {
    document.getElementById("won").textContent = gameState.won;
    document.getElementById("lost").textContent = gameState.lost;
    
    gameState.score = gameState.won - gameState.lost;
    document.getElementById("score").textContent = gameState.score;
}

function updateTimerDisplay(timerElement) {
    const seconds = Math.floor(gameState.timeInMilliseconds / 1000);
    const milliseconds = Math.floor((gameState.timeInMilliseconds % 1000) / 10);
    const formattedTime = `${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;
    timerElement.textContent = formattedTime;
}

function resetValues(timerElement, timeElement) {
    gameState.reset();
    timeElement.textContent = "0ms";
    updateTimerDisplay(timerElement);
    updateScoreDisplay();
}

function handleCorrectOption(timeTaken, timeElement) {
    gameState.won++;
    gameState.timesTaken.push(timeTaken);
    timeElement.textContent = `${Math.floor(timeTaken)} ms`;
}

function handleIncorrectOption(timeTaken, timeElement) {
    gameState.lost++;
    gameState.timesTaken.push(timeTaken + 1000);
    timeElement.textContent = `${Math.floor(timeTaken)} ms + 1000`;
}

function handleOptionClick(optionText, timeElement, optionElements) {
    if (!(optionText>='0' && optionText<='9')) {
        return;
    }
    gameState.recordCurrentTime();
    gameState.recordTimeTaken();
    
    if (parseInt(optionText, 10) === gameState.greenCount) {
        handleCorrectOption(gameState.timeTaken, timeElement);
    } else {
        handleIncorrectOption(gameState.timeTaken, timeElement);
    }
    display(optionElements);
    updateScoreDisplay();
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

function handleGameOver(timerElement) {
    stopTimer();
    timerElement.textContent = "00:00";
    gameState.recordCurrentTime();
    gameState.recordTimeTaken();
    const averageTime = calculateAverageTime(gameState.timesTaken, gameState.timeTaken);
    const accuracy = (gameState.score / (gameState.won + gameState.lost)) * 100;
    updateDisplay(averageTime);
    document.getElementById("finalScore").textContent = averageTime;
    document.getElementById("accuracy").textContent = accuracy.toFixed(2);
    document.getElementById("gameOver").style.display = "flex";
}

function updateTimer(timerElement) {
    gameState.timeInMilliseconds -= 50;
    if (gameState.timeInMilliseconds < 0) {
        handleGameOver(timerElement);
    } else {
        updateTimerDisplay(timerElement);
    }
}

function startTimer(timerElement) {
    gameState.timerInterval = setInterval(() => updateTimer(timerElement), 50);
}

function resetGame(timerElement, timeElement, optionElements) {
    stopTimer();
    resetValues(timerElement, timeElement);
    display(optionElements);
    updateScoreDisplay();
    startTimer(timerElement);
}

function getLightDefaultColor(id) {
    return lightDefaultColors.find(color => color.id === id).color;
}

function getDarkDefaultColor(id) {
    return darkDefaultColors.find(color => color.id === id).color;
}

function setColor(variable, value) {
    document.documentElement.style.setProperty(variable, value)
}

function saveColor(id, value, newTheme) {
    let colors, colorsList;
    if (newTheme === "light") {
        colors = lightColors;
        colorsList = "lightColorsList";
    } else {
        colors = darkColors;
        colorsList = "darkColorsList";
    }
    const colorToUpdate = colors.find(color => color.id === id);
    if (colorToUpdate) {
        colorToUpdate.color = value;
    } else {
        colors.push({ id, color: value });
    }
    saveList(colorsList, colors);
}

function initializeColorInputs(oldTheme) {
    let colors, getDefaultColor;
    if (oldTheme === "light") {
        colors = lightColors;
        getDefaultColor = getLightDefaultColor;
    } else {
        colors = darkColors;
        getDefaultColor = getDarkDefaultColor;
    }
    colorInputs.forEach(({ id, variable }) => {
        const value = colors.find(color => color.id === id)?.color || getDefaultColor(id);
        setColor(variable, value);
        saveColor(id, value, oldTheme);
        const element = document.getElementById(id);
        if (element) {
            element.removeEventListener("input", element.handleInput);
            element.handleInput = function () {
                setColor(variable, this.value);
                saveColor(id, this.value, gameState.theme);
            };
            element.addEventListener("input", element.handleInput);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const startGameElement = document.getElementById("startGame");
    const timerElement = document.getElementById("timer");
    const timeElement = document.getElementById("time");
    const optionElements = [document.getElementById("option1"), document.getElementById("option2"), document.getElementById("option3")];
    const changeTheme = document.getElementById("changeTheme");
    const settingsIcon = document.getElementById("settingsIcon");
    const checkIcon = document.getElementById("checkIcon");
    const settingsContent = document.getElementById("settings");
    const deleteButtons = document.querySelectorAll(".delete");
    const resetButtons = document.querySelectorAll(".fa-rotate-right");
    const resetAll = document.getElementById("resetAll");
    
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        gameState.theme = "dark";
    } else {
        gameState.theme = "light";
    }
    
    initializeColorInputs(gameState.theme);
    
    function settingsContentShow() {
        settingsContent.style.display = "flex";
        settingsIcon.removeEventListener("click", settingsContentShow);
        settingsIcon.removeEventListener("keydown", handleSettingsEvent);
        checkIcon.addEventListener("click", settingsContentHide);
    }
    function settingsContentHide() {
        settingsContent.style.display = "none";
        checkIcon.removeEventListener("click", settingsContentHide);
        settingsIcon.addEventListener("click", settingsContentShow);
        settingsIcon.addEventListener("keydown", handleSettingsEvent);
    }
    
    function handleSettingsEvent(event) {
        if (event.type === "click" || (event.type === "keydown" && event.key === "Enter")) {
            settingsContentShow();
        }
    }
    
    startGameElement.addEventListener("click", () => {
        document.getElementById("startPopup").style.display = "none";
        display(optionElements);
        scores = sortScores();
        startTimer(timerElement);
    });
    
    document.getElementById("retry_button").addEventListener("click", () => {
        resetGame(timerElement, timeElement, optionElements);
    });
    
    document.getElementById("reset_button").addEventListener("click", () => {
        localStorage.removeItem('scoreList');
        scores = initializeScores();
        scores = sortScores();
        window.alert("Data has been reset"); // TODO: Change this with Toaster
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = (button.getAttribute("data-index"));
            scores[index] = "N/A";
            scores = sortScores();
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
    
    changeTheme.addEventListener("click", () => {
        if (gameState.theme === "light") {
            gameState.theme = "dark";
        } else {
            gameState.theme = "light";
        }
        initializeColorInputs(gameState.theme);
    });
    
    settingsIcon.addEventListener("click", settingsContentShow);
    settingsIcon.addEventListener("keydown", handleSettingsEvent);
    
    resetButtons.forEach(button => {
        button.addEventListener("click", () => {
            let colors;
            if (gameState.theme === "light") {
                colors = lightDefaultColors;
            } else {
                colors = darkDefaultColors;
            }
            const selectedColor = button.getAttribute("data-color");
            const variable = colorInputs.find(variable => variable.id === selectedColor).variable;
            const value = colors.find(color => color.id === selectedColor).color;
            setColor(variable, value);
            saveColor(selectedColor, value, gameState.theme);
        });
    });
    
    resetAll.addEventListener("click", () => {
        if (gameState.theme === "light") {
            colors = lightDefaultColors;
        } else {
            colors = darkDefaultColors;
        }
        colors.forEach(({ id, color }) => {
            const variable = colorInputs.find(variable => variable.id === id).variable;
            if (variable) {
                setColor(variable, color);
                saveColor(id, color, gameState.theme);
            }
        });
        settingsContentHide();
    });
});