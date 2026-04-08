// UI functions
import { gameState } from "./state.js";
import { isTopTen, saveScore, getLeaderboard } from "./leaderboard.js";
import { GAME_OVER_MESSAGE } from "./constants.js";

export function showGameOver(won) {
  gameState.gameRunning = false;
  document.getElementById("game-over-title").textContent = won
    ? GAME_OVER_MESSAGE
    : "Game over!";
  document.getElementById("final-score").textContent = gameState.score;

  renderLeaderboard();

  if (isTopTen(gameState.score)) {
    showNameEntry();
  }

  document.getElementById("game-over").style.display = "block";
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

  board.forEach((entry, i) => {
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
