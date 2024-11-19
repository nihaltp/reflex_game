import { gameState } from "./gameState.js";
import { initializeDOMElements } from "./init.js";
import { setInitialTheme } from "./theme.js";
import { initializeColorInputs, setupEventListeners } from "./listeners.js";

document.addEventListener("DOMContentLoaded", () => {
    const elements = initializeDOMElements()
    setInitialTheme();
    initializeColorInputs(gameState.theme);
    setupEventListeners(elements);
});