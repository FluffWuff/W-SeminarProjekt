import { GameDefaultShaderPipeline } from "../shader/GameShaderPipeline.js";
import { GameLevelConfig, LEVEL_1_GAME_LEVEL_CONFIG, LEVEL_2_GAME_LEVEL_CONFIG, LEVEL_3_GAME_LEVEL_CONFIG, LEVEL_4_GAME_LEVEL_CONFIG, LEVEL_5_GAME_LEVEL_CONFIG, MA_HIDE_COLOR, MA_HIDE_SELECTED_COLOR, MA_PRIMARY_COLOR, MA_SELECTED_COLOR } from "../util/Constants.js"
import { TestPipeline } from "../shader/TestShader.js";

export class SelectionScene extends Phaser.Scene {

    constructor() {
        super({
            key: "SelectionScene"
        })
    }

    init() {

    }

    create() {
        this.cameras.main.setPostPipeline(GameDefaultShaderPipeline);
        let level1Box = new SelectionButton(this, 1920 / 2, 200, "Level 1", LEVEL_1_GAME_LEVEL_CONFIG)
        let level2Box = new SelectionButton(this, 1920 / 2, 300, "Level 2", LEVEL_2_GAME_LEVEL_CONFIG)
        let level3Box = new SelectionButton(this, 1920 / 2, 400, "Level 3", LEVEL_3_GAME_LEVEL_CONFIG)
        let level4Box = new SelectionButton(this, 1920 / 2, 500, "Level 4", LEVEL_4_GAME_LEVEL_CONFIG)
        let level5Box = new SelectionButton(this, 1920 / 2, 600, "Level 5", LEVEL_5_GAME_LEVEL_CONFIG)
    }

}

class SelectionButton extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, levelGameConfig: GameLevelConfig) {
        super(scene)

        let rectangle = this.scene.add.rectangle(x, y, 220, 75)

        rectangle.setFillStyle(MA_HIDE_COLOR)
        rectangle.setStrokeStyle(1, MA_PRIMARY_COLOR)

        let textElement = this.scene.add.text(x - 105, y - 35, text, {
            align: 'center',
            font: '64px DS-DIGII',
        })
        this.add(textElement)
        this.add(rectangle)
        textElement.setTint(parseInt(MA_PRIMARY_COLOR.toString(16), 16))

        textElement.setInteractive().on('pointerover', (pointer, localX, localY, event) => {
            rectangle.strokeColor = MA_SELECTED_COLOR
            rectangle.setFillStyle(MA_HIDE_SELECTED_COLOR)
            textElement.setTint(MA_SELECTED_COLOR)
        })
        textElement.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
            this.scene.scene.start("GameScene", levelGameConfig)
        })
        textElement.setInteractive().on('pointerout', (pointer, localX, localY, event) => {
            rectangle.strokeColor = MA_PRIMARY_COLOR
            rectangle.setFillStyle(MA_HIDE_COLOR)
            textElement.setTint(MA_PRIMARY_COLOR)
        })


        scene.add.existing(this)
    }

}