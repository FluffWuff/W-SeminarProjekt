import { GameLevel } from "../level/Levels.js"
import { GameDefaultShaderPipeline } from "../shader/GameShaderPipeline.js"
import { GameLevelConfig, LEVEL_2_GAME_LEVEL_CONFIG, LEVEL_3_GAME_LEVEL_CONFIG, LEVEL_5_GAME_LEVEL_CONFIG, LEVEL_NIL_GAME_LEVEL_CONFIG, GF_BACKGROUND_32, GF_BACKGROUND_64 } from "../util/Constants.js"

export class GameScene extends Phaser.Scene {

    levelConfig: GameLevelConfig
    isShaderOn: Boolean
    constructor() {
        super({
            key: "GameScene"
        })
    }

    init(data) {
        this.levelConfig = data.levelGameConfig
        this.isShaderOn = data.isShaderOn
    }


    preload() {
        this.load.image(GF_BACKGROUND_32, 'assets/bitmaps/ma32.png')
        this.load.image(GF_BACKGROUND_64, 'assets/bitmaps/ma64.png')
    }

    create() {
        if(this.isShaderOn) this.cameras.main.setPostPipeline(GameDefaultShaderPipeline)

        this.scene.scene.add.text(0, 0, "Version: 0.2.2")
        let gameLevel = new GameLevel(this, this.levelConfig)
    }

}