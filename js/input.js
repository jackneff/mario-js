// Input handling
import { gameState } from "./state.js"

export function setupInput() {
    document.addEventListener("keydown", (e) => {
        gameState.keys[e.code] = true

        if (e.code === "Space") {
            e.preventDefault()
        }
    })

    document.addEventListener("keyup", (e) => {
        gameState.keys[e.code] = false
    })
}
