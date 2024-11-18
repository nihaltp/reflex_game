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
export function renderSquares(greenList, redList, whiteList) {
    renderDisplay(greenList, "green");
    renderDisplay(redList, "red");
    renderDisplay(whiteList, "white");
}

export function renderOptions(options, optionElements) {
    options.forEach((option, index) => {
        optionElements[index].textContent = option;
    });
}

export function setColor(variable, value) {
    document.documentElement.style.setProperty(variable, value);
}

export function setElementContent(element, content) {
    element.textContent = content;
}

export function toggleVisibility(element, isVisible) {
    element.style.display = isVisible ? "flex" : "none";
}
