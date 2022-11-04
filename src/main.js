import Phaser from "phaser";
import GameOverScene from "./scenes/GameOverScene";
import GameScene from "./scenes/GameScene";
import IntroScene from "./scenes/IntroScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1024,
  height: 768,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
      debugShowBody: true,
      debugShowStaticBody: true,
      debugShowVelocity: true,
      debugVelocityColor: 0xffff00,
      debugStaticBodyColor: 0xfff,
    },
  },
  scene: [IntroScene, GameScene, GameOverScene],
};

export default new Phaser.Game(config);
