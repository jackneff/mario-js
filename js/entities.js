// Entity spawning
import { gameObjects, gameState, player } from "./state.js"
import { GRAVITY } from "./constants.js"
import { checkCollision } from "./collision.js"

export function spawnItemOnBox(block, type) {
    // On level 2, if Mario is big, spawn a power star instead of mushroom
    let spawnType = type
    if (type === "mushroom" && gameState.level === 2 && player.big) {
        spawnType = "power-star"
    }

    const container = spawnType === "coin"
        ? document.getElementById("coins-layer")
        : document.getElementById("game-area")

    const item = document.createElement("div")
    item.classList.add(spawnType)
    item.style.left = block.x + "px"
    item.style.top = block.y + "px"
    container.appendChild(item)

    const itemObj = {
        x: block.x,
        y: block.y - 20,
        width: 20,
        height: 20,
        element: item,
        velocityY: 0,
        frames: 0,
        collected: false
    }

    if (type === "mushroom" || spawnType === "power-star") {
        if (spawnType === "power-star") {
            gameObjects.powerStars = gameObjects.powerStars || []
            gameObjects.powerStars.push(itemObj)
        } else {
            gameObjects.mushrooms = gameObjects.mushrooms || []
            gameObjects.mushrooms.push(itemObj)
        }

        // Pop up animation first, then fall
        itemObj.velocityY = -3 // initial upward velocity
        let popFrames = 0
        const popDuration = 10 // frames for pop animation

        function fall() {
            if (itemObj.collected) {
                return
            }

            popFrames++

            if (popFrames < popDuration) {
                // Pop phase - move up
                itemObj.y += itemObj.velocityY
            } else {
                // Fall phase - apply gravity
                itemObj.velocityY += GRAVITY * 0.2
                itemObj.y += itemObj.velocityY
            }

            let onPlatform = false
            for (let platform of gameObjects.platforms) {
                if (
                    itemObj.x < platform.x + platform.width &&
                    itemObj.x + itemObj.width > platform.x &&
                    itemObj.y + itemObj.height >= platform.y &&
                    itemObj.y + itemObj.height <= platform.y + 5
                ) {
                    onPlatform = true
                    itemObj.y = platform.y - itemObj.height
                    itemObj.velocityY = 0
                    item.remove()
                    break
                }
            }

            item.style.top = itemObj.y + "px"

            if (!onPlatform) {
                requestAnimationFrame(fall)
            }
        }

        fall()

    } else if (type === "coin") {

        function floatUp() {
            itemObj.y -= 1
            item.style.top = itemObj.y + "px"
            itemObj.frames++

            if (itemObj.frames < 180) {
                requestAnimationFrame(floatUp)
            } else {
                item.remove()
            }
        }

        floatUp()
    }
}
