// Game state (mutable, exported by reference)
export let gameState = {
    score: 0,
    level: 1,
    lives: 3,
    gameRunning: true,
    keys: {}
}

// Player object
export let player = {
    element: document.getElementById("mario"),
    x: 50,
    y: 340,
    width: 20,
    height: 20,
    velocityX: 0,
    velocityY: 0,
    grounded: false,
    big: false,
    bigTimer: 0
}

// Game objects arrays
export let gameObjects = {
    platforms: [],
    enemies: [],
    coins: [],
    surpriseBlocks: [],
    pipes: []
}
