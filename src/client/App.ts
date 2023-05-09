import { GameScene } from "./scenes/GameScene.js"
import { GrayScalePipeline } from "./scenes/Grayscale.js"
import { SelectionScene } from "./scenes/SelectionScene.js"
import { SinglePlayerScene } from "./scenes/SinglePlayerScene.js"

var config: Phaser.Types.Core.GameConfig = {
    width: 1920,
    height: 1080,
    type: Phaser.AUTO,
    parent: 'game',
    antialias: false,
    scene: [
        new SelectionScene(),
        new GameScene(),
        new SinglePlayerScene(),
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    input: {
        gamepad: true
    },
    pipeline: {
        //@ts-ignore#
        'Test': GrayScalePipeline
    }
}

new Phaser.Game(config)

//https://www.codeadventurer.de/?p=2091