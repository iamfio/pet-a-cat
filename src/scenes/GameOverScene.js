import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("gameover-scene");

    this.score = 0;
  }

  init(data) {
    this.score = data.score;
  }

  preload() {
    const cX = this.game.canvas.width;
    const cY = this.game.canvas.height;

    this.load.setPath("assets/");
    this.load.image("space", "skies/space4.png");

    const textStyle = {
      fontFamily: "Kongtext",
      fontSize: "64px",
      color: "#663399",
    };

    const scoreStyle = {
      fontFamily: "Kongtext",
      fontSize: "32px",
      color: "#fff",
    };

    this.add.text(cX / 2, cY / 2, "Game Over!", textStyle).setOrigin(0.5);

    this.add
      .text(cX / 2, cY / 3, 
      `Total Petted 
      
      ${this.score}
      `, scoreStyle)
      .setOrigin(0.5);

    this.input.on("pointerup", () => this.scene.start("intro-scene"), this);
  }
}
