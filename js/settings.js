// Game settings and configuration
export const GAME_SETTINGS = {
  // Screen
  SCREEN_WIDTH: 800,
  DEATH_BOUNDARY: 400,

  // Physics
  GRAVITY: 0.5,
  JUMP_FORCE: -12,
  MOVE_SPEED: 2.5,
  ENEMY_SPEED: 1,

  // Player mechanics
  INVINCIBILITY_DURATION: 300,

  // Mushroom mechanics
  MUSHROOM_GRAVITY: 0.2,
  MUSHROOM_POP_FRAMES: 10,
  MUSHROOM_INITIAL_VELOCITY: -3,

  // Coin mechanics
  COIN_FLOAT_DURATION: 60,
  COIN_BLOCK_COUNT: 5,

  // UI
  GAME_OVER_MESSAGE: "Congrats!  You won!",
  LEADERBOARD_SIZE: 3,
};

export function getPlayerDimensions(big, luigi) {
  if (big) {
    return { width: luigi ? 20 : 30, height: luigi ? 38 : 30 }
  }
  return { width: luigi ? 16 : 20, height: luigi ? 24 : 20 }
}
