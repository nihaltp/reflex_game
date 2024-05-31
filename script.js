document.addEventListener("DOMContentLoaded", () => {
    let scores = localStorage.getItem('scoreList');
    if (scores !== null) {
        scores = JSON.parse(scores);
    } else {
        scores = [0,0,0,0,0];
    }

    function compareRandom() {
        return Math.random() - 0.5;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function display(currentScore) {
        const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,];
        const randomList = list.sort(compareRandom);
    
        const green = getRandomInt(3, 7);
        const red = getRandomInt(3, 11-green);
        const white = 16-green-red
    
        const greenList = randomList.slice(0, green);
        randomList.splice(0, green);
    
        const redList = randomList.slice(0, red);
        randomList.splice(0, red);
    
        const whiteList = randomList;
    
        greenList.forEach(num => {document.getElementById(num).style.backgroundColor = 'green';});
        redList.forEach(num => {document.getElementById(num).style.backgroundColor = 'red';});
        whiteList.forEach(num => {document.getElementById(num).style.backgroundColor = 'white';});
    
        const options = [green, red, white];
        const randomOptions = options.sort(compareRandom)
    
        document.getElementById("option1").textContent = randomOptions[0];
        document.getElementById("option2").textContent = randomOptions[1];
        document.getElementById("option3").textContent = randomOptions[2];
    
        document.getElementById("won").textContent = won;
        document.getElementById("lost").textContent = lost;
    
        score = won - lost;
        document.getElementById("score").textContent = score;
    
        scores.push(currentScore);
        scores.sort((a, b) => b - a);
    
        if (scores.length > 5) {
            scores.splice(5);
        }
    
        localStorage.setItem('scoreList', JSON.stringify(scores));
        document.getElementById("top_1").textContent = scores[0];
        document.getElementById("top_2").textContent = scores[1];
        document.getElementById("top_3").textContent = scores[2];
        document.getElementById("top_4").textContent = scores[3];
        document.getElementById("top_5").textContent = scores[4];

        return green
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeInMilliseconds -= 10;
            if (timeInMilliseconds < 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00:00";
                green = display(score);
                document.getElementById("gameOver").style.display = "block";
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
        green = display(0);
        startTimer();
    }

    function handleOptionClick(optionText) {
        if (parseInt(optionText) === green) {
            won++;
        } else {
            lost++;
        }
        green = display(0);
    }

    const timerElement = document.getElementById("timer");
    let timeInMilliseconds = 30000
    let timerInterval;

    let won = 0;
    let lost = 0;
    let score = 0;

    document.getElementById("startGame").addEventListener("click", () => {
        document.getElementById("startPopup").style.display = "none";
        green = display(0);
        startTimer();
    });

    document.getElementById("retry_button").addEventListener("click", () => {resetGame()});

    document.getElementById("gameOverButton").addEventListener("click", () => {
        document.getElementById("gameOver").style.display = "none";
        resetGame()
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

    document.getElementById("close").addEventListener("click", () => {
        document.getElementById("gameOver").style.display = "none";
    });
});