// Game loop and update logic
import { gameState, player, gameObjects } from "./state.js"
import { GRAVITY, JUMP_FORCE, MOVE_SPEED, ENEMY_SPEED } from "./constants.js"
import { checkCollision } from "./collision.js"
import { spawnItemOnBox } from "./entities.js"
import { loseLife, nextLevel } from "./level.js"
import { updateUI } from "./ui.js"
import { updateElementPosition } from "./dom.js"
import { playCoinSound, playSurpriseBlockSound, playPipeSound } from "./sounds.js"

export function gameLoop() {
    if (!gameState.gameRunning) return

    update()
    requestAnimationFrame(gameLoop)
}

export function update() {
    // Handle left and right
    if (gameState.keys["ArrowLeft"] || gameState.keys["KeyA"]) {
        player.velocityX = -MOVE_SPEED
    } else if (gameState.keys["ArrowRight"] || gameState.keys["KeyD"]) {
        player.velocityX = MOVE_SPEED
    } else {
        player.velocityX *= 0.8
    }

    // Handle jumping
    if (gameState.keys["Space"] && player.grounded) {
        player.velocityY = JUMP_FORCE
        player.grounded = false
    }

    // Apply gravity
    if (!player.grounded) {
        player.velocityY += GRAVITY
    }

    // Update player position
    player.x += player.velocityX
    player.y += player.velocityY

    // Platform collision
    player.grounded = false
    for (let platform of gameObjects.platforms) {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0) { //Falling
                player.y = platform.y - player.height
                player.velocityY = 0
                player.grounded = true
            }
        }
    }

    // Pipe collision
    for (let pipe of gameObjects.pipes) {
        if (checkCollision(player, pipe)) {
            if (player.velocityY > 0) { // Falling down onto Pipe
                player.y = pipe.y - player.height
                player.velocityY = 0
                player.grounded = true
            }
        }
    }

    // Enemy movement and collision
    for (let enemy of gameObjects.enemies) {
        if (!enemy.alive) continue

        enemy.x += enemy.speed * enemy.direction

        let onPlatform = false
        // Reverse direction at platform edges or boundaries
        for (let platform of gameObjects.platforms) {
            if (enemy.x + enemy.width > platform.x &&
                enemy.x < platform.x + platform.width &&
                enemy.y + enemy.height >= platform.y - 5 &&
                enemy.y + enemy.height <= platform.y + 5
            ) {
                onPlatform = true
                break
            }
        }

        if (!onPlatform || enemy.x <= 0 || enemy.x >= 800) {
            enemy.direction *= -1
        }

        updateElementPosition(enemy.element, enemy.x, enemy.y)

        // Check player-enemy collision
        if (checkCollision(player, enemy)) {
            if (player.velocityY > 0 && player.y < enemy.y) {
                // Jump on enemy
                enemy.alive = false
                enemy.element.remove()
                player.velocityY = JUMP_FORCE * 0.7
                gameState.score += 100
            } else {
                // hit by enemy
                if (player.big) {
                    player.big = false
                    player.bigTimer = 0
                    player.element.classList.remove("big")
                    player.width = 20
                    player.height = 20
                } else if (player.grounded) {
                    loseLife()
                }
            }
        }
    }

    // Coin Collection
    for (let coin of gameObjects.coins) {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true
            coin.element.style.display = 'none'
            setTimeout(() => coin.element.remove(), 0)
            gameState.score += 50
            playCoinSound()
        }
    }

    // Surprise blocks
    for (let block of gameObjects.surpriseBlocks) {
        if (!block.hit && checkCollision(player, block) && player.velocityY < 0) {
            block.hit = true
            block.element.classList.add("hit")
            spawnItemOnBox(block, block.type)
            playSurpriseBlockSound()

            if (block.type === "mushroom") {
                player.big = true
                player.bigTimer = 600
                player.element.classList.add("big")
                player.width = 30
                player.height = 30
                gameState.score += 100
            } else if (block.type === "coin") {
                gameState.score += 50
            }
        }
    }

    // Pipe interaction to next level
    for (let pipe of gameObjects.pipes) {
        if (player.grounded &&
            player.x + player.width > pipe.x &&
            player.x < pipe.x + pipe.width &&
            Math.abs(player.y + player.height - pipe.y) < 5 &&
            gameState.keys["ArrowDown"]) {
            playPipeSound()
            nextLevel()
        }
    }

    // Fall death
    if (player.y > 400) {
        loseLife()
    }

    updateElementPosition(player.element, player.x, player.y)

    updateUI()
}
