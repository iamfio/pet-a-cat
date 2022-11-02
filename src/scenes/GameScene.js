import Phaser from "phaser";
import LabelContainer from "../ui/LabelContainer";
import CatSpawner from "./spawner/CatSpawner";

const PLAYER_KEY = "player";
const CAT_KEY = "cat";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.platforms = undefined;
    this.player = undefined;
    this.cursors = undefined;
    this.catSpawner = undefined;
    this.catX = undefined;
    this.catY = undefined;
    this.catsGroup = undefined;
    this.gameTime = undefined;
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
      frameHeight: 32,
    });

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
    this.platforms = map.createLayer("Platforms", tileset, 0, 0);
    map.createLayer("Overlays", tileset, 0, 0);

    this.platforms.setCollisionByExclusion([-1], true);
    this.platforms.setBlendMode("SCREEN");

    this.player = this.#createPlayer();

    // new coordinates for the new cat respawn
    this.#setRandomCatCoordinates();

    this.scoreLabel = this.#createTextabel(16, 16, "Score", 0);
    this.timeLabel = this.#createTextabel(264, 16, "Time", 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.catSpawner = new CatSpawner(this, CAT_KEY);
    this.catsGroup = this.catSpawner.group;
    this.catSpawner.spawn(this.player.x);

    // Colliders
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.catsGroup, this.platforms);
    this.physics.add.collider(
      this.player,
      this.catsGroup,
      this.#petCat,
      null,
      this
    );
  }

  update() {
    this.gameTime = this.sys.game.loop.time.toFixed(0).toString();
    this.timeLabel.setTextValue(this.gameTime);

    this.#setRandomCatCoordinates()

    // Player Movements
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


  #petCat(player, cat) {
    cat.destroy();

    this.scoreLabel.add(1);
    this.catSpawner.spawn(player.x, this.catY);

    this.physics.add.collider(cat, this.player, this.#petCat, null, this);
  }

  #createTextabel(x, y, labelText, value) {
    const style = { fontSize: "36px", fill: "#fff" };
    const label = new LabelContainer(this, x, y, labelText, value, style);

    this.add.existing(label);

    return label;
  }

  #setRandomCatCoordinates() {
    this.catX = Phaser.Math.Between(0, 1024);
    this.catY = Phaser.Math.Between(0, 650);
  }
}
