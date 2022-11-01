import Phaser from "phaser";
import CatSpawner from "./spawner/CatSpawner";

const PLAYER_KEY = "player";
const CAT_KEY = "cat";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.player = undefined;
    this.cursors = undefined;
    this.catSpawner = undefined;
  }

  init(data) {
    this.message = data.message;
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("space", "skies/space4.png");

    this.load.spritesheet(PLAYER_KEY, "sprites/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet(CAT_KEY, "sprites/cats/whitecat.png", {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.image("tiles", "tilesets/jungle_terrain.png");
    this.load.tilemapTiledJSON("map", "tilemaps/level-00.json");
  }

  create() {
    const space = this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "space"
    );
    space.scale *= 1.5;

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("jungle_terrain", "tiles");
    const platforms = map.createLayer("Platforms", tileset, 0, 0);
    const overlays = map.createLayer("Overlays", tileset, 0, 0);

    platforms.setCollisionByExclusion([-1], true);
    platforms.setBlendMode("SCREEN");

    this.player = this.#createPlayer();
    this.cat = this.#createCat();
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.cat, platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.catSpawner = new CatSpawner(this, CAT_KEY);
    const catsGroup = this.catSpawner.group;
    // this.catSpawner.spawn(player.x)

    this.physics.add.collider(catsGroup, platforms);
    // this.physics.add.collider(this.player, catsGroup, this.#petCat, null, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.play("right", true);
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

  #createCat() {
    const cat = this.physics.add.sprite(0, 0, CAT_KEY);
    cat.setBounce(0.1);
    cat.setCollideWorldBounds(true);
    cat.scale *= 1.5;

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(CAT_KEY, { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(CAT_KEY, { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });

    return cat;
  }

  #petCat(player, cat) {
    player.setTint(0x155437);
  }
}
