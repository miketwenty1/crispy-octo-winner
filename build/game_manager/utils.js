"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomNumber = randomNumber;
exports.SpawnInterval = exports.Direction = exports.AUDIO_LEVEL = exports.DIFFICULTY = exports.Mode = exports.Scale = exports.SpawnerType = void 0;
var SpawnerType = {
  MONSTER: 'MONSTER',
  CHEST: 'CHEST'
};
exports.SpawnerType = SpawnerType;

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

var Scale = {
  FACTOR: 2
};
exports.Scale = Scale;
var Mode = {
  EASY: 20,
  MEDIUM: 10,
  HARD: 5,
  INSANE: 1
};
exports.Mode = Mode;
var DIFFICULTY = 'MEDIUM';
exports.DIFFICULTY = DIFFICULTY;
var AUDIO_LEVEL = 0.5;
exports.AUDIO_LEVEL = AUDIO_LEVEL;
var Direction = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN'
}; // right now only default used

exports.Direction = Direction;
var SpawnInterval = {
  CHEST: 30000,
  MONSTERS: 5000,
  DEFAULT: 10000
};
exports.SpawnInterval = SpawnInterval;
//# sourceMappingURL=utils.js.map