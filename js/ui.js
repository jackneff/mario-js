// UI functions
import { gameState } from "./state.js";
import { isTopTen, saveScore, getLeaderboard } from "./leaderboard.js";
import { GAME_OVER_MESSAGE } from "./constants.js";
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

  // Clean up after animation
  setTimeout(() => container.remove(), 5000);
}

export function showGameOver(won) {
  gameState.gameRunning = false;
  if (won) {
    playWinSound();
    launchConfetti();
  }
  document.getElementById("game-over-title").textContent = won
    ? GAME_OVER_MESSAGE
    : "Game over!";
  document.getElementById("final-score").textContent = gameState.score;

  renderLeaderboard();

  if (isTopTen(gameState.score)) {
    showNameEntry();
  } else {
    // If not in top 10, focus restart button immediately
    setTimeout(() => {
      document.getElementById("restart-button").focus();
    }, 0);
  }

  document.getElementById("game-over").style.display = "block";

  // Set up keyboard listener on restart button to trigger on any key press
  const restartBtn = document.getElementById("restart-button");
  const handleKeyPress = (e) => {
    restartBtn.click();
  };

  restartBtn.addEventListener("keydown", handleKeyPress, { once: false });
}

function showNameEntry() {
  const nameEntry = document.getElementById("name-entry");
  const playerName = document.getElementById("player-name");
  const submitBtn = document.getElementById("submit-name");

  // Remove old listeners to prevent duplicates
  playerName.replaceWith(playerName.cloneNode(true));
  submitBtn.replaceWith(submitBtn.cloneNode(true));

  // Re-query after cloning
  const playerNameNew = document.getElementById("player-name");
  const submitBtnNew = document.getElementById("submit-name");

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
  const list = document.getElementById("leaderboard-list");
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
  document.getElementById("score").textContent = gameState.score;
  document.getElementById("level").textContent = gameState.level;
  document.getElementById("lives").textContent = gameState.lives;
}
