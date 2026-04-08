// Level loading and management
import { gameState, player, gameObjects } from "./state.js"
import { levels } from "./levels.js"
import { createElement, updateElementPosition } from "./dom.js"
import { showGameOver } from "./ui.js"
import { playDeathSound, playEnemyDefeatSound } from "./sounds.js"

export function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        showGameOver(true)
        return
    }

    // Clearing existing objects
    clearLevel()

    const level = levels[levelIndex]
    const gameArea = document.getElementById("game-area")

    // Set background theme per level
    if (levelIndex === 1) {
        gameArea.style.background = "linear-gradient(to bottom, #FFB366 0%, #FF8C42 45%, #FF6B9D 85%, #8B4789 100%)"
    } else if (levelIndex === 2) {
        gameArea.style.background = "linear-gradient(to bottom, #0a0a2e 0%, #0d0d3b 60%, #1a1a2e 85%, #2d1b4e 100%)"
    } else {
        gameArea.style.background = "linear-gradient(to bottom, #5C94FC 85%, #228B22 85%, #228B22 100%)"
    }

    // Reset player position and velocity (but preserve big state)
    player.x = 50
    player.y = 340
    player.velocityX = 0
    player.velocityY = 0

    // Restore big and invincible classes if needed
    let classNames = []
    if (player.big) {
        classNames.push("big")
    }
    if (player.invincible) {
        classNames.push("invincible")
    }
    player.element.className = classNames.join(" ")

    updateElementPosition(player.element, player.x, player.y)

    // Create mountains first so everything else renders in front
    if (level.mountains) {
        level.mountains.forEach((mountainData) => {
            const color = mountainData.color || "#c4956a"
            const edgeColor = mountainData.edgeColor || "#6b3f1f"
            const mountain = createElement("div", "mountain", {
                left: mountainData.x + "px",
                bottom: "60px",
                width: mountainData.width + "px",
                height: mountainData.height + "px",
                background: color,
                filter: `drop-shadow(-3px 0 0 ${edgeColor}) drop-shadow(3px 0 0 ${edgeColor}) drop-shadow(0 -3px 0 ${edgeColor})`,
            })
            gameArea.appendChild(mountain)
        })
    }

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
    const enemiesLayer = document.getElementById("enemies-layer")
    level.enemies.forEach((enemyData, index) => {
        const enemy = createElement("div", `enemy ${enemyData.type}`, {
            left: enemyData.x + "px",
            top: enemyData.y + "px",
        })
        enemiesLayer.appendChild(enemy)
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

        const pipeHead = createElement("div", "pipe-head")
        const pipeBody = createElement("div", "pipe-body")

        pipe.append(pipeHead, pipeBody)

        gameArea.appendChild(pipe)

        // Create arrow above pipe
        const arrow = createElement("div", "pipe-arrow", {
            left: (pipeData.x - 7) + "px",
            top: (pipeData.y - 50) + "px",
        })
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

    // Create stars (night level)
    if (level.stars) {
        level.stars.forEach((starData) => {
            const star = createElement("div", "night-star", {
                left: starData.x + "px",
                top: starData.y + "px",
            })
            gameArea.appendChild(star)
        })
    }

    // Create moon (night level)
    if (level.moon) {
        const moon = createElement("div", "crescent-moon", {
            left: level.moon.x + "px",
            top: level.moon.y + "px",
        })
        gameArea.appendChild(moon)

        // Easter egg: click the moon to crush all enemies
        moon.style.cursor = "pointer"
        moon.addEventListener("click", () => {
            moon.classList.add("moon-smash")
            gameObjects.enemies.forEach(enemy => {
                if (!enemy.alive) return
                enemy.alive = false
                enemy.element.remove()
                gameState.score += 100
            })
            playEnemyDefeatSound()
            setTimeout(() => moon.classList.remove("moon-smash"), 400)
        }, { once: true })
    }
}

export function clearLevel() {
    Object.values(gameObjects).flat().forEach(obj => {
        if (obj.element && obj.element.parentNode) {
            obj.element.remove()
        }
    })

    // Remove decorative elements not tracked in gameObjects
    const gameArea = document.getElementById("game-area")
    gameArea.querySelectorAll(".mountain, .cloud, .night-star, .crescent-moon, .pipe-arrow").forEach(el => el.remove())

    // Mutate the existing gameObjects instead of reassigning
    gameObjects.platforms = []
    gameObjects.enemies = []
    gameObjects.coins = []
    gameObjects.surpriseBlocks = []
    gameObjects.pipes = []
    gameObjects.mushrooms = []
    gameObjects.powerStars = []
}

export function nextLevel() {
    gameState.level++
    if (gameState.level > levels.length) {
        showGameOver(true)
    } else {
        loadLevel(gameState.level - 1)
    }
}

export function loseLife() {
    playDeathSound()
    gameState.lives--
    if (gameState.lives <= 0) {
        showGameOver(false)
    } else {
        player.big = false
        player.bigTimer = 0
        player.invincible = false
        player.invincibilityTimer = 0
        player.element.className = ""
        player.width = 20
        player.height = 20
        loadLevel(gameState.level - 1)
    }
}
