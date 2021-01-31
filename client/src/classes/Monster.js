import * as Phaser from 'phaser';

const Scale = {
  FACTOR: 2,
};

export default class Monster extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, id, health, attack, maxHealth) {
    super(scene, x, y, key, frame);

    this.scene = scene;
    this.id = id;
    this.health = health;
    this.maxHealth = maxHealth;

    this.scene.physics.world.enable(this);
    this.setImmovable(false);
    this.setScale(Scale.FACTOR * 2);
    this.setCollideWorldBounds(true);
    this.body.setAllowGravity(false);
    this.scene.add.existing(this);
    this.createHealthBar();
    this.setOrigin(0);

    // console.log('max health: '+this.maxHealth);
  }

  createHealthBar() {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  // setScale() {
  //   this.setScale(Scale.FACTOR+((frame/20)*2));
  // }
  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 0.3);
    this.healthBar.fillRect(this.x, this.y - 8, 64 * Scale.FACTOR, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xff00ff, 4);
    // console.log(`health: ${this.health} max health: ${this.maxHealth}`);
    this.healthBar.fillRect(this.x, this.y - 8, 64 * Scale.FACTOR * (this.health / this.maxHealth), 5);
  }

  updatetHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
    this.healthBar.clear();
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
    this.updateHealthBar();
  }

  update() {
    this.updateHealthBar();
  }
}
