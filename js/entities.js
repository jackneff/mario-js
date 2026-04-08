// Entity spawning
import { gameObjects } from "./state.js"
import { GRAVITY } from "./constants.js"
import { checkCollision } from "./collision.js"

export function spawnItemOnBox(block, type) {
    const container = type === "coin"
        ? document.getElementById("coins-layer")
        : document.getElementById("game-area")

    const item = document.createElement("div")
    item.classList.add(type)
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

    if (type === "mushroom") {
        gameObjects.mushrooms = gameObjects.mushrooms || []
        gameObjects.mushrooms.push(itemObj)

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
