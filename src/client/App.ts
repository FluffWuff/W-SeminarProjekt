import { GameScene } from "./scenes/GameScene.js"
import { SelectionScene } from "./scenes/SelectionScene.js"
import { TestPipeline } from "./shader/TestShader.js"
import { GameDefaultShaderPipeline } from "./shader/GameShaderPipeline.js"
import { EndingScene } from './scenes/EndingScene.js';

var config: Phaser.Types.Core.GameConfig = {
    width: 1920,
    height: 1080,
    type: Phaser.AUTO,
    parent: 'game',
    antialias: false,
    scene: [
        new SelectionScene(),
        new GameScene(),
        new EndingScene(),
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
        //@ts-ignore
        'GameDefaultShaderPipeline': GameDefaultShaderPipeline,
        'TestShader': TestPipeline
    }
}

new Phaser.Game(config)
