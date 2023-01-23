import { GameScene } from "./scenes/GameScene.js"
import { StartScene } from "./scenes/StartScene.js"

var config: Phaser.Types.Core.GameConfig = {
    width: 1920,
    height: 900,
    type: Phaser.AUTO,
    parent: 'game',
    antialias: false,
    scene: [
        new StartScene(),
        new GameScene()
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    input: {
        gamepad: true
    }
}

new Phaser.Game(config)