const instructions =
`Instructions\:
Use arrow keys or WASD to move, Spacebar to attack.
Monsters drop large amounts of gold, but beware they 
do attack back. Gain heath by killing monsters.
Death results in 50% loss of Bitcoins.`;

class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }

  create() {
    this.titleText = this.add.text(this.scale.width/2, this.scale.height/2 , 'Hunt 4 BTC', {
      fontSize: '64px',
      fill: '#6f6f6f'
    });
    this.instructionText = this.add.text(this.scale.width/2, this.scale.height * 0.80, instructions, 
      {
      fontSize: '24px',
      fill: '#6f6f6f'
    });
    this.titleText.setOrigin(.5);
    this.instructionText.setOrigin(.5);
    this.startGameButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.65,
      'button1',
      'button2',
      'Start the Hunt',
      this.startScene.bind(this, 'Game')
    );
  }
  startScene(targetScene) {
    this.scene.start(targetScene);
  }
  
}