// Game loop and update logic
import { gameState, player, gameObjects, elements } from "./state.js"
import { GAME_SETTINGS, getPlayerDimensions } from "./settings.js"
import { checkCollision } from "./collision.js"
import { spawnItemOnBox, killEnemy } from "./entities.js"
import { loseLife, nextLevel } from "./level.js"
import { updateUI } from "./ui.js"
import { updateElementPosition } from "./dom.js"
import { playCoinSound, playSurpriseBlockSound, playPipeSound, playEnemyDefeatSound, playMushroomSound, playStarSound } from "./sounds.js"
import { COIN_BLOCK_COUNT } from "./entities.js"

const { GRAVITY, JUMP_FORCE, MOVE_SPEED, ENEMY_SPEED, INVINCIBILITY_DURATION, SCREEN_WIDTH, DEATH_BOUNDARY } = GAME_SETTINGS

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
        elements.mario.classList.remove("eyes-right")
        elements.mario.classList.add("eyes-left")
    } else if (gameState.keys["ArrowRight"] || gameState.keys["KeyD"]) {
        player.velocityX = MOVE_SPEED
        elements.mario.classList.remove("eyes-left")
        elements.mario.classList.add("eyes-right")
    } else {
        player.velocityX *= 0.8
        elements.mario.classList.remove("eyes-left", "eyes-right")
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
    if (player.x + player.width > SCREEN_WIDTH) { player.x = SCREEN_WIDTH - player.width; player.velocityX = 0 }

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

        if (!onPlatform || enemy.x <= 0 || enemy.x >= SCREEN_WIDTH) {
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
                    elements.mario.classList.remove("big")
                    const dims = getPlayerDimensions(false, gameState.luigiMode)
                    player.width = dims.width
                    player.height = dims.height
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
            coin.element.remove()
            gameState.score += 50
            playCoinSound()
        }
    }

    // Blue coin collection (10x regular coin value = 500)
    for (let coin of gameObjects.blueCoins) {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true
            coin.element.remove()
            gameState.score += 500
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
                elements.mario.classList.add("big")
                const dims = getPlayerDimensions(true, gameState.luigiMode)
                player.width = dims.width
                player.height = dims.height
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
                elements.mario.classList.add("invincible")
                gameState.score += 200
                playStarSound()
            }
        }
    }

    // Invincibility timer
    if (player.invincible) {
        player.invincibilityTimer--
        if (player.invincibilityTimer <= 0) {
            player.invincible = false
            elements.mario.classList.remove("invincible")
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

                // Center Mario over the pipe opening before the downward slide
                const pipeCenterX = pipe.x + pipe.width / 2 - player.width / 2
                player.x = pipeCenterX
                updateElementPosition(elements.mario, player.x, player.y)

                elements.mario.classList.add("entering-pipe")
                playPipeSound()
                setTimeout(() => {
                    player.enteringPipe = false
                    elements.mario.classList.remove("entering-pipe")
                    nextLevel()
                }, 600)
            }
        }
    }

    // Fall death
    if (player.y > DEATH_BOUNDARY) {
        loseLife()
    }

    updateElementPosition(elements.mario, player.x, player.y)

    updateUI()
}
