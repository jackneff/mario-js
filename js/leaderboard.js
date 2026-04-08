const KEY = 'mario_leaderboard';

export function getLeaderboard() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export function isTopTen(score) {
  const board = getLeaderboard();
  return board.length < 3 || score > board[board.length - 1].score;
}

export function saveScore(name, score) {
  const board = getLeaderboard();
  board.push({ name: name.toUpperCase().slice(0, 3), score });
  board.sort((a, b) => b.score - a.score);
  board.splice(3); // keep top 3
  localStorage.setItem(KEY, JSON.stringify(board));
  return board;
}
