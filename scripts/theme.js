import { lightDefaultColors, darkDefaultColors } from "./constants.js";
import { gameState } from "./gameState.js";
import { darkColors, lightColors, saveList } from "./init.js";
import { getLightDefaultColor, getDarkDefaultColor } from "./utils.js";

function getColorsByTheme(theme) {
    if (theme === "light") {
        return { colors: lightColors, colorsList: "lightColorsList" };
    }
    return { colors: darkColors, colorsList: "darkColorsList" };
}

function updateColor(colors, id, value) {
    const colorToUpdate = colors.find(color => color.id === id);
    if (colorToUpdate) {
        colorToUpdate.color = value;
        return;
    }
    colors.push({ id, color: value });
}

export function saveColor(id, value, newTheme) {
    const { colors, colorsList } = getColorsByTheme(newTheme);
    updateColor(colors, id, value);
    saveList(colorsList, colors);
}

export function getThemeSettings(theme) {
    if (theme === "light") {
        return { colors: lightColors, getDefaultColor: getLightDefaultColor };
    }
    return { colors: darkColors, getDefaultColor: getDarkDefaultColor };
}

export function getColorValue(colors, id, getDefaultColor) {
    return colors.find(color => color.id === id)?.color || getDefaultColor(id);
}

export function setInitialTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        gameState.theme = "dark";
    } else {
        gameState.theme = "light";
    }
}

export function getColors() {
    if (gameState.theme === "light") {
        return lightDefaultColors;
    }
    return darkDefaultColors;
}
