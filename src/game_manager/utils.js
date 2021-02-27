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

// right now only default used
export const Intervals = {
  Spawn: {
    CHEST: 30000,
    MONSTER: 4000,
  },
  Movement: {
    MONSTER: 3000,
  },
  DEFAULT: 10000,
};

export const Map = {
  TileWidth: 60,
  TileHeight: 60,
};
