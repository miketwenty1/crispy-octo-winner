export const SpawnerType = {
  MONSTER: 'MONSTER',
  CHEST: 'CHEST',
};

export function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export const Scale = {
  FACTOR: 2,
};

export const Mode = {
  EASY: 20,
  MEDIUM: 10,
  HARD: 5,
  INSANE: 1,
};
export const DIFFICULTY = 'MEDIUM';
export const AUDIO_LEVEL = 0.5;

export const Direction = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
};
