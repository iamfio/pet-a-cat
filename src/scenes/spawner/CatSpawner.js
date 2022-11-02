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

    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: this.key, frame: 6 }],
    });

    cat.setBounce(0.1);
    cat.scale *= 1.5;
    
    return cat;
  }
}
