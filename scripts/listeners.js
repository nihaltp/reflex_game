import { colorInputs } from "./constants.js";
import { gameState } from "./gameState.js";
import { initializeScores } from "./init.js";
import { setColor, toggleVisibility } from "./render.js";
import { display, sortScores, startTimer, resetGame, handleOptionClick } from "./gameLogic.js";
import { scores } from "./init.js";
import { saveColor, getThemeSettings, getColorValue, getColors } from "./theme.js";

function setupColorInputListener(element, id, variable) {
    element.removeEventListener("input", element.handleInput);
    element.handleInput = function () {
        setColor(variable, this.value);
        saveColor(id, this.value, gameState.theme);
    };
    element.addEventListener("input", element.handleInput);
}

function initializeColorElement(id, variable) {
    const element = document.getElementById(id);
    if (element) {
        setupColorInputListener(element, id, variable);
    }
}

export function initializeColorInputs(oldTheme) {
    const { colors, getDefaultColor } = getThemeSettings(oldTheme);
    colorInputs.forEach(({ id, variable }) => {
        const value = getColorValue(colors, id, getDefaultColor);
        setColor(variable, value);
        saveColor(id, value, oldTheme);
        initializeColorElement(id, variable);
    });
}

function createSettingsContentShow(elements) {
    return () => settingsContentShow(elements);
}

function createSettingsContentHide(elements) {
    return () => settingsContentHide(elements);
}

function createHandleSettingsEvent(elements) {
    return (event) => handleSettingsEvent(event, elements);
}

function settingsContentShow(elements) {
    toggleVisibility(elements.settingsContent, true);
    elements.settingsIcon.removeEventListener("click", createSettingsContentShow(elements));
    elements.settingsIcon.removeEventListener("keydown", createHandleSettingsEvent(elements));
    elements.checkIcon.addEventListener("click", createSettingsContentHide(elements));
}

function settingsContentHide(elements) {
    toggleVisibility(elements.settingsContent, false);
    elements.checkIcon.removeEventListener("click", createSettingsContentHide(elements));
    elements.settingsIcon.addEventListener("click", createSettingsContentShow(elements));
    elements.settingsIcon.addEventListener("keydown", createHandleSettingsEvent(elements));
}

function handleSettingsEvent(event, elements) {
    if (event.type === "click" || (event.type === "keydown" && event.key === "Enter")) {
        settingsContentShow(elements);
    }
}

function setupSettingsListeners(elements) {
    elements.settingsIcon.addEventListener("click", createSettingsContentShow(elements));
    elements.settingsIcon.addEventListener("keydown", createHandleSettingsEvent(elements));
}

function setupStartGameListeners(elements) {
    elements.startGameElement.addEventListener("click", () => {
        const startPopup = document.getElementById("startPopup");
        toggleVisibility(startPopup, false);
        display(elements.optionElements);
        sortScores();
        startTimer(elements.timerElement);
    });
}

function setupRetryListeners(elements) {
    document.getElementById("retry_button").addEventListener("click", () => {
        resetGame(elements.timerElement, elements.timeElement, elements.optionElements);
    });
}

function setupResetListeners() {
    document.getElementById("reset_button").addEventListener("click", () => {
        localStorage.removeItem('scoreList');
        scores = initializeScores();
        sortScores();
        // TODO: Change with Toasters
        window.alert("Data has been reset");
    });
}

function setupScoreListeners(elements) {
    setupRetryListeners(elements);
    setupResetListeners();
}

function setupDeleteListeners(elements) {
    elements.deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = (button.getAttribute("data-index"));
            scores[index] = "N/A";
            sortScores();
        });
    });
}

function setupGameOverListeners(elements) {
    document.getElementById("gameOverButton").addEventListener("click", () => {
        toggleVisibility(elements.gameOver, false);
        resetGame(elements.timerElement, elements.timeElement, elements.optionElements);
    });
}

function setupOptionListeners(elements) {
    elements.optionElements.forEach(option => {
        option.addEventListener("click", () => {
            handleOptionClick(option.textContent, elements.timeElement, elements.optionElements);
        });
    });
    document.addEventListener("keydown", (event) => handleOptionClick(event.key, elements.timeElement, elements.optionElements));
}

function setupCloseListeners(elements) {
    document.getElementById("close").addEventListener("click", () => {
        toggleVisibility(elements.gameOver, false);
    });
}

function setupChangeThemeListeners(elements) {
    elements.changeTheme.addEventListener("click", () => {
        if (gameState.theme === "light") {
            gameState.theme = "dark";
        } else {
            gameState.theme = "light";
        }
        initializeColorInputs(gameState.theme);
    });
}

function setupIconListeners(elements) {
    setupChangeThemeListeners(elements);
    setupSettingsListeners(elements);
}

function setupResetButtonListeners(elements) {
    elements.resetButtons.forEach(button => {
        button.addEventListener("click", () => {
            const colors = getColors();
            const selectedColor = button.getAttribute("data-color");
            const variable = colorInputs.find(variable => variable.id === selectedColor).variable;
            const value = colors.find(color => color.id === selectedColor).color;
            setColor(variable, value);
            saveColor(selectedColor, value, gameState.theme);
        });
    });
}

function setupResetAllListeners(elements) {
    elements.resetAll.addEventListener("click", () => {
        const colors = getColors();
        colors.forEach(({ id, color }) => {
            const variable = colorInputs.find(variable => variable.id === id).variable;
            if (variable) {
                setColor(variable, color);
                saveColor(id, color, gameState.theme);
            }
        });
        settingsContentHide(elements);
    });
}

function setupSettings(elements) {
    setupResetButtonListeners(elements);
    setupResetAllListeners(elements);
}

export function setupEventListeners(elements) {
    setupStartGameListeners(elements);
    setupScoreListeners(elements);
    setupDeleteListeners(elements);
    setupGameOverListeners(elements);
    setupOptionListeners(elements);
    setupCloseListeners(elements);
    setupIconListeners(elements);
    setupSettings(elements);
}
