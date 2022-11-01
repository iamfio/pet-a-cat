import Phaser from "phaser";

const PLAYER_KEY = "player";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.player = undefined;
    this.cursors = undefined;
    this.playerRed = undefined;
  }

  init(data) {
    this.message = data.message;
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("space", "skies/space3.png");

    this.load.spritesheet(PLAYER_KEY, "sprites/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });


    this.load.image("tiles", "tilesets/jungle_terrain.png");

    this.load.tilemapTiledJSON("map", "tilemaps/level-00.json");
  }

  create() {
    const space = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "space"
    );
    space.scale *= 2;

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("jungle_terrain", "tiles");
    const platforms = map.createLayer("Platforms", tileset, 0, 0);
    const overlays = map.createLayer("Overlays", tileset, 0, 0);
    platforms.setCollisionByExclusion([-1], true);

    this.player = this.#createPlayer();
    this.physics.add.collider(this.player, platforms);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      if (this.player.body.onFloor()) {
        this.player.play("left", true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      if (this.player.body.onFloor()) {
        this.player.play("right", true);
      }
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.onFloor()) {
        this.player.play("idle", true);
      }
    }
    if (
      (this.cursors.space.isDown || this.cursors.up.isDown) &&
      this.player.body.onFloor()
    ) {
      this.player.setVelocityY(-350);
      this.player.play("jump", true);
    }
  }

  #createPlayer() {
    const player = this.physics.add.sprite(0, 350, PLAYER_KEY);

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    player.scale *= 1.5;

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: [{ key: PLAYER_KEY, frame: 1 }],
      // frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 0, end: 2 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }
}
