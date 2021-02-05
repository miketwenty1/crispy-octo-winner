import { v4 } from 'uuid';

export default class ChestModel {
  constructor(x, y, bitcoin, spawnerId) {
    this.id = `${spawnerId}-${v4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.bitcoin = bitcoin;
  }
}
