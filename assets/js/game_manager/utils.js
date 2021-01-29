const SpawnerType = {
  MONSTER: 'MONSTER',
  CHEST: 'CHEST'
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

const Scale = {
  FACTOR: 2
};

const Mode = {
  EASY: 20,
  MEDIUM: 10,
  HARD: 5,
  INSANE: 1
}
const DIFFICULTY = 'MEDIUM';
const AUDIO_LEVEL = .5;
