// Entry point
import { gameState, player } from "./state.js"
import { gameLoop } from "./loop.js"
import { loadLevel } from "./level.js"
import { setupInput } from "./input.js"

export function initGame() {
    loadLevel(gameState.level - 1)
    gameLoop()
}

export function restartGame() {
    // Mutate gameState instead of reassigning
    Object.assign(gameState, {
        score: 0,
        level: 1,
        lives: 3,
        gameRunning: true,
        keys: {}
    })
    player.big = false
    player.bigTimer = 0
    player.element.classList.remove("big")
    player.width = 20
    player.height = 20

    document.getElementById("game-over").style.display = "none"
    initGame()
}

// Setup input listeners
setupInput()

// Restart button handler
document.getElementById("restart-button").addEventListener("click", restartGame)

// Start Game
initGame()
