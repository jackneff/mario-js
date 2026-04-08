// Game state (mutable, exported by reference)
export const gameState = {
    score: 0,
    level: 1,
    lives: 3,
    gameRunning: true,
    keys: {},
    luigiMode: false
}

// Player object - element is lazy-loaded to avoid null access at module init
export const player = {
    element: null,
    x: 50,
    y: 340,
    width: 20,
    height: 20,
    velocityX: 0,
    velocityY: 0,
    grounded: false,
    big: false,
    invincible: false,
    invincibilityTimer: 0,
    enteringPipe: false,
    getElement() {
        if (!this.element) {
            this.element = document.getElementById("mario")
        }
        return this.element
    }
}

// Cached DOM references
export const elements = {
    mario: null,
    gameArea: null,
    coinsLayer: null,
    enemiesLayer: null,
    scoreEl: null,
    levelEl: null,
    livesEl: null,
    gameOver: null,
    restartButton: null,
    nameEntry: null,
    playerName: null,
    gameOverTitle: null,
    finalScore: null,
    submitName: null,
    leaderboardList: null,
    init() {
        this.mario = document.getElementById("mario")
        this.gameArea = document.getElementById("game-area")
        this.coinsLayer = document.getElementById("coins-layer")
        this.enemiesLayer = document.getElementById("enemies-layer")
        this.scoreEl = document.getElementById("score")
        this.levelEl = document.getElementById("level")
        this.livesEl = document.getElementById("lives")
        this.gameOver = document.getElementById("game-over")
        this.restartButton = document.getElementById("restart-button")
        this.nameEntry = document.getElementById("name-entry")
        this.playerName = document.getElementById("player-name")
        this.gameOverTitle = document.getElementById("game-over-title")
        this.finalScore = document.getElementById("final-score")
        this.submitName = document.getElementById("submit-name")
        this.leaderboardList = document.getElementById("leaderboard-list")
    }
}

// Game objects arrays
export const gameObjects = {
    platforms: [],
    enemies: [],
    coins: [],
    surpriseBlocks: [],
    pipes: [],
    mushrooms: [],
    powerStars: []
}
