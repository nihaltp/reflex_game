import { lightDefaultColors, darkDefaultColors } from "./constants.js";
import { gameState } from "./gameState.js";

export function compareRandom() {
    return Math.random() - 0.5;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getShuffledList(shuffleList) {
    return [...shuffleList].sort(compareRandom);
}

export function calculateAverageTime(timeList, timeLeft = 0) {
    if (timeList.length === 0) {
        return "N/A";
    }
    const total = timeList.reduce((acc, time) => acc + time, 0);
    const average = (total / timeList.length) + (timeLeft / timeList.length);
    return Math.floor(average);
}

export function getLightDefaultColor(id) {
    return lightDefaultColors.find(color => color.id === id).color;
}

export function getDarkDefaultColor(id) {
    return darkDefaultColors.find(color => color.id === id).color;
}

export function getGreenCount() {
    do {
        gameState.greenCount = getRandomInt(4, 8);
    } while (gameState.previousGreenCount === gameState.greenCount);
    gameState.previousGreenCount = gameState.greenCount;
}

export function getOptions() {
    const options = [gameState.greenCount - 1, gameState.greenCount, gameState.greenCount + 1];
    do {
        options.sort(compareRandom);
    } while (options[gameState.previousGreenIndex] === gameState.greenCount);
    gameState.previousGreenIndex = options.indexOf(gameState.greenCount);
    return options;
}