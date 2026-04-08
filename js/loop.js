// Game loop and update logic
import { gameState, player, gameObjects } from "./state.js"
import { GAME_SETTINGS } from "./settings.js"
import { checkCollision } from "./collision.js"
import { spawnItemOnBox, killEnemy } from "./entities.js"
import { loseLife, nextLevel } from "./level.js"
import { updateUI } from "./ui.js"
import { updateElementPosition } from "./dom.js"
import { playCoinSound, playSurpriseBlockSound, playPipeSound, playEnemyDefeatSound, playMushroomSound, playStarSound } from "./sounds.js"
import { COIN_BLOCK_COUNT } from "./entities.js"

const { GRAVITY, JUMP_FORCE, MOVE_SPEED, ENEMY_SPEED, BIG_TIMER_DURATION, INVINCIBILITY_DURATION } = GAME_SETTINGS

let animationFrameId = null

export function gameLoop() {
    if (!gameState.gameRunning) return

    update()
    animationFrameId = requestAnimationFrame(gameLoop)
}

export function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
}

export function update() {
    if (player.enteringPipe) return

    // Handle left and right
    if (gameState.keys["ArrowLeft"] || gameState.keys["KeyA"]) {
        player.velocityX = -MOVE_SPEED
        player.element.classList.remove("eyes-right")
        player.element.classList.add("eyes-left")
    } else if (gameState.keys["ArrowRight"] || gameState.keys["KeyD"]) {
        player.velocityX = MOVE_SPEED
        player.element.classList.remove("eyes-left")
        player.element.classList.add("eyes-right")
    } else {
        player.velocityX *= 0.8
        player.element.classList.remove("eyes-left", "eyes-right")
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

    // Clamp to screen bounds
    if (player.x < 0) { player.x = 0; player.velocityX = 0 }
    if (player.x + player.width > 800) { player.x = 800 - player.width; player.velocityX = 0 }

    // Platform collision
    player.grounded = false
    for (let platform of gameObjects.platforms) {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0) { //Falling
                player.y = platform.y - player.height
                player.velocityY = 0
                player.grounded = true
            } else if (player.velocityY < 0) { //Jumping up - hit head on platform
                player.y = platform.y + platform.height
                player.velocityY = 0
            }
        }
    }

    // Pipe collision - top only, Mario can jump up through from below
    for (let pipe of gameObjects.pipes) {
        if (checkCollision(player, pipe)) {
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= pipe.y) {
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
                killEnemy(enemy)
                player.velocityY = JUMP_FORCE * 0.7
                gameState.score += 100
                playEnemyDefeatSound()
            } else if (player.invincible) {
                // Defeat enemy just by touching while invincible
                killEnemy(enemy)
                gameState.score += 100
                playEnemyDefeatSound()
            } else {
                // hit by enemy (not invincible)
                if (player.big) {
                    player.big = false
                    player.bigTimer = 0
                    player.element.classList.remove("big")
                    player.width = gameState.luigiMode ? 16 : 20
                    player.height = gameState.luigiMode ? 24 : 20
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
        if (checkCollision(player, block)) {
            if (!block.hit && player.velocityY < 0) {
                // Init coin counter lazily on first hit
                if (block.type === "coin" && block.coinsLeft === undefined) {
                    block.coinsLeft = COIN_BLOCK_COUNT
                }

                spawnItemOnBox(block, block.type)
                playSurpriseBlockSound()

                if (block.type === "coin") {
                    block.coinsLeft--
                    gameState.score += 50
                    if (block.coinsLeft <= 0) {
                        block.hit = true
                        block.element.classList.add("hit")
                    }
                } else {
                    block.hit = true
                    block.element.classList.add("hit")
                }
            }

            // Land on top
            if (player.velocityY > 0 && player.y < block.y) {
                player.y = block.y - player.height
                player.velocityY = 0
                player.grounded = true
            }

            // Head collision - stop upward momentum
            if (player.velocityY < 0) {
                player.y = block.y + block.height
                player.velocityY = 0
            }
        }
    }

    // Mushroom collection
    if (gameObjects.mushrooms) {
        for (let mushroom of gameObjects.mushrooms) {
            if (!mushroom.collected && checkCollision(player, mushroom)) {
                mushroom.collected = true
                mushroom.element.remove()
                player.big = true
                player.bigTimer = BIG_TIMER_DURATION
                player.element.classList.add("big")
                if (gameState.luigiMode) {
                    player.width = 20
                    player.height = 38
                } else {
                    player.width = 30
                    player.height = 30
                }
                gameState.score += 100
                playMushroomSound()
            }
        }
    }

    // Power star collection
    if (gameObjects.powerStars) {
        for (let star of gameObjects.powerStars) {
            if (!star.collected && checkCollision(player, star)) {
                star.collected = true
                star.element.remove()
                player.invincible = true
                player.invincibilityTimer = INVINCIBILITY_DURATION
                player.element.classList.add("invincible")
                gameState.score += 200
                playStarSound()
            }
        }
    }

    // Update invincibility timer
    if (player.invincible) {
        player.invincibilityTimer--
        if (player.invincibilityTimer <= 0) {
            player.invincible = false
            player.element.classList.remove("invincible")
        }
    }

    // Pipe interaction to next level
    if (!player.enteringPipe) {
        for (let pipe of gameObjects.pipes) {
            if (player.grounded &&
                player.x + player.width > pipe.x &&
                player.x < pipe.x + pipe.width &&
                Math.abs(player.y + player.height - pipe.y) < 5 &&
                gameState.keys["ArrowDown"]) {
                player.enteringPipe = true
                player.velocityX = 0
                player.element.classList.add("entering-pipe")
                playPipeSound()
                setTimeout(() => {
                    player.enteringPipe = false
                    player.element.classList.remove("entering-pipe")
                    nextLevel()
                }, 600)
            }
        }
    }

    // Fall death
    if (player.y > 400) {
        loseLife()
    }

    updateElementPosition(player.element, player.x, player.y)

    updateUI()
}
