const Scale = {
  FACTOR: 2,
};

export default class GameMap {
  // this, 'map', 'backgound', 'backgound', 'blocked');
  constructor(scene, key, tileSetName, bgLayerName, blockedLayerName) {
    this.scene = scene;
    this.key = key;
    this.tileSetName = tileSetName;
    this.bgLayerName = bgLayerName;
    this.blockedLayerName = blockedLayerName;
    this.createMap();
  }

  createMap() {
    // create tilemap
    this.tileMap = this.scene.make.tilemap({ key: this.key });
    // add tileset image
    // key in json file, key from loaded images, frame width, frame height, margin, spacing
    this.tiles = this.tileMap.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2);
    // create bg
    // name of layer in tile file, tiles, x-starting position, y-starting position
    console.log(this.bgLayerName);
    this.backgroundLayer = this.tileMap.createLayer(this.bgLayerName, this.tiles, 0, 0);
    this.backgroundLayer.setScale(2);
    // create blocklayer
    this.blockedLayer = this.tileMap.createLayer(this.blockedLayerName, this.tiles, 0, 0);
    this.blockedLayer.setScale(2);
    // -1 (default all in the layer)
    this.blockedLayer.setCollisionByExclusion([-1]);

    // update the world bounds
    this.scene.physics.world.bounds.width = this.tileMap.widthInPixels * Scale.FACTOR;
    this.scene.physics.world.bounds.height = this.tileMap.heightInPixels * Scale.FACTOR;
    // limit camera
    this.scene.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels * Scale.FACTOR, this.tileMap.heightInPixels * Scale.FACTOR);
  }
}
