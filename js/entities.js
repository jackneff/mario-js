// Entity spawning
import { gameObjects, gameState, player } from "./state.js"
import { GAME_SETTINGS } from "./settings.js"
import { checkCollision } from "./collision.js"

const {
  MUSHROOM_GRAVITY,
  MUSHROOM_POP_FRAMES,
  MUSHROOM_INITIAL_VELOCITY,
  COIN_FLOAT_DURATION,
  COIN_BLOCK_COUNT
} = GAME_SETTINGS

export function spawnItemOnBox(block, type) {
    // On level 2, if Mario is big, spawn a power star instead of mushroom
    let spawnType = type
    if (type === "mushroom" && gameState.level >= 2 && player.big) {
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

    const size = spawnType === "power-star" ? 32 : 20
    const itemObj = {
        x: block.x,
        y: block.y - size,
        width: size,
        height: size,
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
        itemObj.velocityY = MUSHROOM_INITIAL_VELOCITY
        itemObj.velocityX = 0 // horizontal velocity
        itemObj.currentPlatform = null // track which platform it's on
        let popFrames = 0
        const popDuration = MUSHROOM_POP_FRAMES

        function fall() {
            if (itemObj.collected) {
                return
            }

            popFrames++

            if (popFrames < popDuration) {
                // Pop phase - move up
                itemObj.y += itemObj.velocityY
            } else if (itemObj.currentPlatform) {
                // On platform - move horizontally
                itemObj.x += itemObj.velocityX
            } else {
                // Fall phase - apply gravity
                itemObj.velocityY += MUSHROOM_GRAVITY
                itemObj.y += itemObj.velocityY
            }

            let onPlatform = false
            let platformContact = null

            // Check platforms - wider tolerance for faster falling
            for (let platform of gameObjects.platforms) {
                const mushroomBottom = itemObj.y + itemObj.height
                if (
                    itemObj.x < platform.x + platform.width &&
                    itemObj.x + itemObj.width > platform.x &&
                    mushroomBottom >= platform.y &&
                    mushroomBottom <= platform.y + 15
                ) {
                    onPlatform = true
                    platformContact = platform
                    itemObj.y = platform.y - itemObj.height
                    itemObj.velocityY = 0

                    // Set horizontal velocity when first landing
                    if (!itemObj.currentPlatform) {
                        itemObj.velocityX = Math.random() > 0.5 ? 1 : -1 // random left or right
                    }

                    itemObj.currentPlatform = platform
                    break
                }
            }

            if (!onPlatform) {
                itemObj.currentPlatform = null
            }

            // Remove if off screen
            if (itemObj.y > 450 || itemObj.y < -50) {
                item.remove()
                if (gameObjects.mushrooms) {
                    const idx = gameObjects.mushrooms.indexOf(itemObj)
                    if (idx > -1) gameObjects.mushrooms.splice(idx, 1)
                }
                if (gameObjects.powerStars) {
                    const idx = gameObjects.powerStars.indexOf(itemObj)
                    if (idx > -1) gameObjects.powerStars.splice(idx, 1)
                }
                return
            }

            item.style.left = itemObj.x + "px"
            item.style.top = itemObj.y + "px"

            requestAnimationFrame(fall)
        }

        fall()

    } else if (type === "coin") {

        function floatUp() {
            itemObj.frames++
            itemObj.y -= 1.5
            const progress = itemObj.frames / COIN_FLOAT_DURATION
            item.style.top = itemObj.y + "px"
            item.style.opacity = 1 - progress

            if (itemObj.frames < COIN_FLOAT_DURATION) {
                requestAnimationFrame(floatUp)
            } else {
                item.remove()
            }
        }

        floatUp()
    }
}

export function killEnemy(enemy) {
    enemy.alive = false
    enemy.element.classList.add("dead")
    console.log("Animation:", getComputedStyle(enemy.element).animation)
    console.log("Transform:", getComputedStyle(enemy.element).transform)
    
    setTimeout(() => {
        enemy.element.remove()
    }, 800)
}

export { COIN_BLOCK_COUNT }
