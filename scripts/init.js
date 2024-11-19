import { lightDefaultColors, darkDefaultColors } from "./constants.js";

export function initializeScores() {
    return ["N/A", "N/A", "N/A", "N/A", "N/A"];
}

export function saveList(name, list) {
    localStorage.setItem(name, JSON.stringify(list));
}

export function initializeLightColors() {
    saveList("lightColorsList", lightDefaultColors);
    return lightDefaultColors;
}

export function initializeDarkColors() {
    saveList("darkColorsList", darkDefaultColors);
    return darkDefaultColors;
}

export function getOrInitializeFromStorage(key, initializer) {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    const defaultValue = initializer();
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
}

export function initializeDOMElements() {
    return {
        startGameElement: document.getElementById("startGame"),
        timerElement : document.getElementById("timer"),
        timeElement : document.getElementById("time"),
        optionElements : [document.getElementById("option1"), document.getElementById("option2"), document.getElementById("option3")],
        changeTheme : document.getElementById("changeTheme"),
        settingsIcon : document.getElementById("settingsIcon"),
        checkIcon : document.getElementById("checkIcon"),
        settingsContent : document.getElementById("settings"),
        deleteButtons : document.querySelectorAll(".delete"),
        resetButtons : document.querySelectorAll(".fa-rotate-right"),
        resetAll : document.getElementById("resetAll"),
        gameOver : document.getElementById("gameOver"),
    }
}

export let scores = getOrInitializeFromStorage('scoreList', initializeScores);
export const lightColors = getOrInitializeFromStorage('lightColorsList', initializeLightColors);
export const darkColors = getOrInitializeFromStorage('darkColorsList', initializeDarkColors);
