import Phaser from 'phaser'
import GameScene from './scenes/GameScene'

import IntroScene from './scenes/IntroScene'

const config = {
	
	type: Phaser.AUTO,
	parent: 'app',
	width: 1024,
	height: 768,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true,
			debugShowBody: true,
			debugShowStaticBody: true,
			debugShowVelocity: true,
			debugVelocityColor: 0xffff00,
			// debugBodyColor: 0x0000ff,
			debugStaticBodyColor: 0xfff
		},
	},
	scene: [IntroScene, GameScene],
}

export default new Phaser.Game(config)
