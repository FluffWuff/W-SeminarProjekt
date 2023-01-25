import { GameScene } from "./scenes/GameScene"
import { SelectioScene } from "./scenes/SelectionScene"
import { SinglePlayerScene } from "./scenes/SinglePlayerScene"

var config: Phaser.Types.Core.GameConfig = {
    width: 1920,
    height: 900,
    type: Phaser.AUTO,
    parent: 'game',
    antialias: false,
    scene: [
        new GameScene(),
        new SelectioScene(),
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
    }
}

new Phaser.Game(config)