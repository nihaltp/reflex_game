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

    function compareRandom() {
        return Math.random() - 0.5;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function display() {
        const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const randomList = list.sort(compareRandom);

        const green = getRandomInt(4, 8);
        const red = getRandomInt(4, 11 - green);

        const greenList = randomList.slice(0, green);
        randomList.splice(0, green);

        const redList = randomList.slice(0, red);
        randomList.splice(0, red);

        const whiteList = randomList;

        greenList.forEach(num => { document.getElementById(num).style.backgroundColor = 'green'; });
        redList.forEach(num => { document.getElementById(num).style.backgroundColor = 'red'; });
        whiteList.forEach(num => { document.getElementById(num).style.backgroundColor = 'white'; });

        let options = [green - 1, green, green + 1];
        do {
            options.sort(compareRandom);
        } while (options[greenPrevious] == green);
        greenPrevious = options.indexOf(green);

        document.getElementById("option1").textContent = options[0];
        document.getElementById("option2").textContent = options[1];
        document.getElementById("option3").textContent = options[2];
        
        startTime = new Date();
        return green;
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
        green = display();
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
        green = display();
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
        green = display();
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
});