import Phaser from "phaser";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("intro-scene");
  }

  preload() {
    this.load.setPath("assets/");

    this.load.image("sky", "skies/space4.png");
    this.load.image("logo", "sprites/octopussy-12.png");
    this.load.image("red", "particles/red.png");
  }

  create() {
    const sky = this.add.image(400, 300, "sky");
    sky.scaleX *= 2;
    sky.scaleY *= 2;

    const particles = this.add.particles("red");
    // particles.scale /= 2

    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    const logo = this.physics.add.image(400, 100, "logo");
    logo.scaleX /= 1.5;
    logo.scaleY /= 1.5;

    const cX = this.game.canvas.width / 2;
    const cY = this.game.canvas.height / 5;

    const gameTitleConfig = {
      fontSize: "62px",
      color: "#fff",
      fontFamily: "JetBrains Mono",
    };

    this.add.text(cX, cY, "Pet - A - Cat", gameTitleConfig).setOrigin(0.5);

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);

    this.input.on(
      "pointerup",
      () => this.scene.start("game-scene", { message: "Go!" }),
      this
    );
    // this.time.addEvent({
    //   delay: 2500,
    //   loop: false,
    //   callback: () => this.scene.start("game-scene", { message: "Go!" }),
    // });
  }
}
