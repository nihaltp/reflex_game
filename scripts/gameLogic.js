import { squares } from "./constants.js";
import { gameState } from "./gameState.js";
import { scores, saveList } from "./init.js";
import { renderSquares, renderOptions, setElementContent, toggleVisibility } from "./render.js";
import { getRandomInt, shuffleList, getGreenCount, getOptions, calculateAverageTime } from "./utils.js";

function getList() {
    let randomList = [...squares];
    const redCount = getRandomInt(4, 11 - gameState.greenCount);
    const greenList = randomList.slice(0, gameState.greenCount);
    randomList.splice(0, gameState.greenCount);
    const redList = randomList.slice(0, redCount);
    randomList.splice(0, redCount);
    const whiteList = randomList;
    return { greenList, redList, whiteList };
}

function updateScores() {
    for (let i = 0; i < 5; i++) {
        const scoreText = scores[i];
        const top = document.querySelector(`#top_${i + 1} .score-text`);
        setElementContent(top, scoreText);
    }
}

export function sortScores() {
    const validScores = scores.filter(score => !isNaN(score));
    validScores.sort((a, b) => a - b);
    /* Variables imported can only be read
    So we have to modify instead of reassigning */
    
    // Clear the variable
    scores.length = 0;
    // Modify the variable
    scores.push(...validScores.slice(0, 5));
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

export function display(optionElements) {
    shuffleList();
    getGreenCount();
    const { greenList, redList, whiteList } = getList();
    const options = getOptions();
    renderSquares(greenList, redList, whiteList);
    renderOptions(options, optionElements);
    gameState.recordStartTime();
}

export function handleOptionClick(optionText, timeElement, optionElements) {
    if (!(optionText >= '0' && optionText <= '9')) {
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

function handleAverageTime() {
    const averageTime = calculateAverageTime(gameState.timesTaken, gameState.timeTaken);
    updateDisplay(averageTime);
    const finalScore = document.getElementById("finalScore");
    setElementContent(finalScore, averageTime);
}

function handleAccuracy() {
    const accuracy = (gameState.score / (gameState.won + gameState.lost)) * 100;
    const accuracyElement = document.getElementById("accuracy");
    setElementContent(accuracyElement, accuracy);
}

function handleGameOverElement() {
    const gameOver = document.getElementById("gameOver");
    toggleVisibility(gameOver, true);
}

function handleGameOver(timerElement) {
    stopTimer();
    setElementContent(timerElement, "00:00");
    gameState.recordCurrentTime();
    gameState.recordTimeTaken();
    handleAverageTime();
    handleAccuracy();
    handleGameOverElement();
}

function updateTimer(timerElement) {
    gameState.timeInMilliseconds -= 50;
    if (gameState.timeInMilliseconds <= 0) {
        handleGameOver(timerElement);
    } else {
        updateTimerDisplay(timerElement);
    }
}

export function startTimer(timerElement) {
    gameState.timerInterval = setInterval(() => updateTimer(timerElement), 50);
}

export function resetGame(timerElement, timeElement, optionElements) {
    stopTimer();
    resetValues(timerElement, timeElement);
    display(optionElements);
    updateScoreDisplay();
    startTimer(timerElement);
}
