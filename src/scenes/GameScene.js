import Phaser from "phaser";
import LabelContainer from "../ui/LabelContainer";
import CatSpawner from "./spawner/CatSpawner";

// Game countdown time amount (in sec)
const COUNTDOWN = 20;

// Step for counting scores
const SCORE_AMOUNT = 1;

// Min score to complete level
const MIN_SCORE = 5;

// Key for sprites
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

    this.emitter = undefined;

    this.scoreLabel = undefined;

    this.timeNow = undefined;
    this.currentScore = 0;
    this.totalScore = 0;

    this.isGameOver = false;
  }

  preload() {
    this.worldW = this.game.canvas.width;
    this.worldH = this.game.canvas.height;
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
    this.emitter = new Phaser.Events.EventEmitter();

    const space = this.add.image(this.worldW / 2, this.worldH / 2, "space");
    space.scale *= 1.5;

    // Environment
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("jungle_terrain", "tiles");
    this.platforms = map.createLayer("Platforms", tileset, 0, 0);
    map.createLayer("Overlays", tileset, 0, 0);

    this.platforms.setCollisionByExclusion([-1], true);
    this.platforms.setBlendMode("SCREEN");

    // Player
    this.player = this.#createPlayer();

    // new coordinates for the new cat respawn
    this.#setRandomCatCoordinates();

    // UI
    this.scoreLabel = this.#createTextabel(16, 16, "Score", 0);

    this.timeLabel = this.#createTextabel(327, 16, "Time", 0);

    // Keyboard navigation
    this.cursors = this.input.keyboard.createCursorKeys();

    // Creating cat
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

    this.timeNow = this.time.delayedCall(
      COUNTDOWN * 1000,
      this.#followCountdown,
      [],
      this
    );

    this.physics.scene.anims.create({
      key: "left",
      frames: this.physics.scene.anims.generateFrameNumbers(CAT_KEY, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.physics.scene.anims.create({
      key: "right",
      frames: this.physics.scene.anims.generateFrameNumbers(CAT_KEY, {
        start: 4,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.physics.scene.anims.create({
      key: "turn",
      frames: [{ key: CAT_KEY, frame: 6 }],
    });

    this.emitter.on("count-score", this.#countScore, this);
  }

  update() {
    this.timeLabel.setTextValue(
      Number(COUNTDOWN - this.timeNow.getElapsedSeconds()).toFixed(0)
    );

    this.#setRandomCatCoordinates();

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
      frameRate: 10,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  #countScore(score) {
    this.currentScore += score;
  }

  #petCat(player, cat) {
    this.emitter.emit("count-score", SCORE_AMOUNT);

    cat.destroy();
    this.catSpawner.spawn(player.x, this.catY);

    this.scoreLabel.add(SCORE_AMOUNT);
  }

  #createTextabel(x, y, labelText, value) {
    const style = {
      fontFamily: "Kongtext",
      fontSize: "28px",
      fill: "#F6FCF2",
    };
    const label = new LabelContainer(this, x, y, labelText, value, style);

    this.add.existing(label);

    return label;
  }

  #setRandomCatCoordinates() {
    this.catX = Phaser.Math.Between(0, 1024);
    this.catY = Phaser.Math.Between(0, 650);
  }

  #followCountdown() {
    let sceneName = "";

    this.physics.pause();
    this.player.play("idle");
    this.player.setVelocity(0, 0);

    this.totalScore += this.currentScore;

    if (this.currentScore < MIN_SCORE) {
      this.isGameOver = true;
      this.player.setTint(0xff0000);
      sceneName = "gameover";
    } else {
      this.isGameOver = false;
      this.player.setTint(0x501277);
      sceneName = "game";
    }

    setTimeout(() => {
      if (this.isGameOver) {
        this.scene.start(`${sceneName}-scene`, { score: this.totalScore });
      } else {
        this.currentScore = 0;
        this.scene.start(`${sceneName}-scene`);
      }
    }, 2000);
  }
}
