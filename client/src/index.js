import * as Phaser from 'phaser';
import io from 'socket.io-client';
import scenes from './scenes/scenes';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth, // 800,
  height: window.innerHeight, // 600,
  scene: scenes,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 0,
      },
    },
  },
  // to get rid of grainy look when we scale up tiles
  pixelArt: true,
  // when using floating points phaser will round up to the nearest pixel to render clean
  roundPixels: true,
};

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const socket = io('http://localhost:4000');
    this.globals = { socket };
    this.scene.start('Boot');
  }
}

window.onload = () => {
  window.game = new Game();
};
