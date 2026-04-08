// Input handling
import { gameState, player, elements } from "./state.js"
import { getPlayerDimensions } from "./settings.js"

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"]
let konamiIndex = 0

function showToast(message, id) {
    const toast = document.createElement("div")
    toast.id = id
    toast.textContent = message
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
            if (gameState.luigiMode) {
                elements.mario.classList.add("luigi")
                if (!player.big) {
                    const dims = getPlayerDimensions(false, true)
                    player.width = dims.width
                    player.height = dims.height
                }
                showToast("LUIGI MODE!", "luigi-toast")
            } else {
                elements.mario.classList.remove("luigi")
                if (!player.big) {
                    const dims = getPlayerDimensions(false, false)
                    player.width = dims.width
                    player.height = dims.height
                }
            }
        }

        // Konami code tracker
        if (e.code === KONAMI[konamiIndex]) {
            konamiIndex++
            if (konamiIndex === KONAMI.length) {
                konamiIndex = 0
                gameState.lives = Infinity
                showToast("∞ LIVES!", "konami-toast")
            }
        } else {
            konamiIndex = e.code === KONAMI[0] ? 1 : 0
        }
    })

    document.addEventListener("keyup", (e) => {
        gameState.keys[e.code] = false
    })
}
