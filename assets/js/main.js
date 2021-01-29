let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,//800,
  height: window.innerHeight,//600,
  scene: [
    // order matters
    BootScene,
    TitleScene,
    GameScene,
    UiScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 0 
      }
    }
  },
  //to get rid of grainy look when we scale up tiles
  pixelArt: true,
  // when using floating points phaser will round up to the nearest pixel to render clean
  roundPixels: true
};

let game = new Phaser.Game(config);
