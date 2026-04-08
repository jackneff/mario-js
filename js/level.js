// Level loading and management
import { gameState, player, gameObjects } from "./state.js"
import { levels } from "./levels.js"
import { createElement, updateElementPosition } from "./dom.js"
import { showGameOver } from "./ui.js"

export function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        showGameOver(true)
        return
    }

    // Clearing existing objects
    clearLevel()

    const level = levels[levelIndex]
    const gameArea = document.getElementById("game-area")

    // Set sunset theme for level 2
    if (levelIndex === 1) {
        gameArea.style.background = "linear-gradient(to bottom, #FFB366 0%, #FF8C42 45%, #FF6B9D 85%, #8B4789 100%)"
    } else {
        gameArea.style.background = "linear-gradient(to bottom, #5C94FC 85%, #228B22 85%, #228B22 100%)"
    }

    // Reset player
    player.x = 50
    player.y = 340
    player.velocityX = 0
    player.velocityY = 0
    player.big = false
    player.bigTimer = 0
    player.element.className = ""
    updateElementPosition(player.element, player.x, player.y)

    // Create platforms
    level.platforms.forEach((platformData, index) => {
        const platform = createElement("div", `platform ${platformData.type}`, {
            left: platformData.x + "px",
            top: platformData.y + "px",
            width: platformData.width + "px",
            height: platformData.height + "px",
        })
        gameArea.appendChild(platform)
        gameObjects.platforms.push({
            element: platform,
            ...platformData,
            id: "platform-" + index
        })
    })

    // Create enemies
    level.enemies.forEach((enemyData, index) => {
        const enemy = createElement("div", `enemy ${enemyData.type}`, {
            left: enemyData.x + "px",
            top: enemyData.y + "px",
        })
        gameArea.appendChild(enemy)
        gameObjects.enemies.push({
            element: enemy,
            x: enemyData.x,
            y: enemyData.y,
            width: 20,
            height: 20,
            direction: -1,
            speed: 1,
            id: "enemy-" + index,
            alive: true
        })
    })

    // Create coins
    const coinsLayer = document.getElementById("coins-layer")
    level.coins.forEach((coinData, index) => {
        const coin = createElement("div", "coin", {
            left: coinData.x + "px",
            top: coinData.y + "px",
        })
        coinsLayer.appendChild(coin)
        gameObjects.coins.push({
            element: coin,
            x: coinData.x,
            y: coinData.y,
            width: 20,
            height: 20,
            collected: false,
            id: "coin-" + index
        })
    })

    // Create surprise blocks
    level.surpriseBlocks.forEach((blockData, index) => {
        const block = createElement("div", "surprise-block", {
            left: blockData.x + "px",
            top: blockData.y + "px"
        })
        gameArea.appendChild(block)
        gameObjects.surpriseBlocks.push({
            element: block,
            x: blockData.x,
            y: blockData.y,
            width: 20,
            height: 20,
            type: blockData.type,
            hit: false,
            id: "block-" + index
        })
    })

    // Create pipes
    level.pipes.forEach((pipeData, index) => {
        const pipe = createElement("div", "pipe", {
            left: (pipeData.x - 20) + "px",
            top: pipeData.y + "px",
        })

        const pipeTopLeft = createElement("div", "pipe-top")
        const pipeTopRight = createElement("div", "pipe-top-right")
        const pipeBottomLeft = createElement("div", "pipe-bottom")
        const pipeBottomRight = createElement("div", "pipe-bottom-right")

        pipe.append(pipeTopLeft, pipeTopRight, pipeBottomLeft, pipeBottomRight)

        gameArea.appendChild(pipe)

        // Create arrow above pipe
        const arrow = createElement("div", "pipe-arrow", {
            left: (pipeData.x + 5) + "px",
            top: (pipeData.y - 50) + "px",
        })
        arrow.textContent = "▼"
        gameArea.appendChild(arrow)

        gameObjects.pipes.push({
            element: pipe,
            x: pipeData.x - 20,
            y: pipeData.y,
            width: 50,
            height: 40,
            id: "pipe-" + index
        })
    })

    // Create clouds
    if (level.clouds) {
        level.clouds.forEach((cloudData, index) => {
            const cloud = createElement("div", "cloud", {
                left: cloudData.x + "px",
                top: cloudData.y + "px",
            })
            gameArea.appendChild(cloud)
        })
    }
}

export function clearLevel() {
    Object.values(gameObjects).flat().forEach(obj => {
        if (obj.element && obj.element.parentNode) {
            obj.element.remove()
        }
    })

    // Mutate the existing gameObjects instead of reassigning
    gameObjects.platforms = []
    gameObjects.enemies = []
    gameObjects.coins = []
    gameObjects.surpriseBlocks = []
    gameObjects.pipes = []
}

export function nextLevel() {
    gameState.level++
    if (gameState.level > levels.length) {
        showGameOver(true)
    } else {
        player.element.classList.remove("big")
        player.width = 20
        player.height = 20
        loadLevel(gameState.level - 1)
    }
}

export function loseLife() {
    gameState.lives--
    if (gameState.lives <= 0) {
        showGameOver(false)
    } else {
        player.x = 50
        player.y = 340
        player.velocityX = 0
        player.velocityY = 0
        player.big = false
        player.bigTimer = 0
        player.element.classList.remove("big")
        player.width = 20
        player.height = 20
    }
}
