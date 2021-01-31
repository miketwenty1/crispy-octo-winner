import * as Phaser from 'phaser';

export default class UiScene extends Phaser.Scene {
  constructor() {
    super('Ui');
  }

  init() {
    this.gameScene = this.scene.get('Game');
  }

  create() {
    this.setupUiElements();
    this.setupEvents();
  }

  setupUiElements() {
    this.scoreText = this.add.text(35, 8, ': 0', {
      fontSize: '16px',
      fill: '#ffffff',
    });
    this.btcIcon = this.add.image(15, 14, 'btc').setScale(0.4);
  }

  setupEvents() {
    // listen for updateScore event from game scene
    this.gameScene.events.on('updateBalance', (score) => {
      this.scoreText.setText(`: ${score}`);
    });
  }
}
