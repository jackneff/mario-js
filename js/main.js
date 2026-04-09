// Entry point
import { gameState, player, elements } from "./state.js"
import { gameLoop, stopGameLoop, resetIdleState } from "./loop.js"
import { loadLevel } from "./level.js"
import { setupInput } from "./input.js"
import { GAME_SETTINGS, getPlayerDimensions } from "./settings.js"

export function initGame() {
    stopGameLoop()
    loadLevel(gameState.level - 1)
    gameLoop()
}

export function restartGame() {
    stopGameLoop()
    resetIdleState()

    Object.assign(gameState, {
        score: 0,
        level: 1,
        lives: 3,
        gameRunning: true,
        keys: {},
        luigiMode: false
    })

    const dims = getPlayerDimensions(false, false)
    player.big = false
    player.invincible = false
    player.invincibilityTimer = 0
    player.width = dims.width
    player.height = dims.height

    elements.mario.classList.remove("big", "luigi")

    elements.gameOver.style.display = "none"
    elements.nameEntry.style.display = "none"
    elements.playerName.value = ""

    initGame()
}

elements.init()
setupInput()
elements.restartButton.addEventListener("click", restartGame)
initGame()
