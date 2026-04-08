// UI functions
import { gameState } from "./state.js"
import { isTopTen, saveScore, getLeaderboard } from "./leaderboard.js"

export function showGameOver(won) {
    gameState.gameRunning = false
    document.getElementById("game-over-title").textContent = won ? "Congratulations Olivia! You won!" : "Game over!"
    document.getElementById("final-score").textContent = gameState.score

    renderLeaderboard()

    if (isTopTen(gameState.score)) {
        showNameEntry()
    }

    document.getElementById("game-over").style.display = "block"
}

function showNameEntry() {
    const nameEntry = document.getElementById("name-entry")
    const playerName = document.getElementById("player-name")
    const submitBtn = document.getElementById("submit-name")

    nameEntry.style.display = "block"
    playerName.focus()

    const handleSubmit = () => {
        const name = playerName.value.trim() || "AAA"
        saveScore(name, gameState.score)
        renderLeaderboard(name)
        nameEntry.style.display = "none"
        playerName.removeEventListener("keypress", handleEnter)
        submitBtn.removeEventListener("click", handleSubmit)
    }

    const handleEnter = (e) => {
        if (e.key === "Enter") handleSubmit()
    }

    playerName.addEventListener("keypress", handleEnter)
    submitBtn.addEventListener("click", handleSubmit)
}

function renderLeaderboard(justAddedName = null) {
    const board = getLeaderboard()
    const list = document.getElementById("leaderboard-list")
    list.innerHTML = ""

    if (board.length === 0) {
        list.innerHTML = "<li>(no scores yet)</li>"
        return
    }

    board.forEach((entry, i) => {
        const li = document.createElement("li")
        li.textContent = `${entry.name} - ${entry.score}`

        if (justAddedName && entry.name === justAddedName) {
            li.classList.add("new-score")
        }

        list.appendChild(li)
    })
}

export function updateUI() {
    document.getElementById("score").textContent = gameState.score
    document.getElementById("level").textContent = gameState.level
    document.getElementById("lives").textContent = gameState.lives
}
