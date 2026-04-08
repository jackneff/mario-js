// Input handling
import { gameState } from "./state.js"

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"]
let konamiIndex = 0

function showInfinivesLivesToast() {
    const toast = document.createElement("div")
    toast.id = "konami-toast"
    toast.textContent = "∞ LIVES!"
    document.querySelector(".game-container").appendChild(toast)
    setTimeout(() => toast.remove(), 2500)
}

export function setupInput() {
    document.addEventListener("keydown", (e) => {
        gameState.keys[e.code] = true

        if (e.code === "Space") {
            e.preventDefault()
        }

        // Konami code tracker
        if (e.code === KONAMI[konamiIndex]) {
            konamiIndex++
            if (konamiIndex === KONAMI.length) {
                konamiIndex = 0
                gameState.lives = Infinity
                showInfinivesLivesToast()
            }
        } else {
            konamiIndex = e.code === KONAMI[0] ? 1 : 0
        }
    })

    document.addEventListener("keyup", (e) => {
        gameState.keys[e.code] = false
    })
}
