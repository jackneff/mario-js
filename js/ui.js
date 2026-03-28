// UI functions
import { gameState } from "./state.js"

export function showGameOver(won) {
    gameState.gameRunning = false
    document.getElementById("game-over-title").textContent = won ? "Congratulations Olivia! You won!" : "Game over!"
    document.getElementById("final-score").textContent = gameState.score
    document.getElementById("game-over").style.display = "block"
}

export function updateUI() {
    document.getElementById("score").textContent = gameState.score
    document.getElementById("level").textContent = gameState.level
    document.getElementById("lives").textContent = gameState.lives
}
