import Phaser from "phaser";

export default class CatSpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, catKey = "cat") {
    this.scene = scene;
    this.key = catKey;

    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }

  spawn(playerX = 0, catY) {
    const x =
      playerX < 512
        ? Phaser.Math.Between(512, 1024)
        : Phaser.Math.Between(0, 512);

    const cat = this.group.create(x, catY, this.key);
    cat.setBounce(0.25);
    cat.scale *= 1.5;

    return cat;
  }
}
