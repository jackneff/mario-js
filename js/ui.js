// UI functions
import { gameState, elements } from "./state.js";
import { isTopTen, saveScore, getLeaderboard } from "./leaderboard.js";
import { GAME_SETTINGS } from "./settings.js";
import { playWinSound } from "./sounds.js";

function launchConfetti() {
  const container = document.createElement("div");
  container.id = "confetti-container";
  document.body.appendChild(container);

  const colors = ["#ff4444", "#ffdd00", "#44ff44", "#4488ff", "#ff44ff", "#ff8800", "#00ffff", "#ffffff"];
  const shapes = ["square", "circle", "strip"];

  for (let i = 0; i < 120; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");

    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 10;
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 2.5;

    piece.style.left = left + "%";
    piece.style.width = shape === "strip" ? "4px" : size + "px";
    piece.style.height = shape === "strip" ? size * 2 + "px" : size + "px";
    piece.style.background = color;
    piece.style.borderRadius = shape === "circle" ? "50%" : "2px";
    piece.style.animationDuration = duration + "s";
    piece.style.animationDelay = delay + "s";

    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5000);
}

export function showGameOver(won) {
  gameState.gameRunning = false;
  if (won) {
    playWinSound();
    launchConfetti();
  }
  elements.gameOverTitle.textContent = won
    ? GAME_SETTINGS.GAME_OVER_MESSAGE
    : "Game over!";
  elements.finalScore.textContent = gameState.score;

  renderLeaderboard();

  if (isTopTen(gameState.score)) {
    showNameEntry();
  } else {
    setTimeout(() => {
      elements.restartButton.focus();
    }, 0);
  }

  elements.gameOver.style.display = "block";

  const handleKeyPress = () => {
    elements.restartButton.click();
  };

  elements.restartButton.addEventListener("keydown", handleKeyPress, { once: false });
}

function showNameEntry() {
  const nameEntry = elements.nameEntry;
  const playerName = elements.playerName;
  const submitBtn = elements.submitName;

  playerName.replaceWith(playerName.cloneNode(true));
  submitBtn.replaceWith(submitBtn.cloneNode(true));

  elements.playerName = document.getElementById("player-name")
  elements.submitName = document.getElementById("submit-name")
  const playerNameNew = elements.playerName
  const submitBtnNew = elements.submitName

  nameEntry.style.display = "block";
  playerNameNew.focus();

  const handleSubmit = () => {
    const name = playerNameNew.value.trim() || "AAA";
    saveScore(name, gameState.score);
    renderLeaderboard(name);
    nameEntry.style.display = "none";
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  playerNameNew.addEventListener("keypress", handleEnter);
  submitBtnNew.addEventListener("click", handleSubmit);
}

function renderLeaderboard(justAddedName = null) {
  const board = getLeaderboard();
  const list = elements.leaderboardList;
  list.innerHTML = "";

  if (board.length === 0) {
    list.innerHTML = "<li>(no scores yet)</li>";
    return;
  }

  board.slice(0, 3).forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.score}`;

    if (justAddedName && entry.name === justAddedName) {
      li.classList.add("new-score");
    }

    list.appendChild(li);
  });
}

export function updateUI() {
  elements.scoreEl.textContent = gameState.score;
  elements.levelEl.textContent = gameState.level;
  elements.livesEl.textContent = gameState.lives;
}
