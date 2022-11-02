import Phaser from "phaser";
import LabelContainer from "../ui/LabelContainer";
import ScoreLabel from "../ui/ScoreLabel";
// import TimeLabel from "../ui/TimeLabel";
import CatSpawner from "./spawner/CatSpawner";

const PLAYER_KEY = "player";
const CAT_KEY = "cat";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.player = undefined;
    this.cursors = undefined;
    this.catSpawner = undefined;
    this.scoreLabel = undefined;
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
    map.createLayer("Overlays", tileset, 0, 0);

    platforms.setCollisionByExclusion([-1], true);
    platforms.setBlendMode("SCREEN");

    this.player = this.#createPlayer();
    this.cat = this.#createCat();
    this.scoreLabel = this.#createScoreLabel(16, 16, 0)
    this.timeLabel = this.#createTimeLabel(264, 16, 0)

    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.catSpawner = new CatSpawner(this, CAT_KEY);
    const catsGroup = this.catSpawner.group;
    
    // Colliders
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.cat, platforms);
    this.physics.add.collider(catsGroup, platforms);
    this.physics.add.collider(this.player, this.cat, this.#petCat, null, this);
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

    this.cat.play("turn", true)
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
    // const cat = this.physics.add.sprite(0, 0, CAT_KEY);
    const cat = this.physics.add.sprite(80, 650, CAT_KEY);
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

    this.anims.create({
      key: "turn",
      frames: [{ key: CAT_KEY, frame: 6 }],
    })

    return cat;
  }

  #petCat(player, cat) {
    // player.setTint(0x155437);
    cat.disableBody(true, true)

    this.scoreLabel.add(1)
  }

  #createScoreLabel(x, y, score) {
    const style = { fontSize: "36px", fill: "#fff"}
    const label = new LabelContainer(this, x, y, "Score", score, style);

    this.add.existing(label)

    return label
  }

  #createTimeLabel(x, y, score) {
    const style = { fontSize: "36px", fill: "#fff"}
    const label = new LabelContainer(this, x, y, "Time", score, style);
    // const label = new ScoreLabel(this, x, y, "Score", score, style);

    this.add.existing(label)

    return label
  }
}
