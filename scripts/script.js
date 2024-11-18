import { squares, lightDefaultColors, darkDefaultColors, colorInputs } from "./constants.js";
import { gameState } from "./gameState.js";
import { initializeScores, saveList, initializeLightColors, initializeDarkColors, getOrInitializeFromStorage, initializeDOMElements } from "./init.js";
import { calculateAverageTime, getDarkDefaultColor, getGreenCount, getLightDefaultColor, getOptions, getRandomInt, getShuffledList } from "./utils.js";
import { renderSquares, renderOptions, toggleVisibility, setColor, setElementContent } from "./render.js";

let scores = getOrInitializeFromStorage('scoreList', initializeScores);
const lightColors = getOrInitializeFromStorage('lightColorsList', initializeLightColors);
const darkColors = getOrInitializeFromStorage('darkColorsList', initializeDarkColors);

function getList(randomList) {
    const redCount = getRandomInt(4, 11 - gameState.greenCount);
    const greenList = randomList.slice(0, gameState.greenCount);
    randomList.splice(0, gameState.greenCount);
    const redList = randomList.slice(0, redCount);
    randomList.splice(0, redCount);
    const whiteList = randomList;
    return { greenList, redList, whiteList };
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
        const top = document.querySelector(`#top_${i + 1} .score-text`);
        setElementContent(top, scoreText);
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
        sortScores();
    }
}

function updateScoreDisplay() {
    gameState.score = gameState.won - gameState.lost;
    const won = document.getElementById("won");
    const lost = document.getElementById("lost");
    const score = document.getElementById("score");
    setElementContent(won, gameState.won);
    setElementContent(lost, gameState.lost);
    setElementContent(score, gameState.score);
}

function updateTimerDisplay(timerElement) {
    const seconds = Math.floor(gameState.timeInMilliseconds / 1000);
    const milliseconds = Math.floor((gameState.timeInMilliseconds % 1000) / 10);
    const formattedTime = `${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;
    setElementContent(timerElement, formattedTime);
}

function resetValues(timerElement, timeElement) {
    gameState.reset();
    setElementContent(timeElement, "0ms");
    updateTimerDisplay(timerElement);
    updateScoreDisplay();
}

function handleCorrectOption(timeTaken, timeElement) {
    gameState.won++;
    gameState.timesTaken.push(timeTaken);
    setElementContent(timeElement, `${Math.floor(timeTaken)} ms`);
}

function handleIncorrectOption(timeTaken, timeElement) {
    gameState.lost++;
    gameState.timesTaken.push(timeTaken + 1000);
    setElementContent(timeElement, `${Math.floor(timeTaken)} ms + 1000`);
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
    setElementContent(timerElement, "00:00");
    gameState.recordCurrentTime();
    gameState.recordTimeTaken();
    const averageTime = calculateAverageTime(gameState.timesTaken, gameState.timeTaken);
    const accuracy = (gameState.score / (gameState.won + gameState.lost)) * 100;
    updateDisplay(averageTime);
    const finalScore = document.getElementById("finalScore");
    setElementContent(finalScore, averageTime);
    const accuracyElement = document.getElementById("accuracy");
    setElementContent(accuracyElement, accuracy);
    const gameOver = document.getElementById("gameOver")
    toggleVisibility(gameOver, true);
}

function updateTimer(timerElement) {
    gameState.timeInMilliseconds -= 50;
    if (gameState.timeInMilliseconds <= 0) {
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
    const elements = initializeDOMElements()
    
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        gameState.theme = "dark";
    } else {
        gameState.theme = "light";
    }
    
    initializeColorInputs(gameState.theme);
    
    function settingsContentShow() {
        toggleVisibility(elements.settingsContent, true);
        elements.settingsIcon.removeEventListener("click", settingsContentShow);
        elements.settingsIcon.removeEventListener("keydown", handleSettingsEvent);
        elements.checkIcon.addEventListener("click", settingsContentHide);
    }
    function settingsContentHide() {
        toggleVisibility(elements.settingsContent, false);
        elements.checkIcon.removeEventListener("click", settingsContentHide);
        elements.settingsIcon.addEventListener("click", settingsContentShow);
        elements.settingsIcon.addEventListener("keydown", handleSettingsEvent);
    }
    
    function handleSettingsEvent(event) {
        if (event.type === "click" || (event.type === "keydown" && event.key === "Enter")) {
            settingsContentShow();
        }
    }
    
    elements.startGameElement.addEventListener("click", () => {
        const startPopup = document.getElementById("startPopup");
        toggleVisibility(startPopup, false);
        display(elements.optionElements);
        sortScores();
        startTimer(elements.timerElement);
    });
    
    document.getElementById("retry_button").addEventListener("click", () => {
        resetGame(elements.timerElement, elements.timeElement, elements.optionElements);
    });
    
    document.getElementById("reset_button").addEventListener("click", () => {
        localStorage.removeItem('scoreList');
        scores = initializeScores();
        sortScores();
        window.alert("Data has been reset"); // TODO: Change this with Toaster
    });
    
    elements.deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = (button.getAttribute("data-index"));
            scores[index] = "N/A";
            sortScores();
        });
    });
    
    document.getElementById("gameOverButton").addEventListener("click", () => {
        toggleVisibility(elements.gameOver, false);
        resetGame(elements.timerElement, elements.timeElement, elements.optionElements);
    });
    
    elements.optionElements.forEach(option => {
        option.addEventListener("click", () => {
            handleOptionClick(option.textContent, elements.timeElement, elements.optionElements);
        });
    });
    document.addEventListener("keydown", (event) => handleOptionClick(event.key, elements.timeElement, elements.optionElements));
    
    document.getElementById("close").addEventListener("click", () => {
        toggleVisibility(elements.gameOver, false);
    });
    
    elements.changeTheme.addEventListener("click", () => {
        if (gameState.theme === "light") {
            gameState.theme = "dark";
        } else {
            gameState.theme = "light";
        }
        initializeColorInputs(gameState.theme);
    });
    
    elements.settingsIcon.addEventListener("click", settingsContentShow);
    elements.settingsIcon.addEventListener("keydown", handleSettingsEvent);
    
    elements.resetButtons.forEach(button => {
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
    
    elements.resetAll.addEventListener("click", () => {
        let colors;
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