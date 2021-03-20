export const enums = {
  SpawnerType: {
    MONSTER: 'MONSTER',
    CHEST: 'CHEST',
  },
  Scale: {
    FACTOR: 2,
  },
  Mode: {
    EASY: 20,
    MEDIUM: 10,
    HARD: 5,
    INSANE: 1,
  },
  DIFFICULTY: 'MEDIUM',
  AUDIO_LEVEL: 0.5,
  Direction: {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    UP: 'UP',
    DOWN: 'DOWN',
  },
  Intervals: {
    Spawn: {
      CHEST: 30000,
      MONSTER: 4000,
    },
    Movement: {
      MONSTER: 5000,
    },
    ResetLocation: {
      MONSTER: 31000,
    },
    DEFAULT: 10000,
  },
  Map: {
    TileWidth: 60,
    TileHeight: 60,
  },
  Movement: {
    MONSTER: 300,
  }
};
