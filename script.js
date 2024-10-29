document.addEventListener("DOMContentLoaded", () => {
    let scores = localStorage.getItem('scoreList');
    if (scores !== null) {
        scores = JSON.parse(scores);
    } else {
        scores = ["N/A", "N/A", "N/A", "N/A", "N/A"];
    }
    let startTime;
    let timeInMilliseconds = 30000
    let timerInterval;
    let won = 0;
    let lost = 0;
    let score = 0;
    let green;
    let timesTaken = [];
    let greenPrevious = -1;
    let greenIndexPrevious = -1;

    function compareRandom() {
        return Math.random() - 0.5;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function display() {
        const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const randomList = list.sort(compareRandom);

        do {
            green = getRandomInt(4, 8);
        } while (greenPrevious == green);
        greenPrevious = green;

        const red = getRandomInt(4, 11 - green);

        const greenList = randomList.slice(0, green);
        randomList.splice(0, green);

        const redList = randomList.slice(0, red);
        randomList.splice(0, red);

        const whiteList = randomList;

        function setColorClass(index, colorClass) {
            const element = document.querySelector(`[data-index="${index}"]`)
            element.classList.remove(...element.classList)
            element.classList.add("square")
            element.classList.add(colorClass)
        }
        
        greenList.forEach(num => { setColorClass(num, "green") });
        redList.forEach(num => { setColorClass(num, "red") });
        whiteList.forEach(num => { setColorClass(num, "white") });

        let options = [green - 1, green, green + 1];
        do {
            options.sort(compareRandom);
        } while (options[greenIndexPrevious] == green);
        greenIndexPrevious = options.indexOf(green);
        
        document.getElementById("option1").textContent = options[0];
        document.getElementById("option2").textContent = options[1];
        document.getElementById("option3").textContent = options[2];
        
        startTime = new Date();
        return
    }

    function updateScore() {
        document.getElementById("won").textContent = won;
        document.getElementById("lost").textContent = lost;
        
        score = won - lost;
        document.getElementById("score").textContent = score;
    }

    function updateDisplay(currentScore = "N/A") {
        if (!isNaN(currentScore)) {
            scores.push(currentScore);
        }
        scores = scores.filter(score => !isNaN(score)).sort((a, b) => a - b);

        if (scores.length > 5) {
            scores.splice(5);
        }

        localStorage.setItem('scoreList', JSON.stringify(scores));
        document.querySelector("#top_1 .score-text").textContent = scores[0];
        document.querySelector("#top_2 .score-text").textContent = scores[1];
        document.querySelector("#top_3 .score-text").textContent = scores[2];
        document.querySelector("#top_4 .score-text").textContent = scores[3];
        document.querySelector("#top_5 .score-text").textContent = scores[4];
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeInMilliseconds -= 10;
            if (timeInMilliseconds < 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00:00";
                const averageTime = calculateAverageTime();
                document.getElementById("finalScore").textContent = averageTime;
                accuracy = (score / (won + lost))*100;
                document.getElementById("accuracy").textContent = accuracy.toFixed(2);
                updateDisplay(averageTime);
                document.getElementById("gameOver").style.display = "flex";
            } else {
                const seconds = Math.floor(timeInMilliseconds / 1000).toString().padStart(2, '0');
                const remainingMilliseconds = timeInMilliseconds % 1000;
                const milliseconds = Math.floor(remainingMilliseconds / 10).toString().padStart(2, '0');
                timerElement.textContent = `${seconds}:${milliseconds}`;
            }
        }, 10);
    }

    function resetGame() {
        clearInterval(timerInterval);
        timeInMilliseconds = 30000;
        timerElement.textContent = "30:00";
        won = 0;
        lost = 0;
        timesTaken = [];
        display();
        updateScore();
        startTimer();
    }

    function handleOptionClick(optionText) {
        if (!(optionText>='0' && optionText<='9')) {
            return
        }
        const currentTime = new Date();
        const timeTaken = currentTime - startTime;
        
        if (parseInt(optionText) === green) {
            won++;
            timesTaken.push(timeTaken);
        } else {
            lost++;
            timesTaken.push(timeTaken+1000);
        }
        document.getElementById("time").textContent = `${Math.floor(timeTaken)} ms`;
        display();
        updateScore();
    }

    function calculateAverageTime() {
        if (timesTaken.length === 0) return "N/A";
        const total = timesTaken.reduce((acc, time) => acc + time, 0);
        const average = total / timesTaken.length;
        return Math.floor(average)
    }

    const timerElement = document.getElementById("timer");

    document.getElementById("startGame").addEventListener("click", () => {
        document.getElementById("startPopup").style.display = "none";
        display();
        updateDisplay();
        startTimer();
    });

    document.getElementById("retry_button").addEventListener("click", () => { resetGame(); });

    document.getElementById("reset_button").addEventListener("click", () => {
        localStorage.removeItem('scoreList');
        scores = ["N/A", "N/A", "N/A", "N/A", "N/A"];
        updateDisplay();
        window.alert("Data has been reset");
    });

    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            scores[index] = "N/A";
            updateDisplay();
        });
    });
    
    document.getElementById("gameOverButton").addEventListener("click", () => {
        document.getElementById("gameOver").style.display = "none";
        resetGame();
    });

    document.getElementById("option1").addEventListener("click", () => {
        handleOptionClick(document.getElementById("option1").textContent);
    });
    document.getElementById("option2").addEventListener("click", () => {
        handleOptionClick(document.getElementById("option2").textContent);
    });
    document.getElementById("option3").addEventListener("click", () => {
        handleOptionClick(document.getElementById("option3").textContent);
    });
    document.addEventListener("keydown", (event) => handleOptionClick(event.key));

    document.getElementById("close").addEventListener("click", () => {
        document.getElementById("gameOver").style.display = "none";
    });

    const settingsIcon = document.getElementById("settingsIcon");
    const checkIcon = document.getElementById("checkIcon");
    const settingsContent = document.getElementById("settings");

    settingsIcon.addEventListener("click", settingsContentShow);

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

    function setColor(id, variable, value) {
        document.documentElement.style.setProperty(variable, value);
        localStorage.setItem(id, value);
    }

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
    ];
    
    colorInputs.forEach(({ id, variable }) => {
        let color = localStorage.getItem(id)
        setColor(id, variable, color);
        document.getElementById(id).addEventListener("input", function() {
            setColor(id, variable, this.value);
        });
    });

    const resetButtons = document.querySelectorAll(".fa-rotate-right");
    resetButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedColor = button.getAttribute("data-color");
            const variableObj = colorInputs.find(variable => variable.id === selectedColor);
            const valueObj = defaultColors.find(color => color.id === selectedColor);
            const variable = variableObj.variable;
            const value = valueObj.color;
            setColor(selectedColor, variable, value);
        });
    });
});