// Entry point
import { gameState, player } from "./state.js"
import { gameLoop, stopGameLoop } from "./loop.js"
import { loadLevel } from "./level.js"
import { setupInput } from "./input.js"
import { GAME_SETTINGS } from "./settings.js"

export function initGame() {
    stopGameLoop()
    loadLevel(gameState.level - 1)
    gameLoop()
}

export function restartGame() {
    // Stop any existing game loop
    stopGameLoop()

    // Mutate gameState instead of reassigning
    Object.assign(gameState, {
        score: 0,
        level: 1,
        lives: 3,
        gameRunning: true,
        keys: {},
        luigiMode: false
    })
    player.big = false
    player.bigTimer = 0
    player.element.classList.remove("big")
    player.element.classList.remove("luigi")
    player.width = 20
    player.height = 20

    document.getElementById("game-over").style.display = "none"
    document.getElementById("name-entry").style.display = "none"
    document.getElementById("player-name").value = ""
    initGame()
}

// Setup input listeners
setupInput()

// Restart button handler
document.getElementById("restart-button").addEventListener("click", restartGame)

// Start Game
initGame()
