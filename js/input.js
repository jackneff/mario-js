// Input handling
import { gameState, player } from "./state.js"

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"]
let konamiIndex = 0

function showInfinivesLivesToast() {
    const toast = document.createElement("div")
    toast.id = "konami-toast"
    toast.textContent = "∞ LIVES!"
    document.querySelector(".game-container").appendChild(toast)
    setTimeout(() => toast.remove(), 2500)
}

function showLuigiToast() {
    const toast = document.createElement("div")
    toast.id = "konami-toast"
    toast.textContent = "LUIGI MODE!"
    document.querySelector(".game-container").appendChild(toast)
    setTimeout(() => toast.remove(), 2500)
}

export function setupInput() {
    document.addEventListener("keydown", (e) => {
        gameState.keys[e.code] = true

        if (e.code === "Space") {
            e.preventDefault()
        }

        // Shift+L for Luigi mode
        if (e.shiftKey && e.code === "KeyL") {
            gameState.luigiMode = !gameState.luigiMode
            const mario = document.getElementById("mario")
            if (gameState.luigiMode) {
                mario.classList.add("luigi")
                if (!player.big) {
                    player.width = 16
                    player.height = 24
                }
                showLuigiToast()
            } else {
                mario.classList.remove("luigi")
                if (!player.big) {
                    player.width = 20
                    player.height = 20
                }
            }
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
