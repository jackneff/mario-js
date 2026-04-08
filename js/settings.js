// Game settings and configuration
export const GAME_SETTINGS = {
  // Physics
  GRAVITY: 0.5,
  JUMP_FORCE: -12,
  MOVE_SPEED: 2.5,
  ENEMY_SPEED: 1,

  // Player mechanics
  BIG_TIMER_DURATION: 600, // frames
  INVINCIBILITY_DURATION: 300, // frames (5 seconds at 60fps)

  // Mushroom mechanics
  MUSHROOM_GRAVITY: 0.2, // gravity multiplier
  MUSHROOM_POP_FRAMES: 10, // frames for pop animation
  MUSHROOM_INITIAL_VELOCITY: -3, // initial upward velocity
  MUSHROOM_SLIDE_SPEED: 1, // horizontal speed when on platform

  // Power star mechanics
  POWER_STAR_GRAVITY: 0.2, // gravity multiplier
  POWER_STAR_POP_FRAMES: 10, // frames for pop animation
  POWER_STAR_INITIAL_VELOCITY: -3, // initial upward velocity
  POWER_STAR_SLIDE_SPEED: 1, // horizontal speed when on platform

  // Coin mechanics
  COIN_FLOAT_DURATION: 180, // frames

  // UI
  GAME_OVER_MESSAGE: "Congrats!  You won!",
  LEADERBOARD_SIZE: 3,
};
