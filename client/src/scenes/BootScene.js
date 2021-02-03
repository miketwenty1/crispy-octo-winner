import * as Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // load images
    this.loadImages();
    // load spritesheet
    this.loadSpriteSheets();
    // you can provide multiple audio clips for this sound depending
    // on whether or not they support the type

    this.loadAudio();
    // load in Tiled map
    this.loadTimeMap();
  }

  loadImages() {
    this.load.image('button1', 'assets/images/ui/blue_button01.png');
    this.load.image('button2', 'assets/images/ui/blue_button02.png');
    this.load.image('btc', 'assets/images/btc.png');
    this.load.image('background', 'assets/level/background-extruded.png');
  }

  loadSpriteSheets() {
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monsters', 'assets/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
  }

  loadAudio() {
    this.load.audio('goldAudio', ['assets/audio/Pickup.wav']);
    this.load.audio('enemyDeathAudio', ['assets/audio/EnemyDeath.wav']);
    this.load.audio('playerAttackAudio', ['assets/audio/PlayerAttack.wav']);
    this.load.audio('playerDamageAudio', ['assets/audio/PlayerDamage.wav']);
    this.load.audio('playerDeathAudio', ['assets/audio/PlayerDeath.wav']);
  }

  loadTimeMap() {
    // load tiled json
    this.load.tilemapTiledJSON('map', 'assets/level/large_level.json');
  }

  create() {
    console.log('Loading Game');
    this.scene.start('Game');
    // this.scene.start('Title');
  }
}
