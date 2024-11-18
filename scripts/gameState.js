export const gameState = {
    won: 0,
    lost: 0,
    score: 0,
    greenCount: 0,
    timesTaken: [],
    previousGreenCount: -1,
    previousGreenIndex: -1,

    startTime: 0,
    currentTime: 0,
    timeTaken: 0,
    timeInMilliseconds: 30000,
    timerInterval: 0,
    theme: null,

    reset() {
        this.won = 0;
        this.lost = 0;
        this.score = 0;
        this.timesTaken = [];
        this.timeInMilliseconds = 30000;
    },

    recordStartTime() {
        this.startTime = new Date();
    },

    recordCurrentTime() {
        this.currentTime = new Date();
    },

    recordTimeTaken() {
        if (this.startTime && this.currentTime) {
            this.timeTaken = this.currentTime - this.startTime;
        }
    }
};