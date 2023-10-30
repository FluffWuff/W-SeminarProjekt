import { GameDefaultShaderPipeline } from "../shader/GameShaderPipeline.js";
import { GameLevelConfig, LEVEL_1_GAME_LEVEL_CONFIG, LEVEL_2_GAME_LEVEL_CONFIG, LEVEL_3_GAME_LEVEL_CONFIG, LEVEL_4_GAME_LEVEL_CONFIG, LEVEL_5_GAME_LEVEL_CONFIG, GF_HIDE_COLOR, GF_HIDE_SELECTED_COLOR, GF_PRIMARY_COLOR, GF_SELECTED_COLOR } from "../util/Constants.js"
import { GeneralButton } from '../util/GeneralButton.js';

let isShaderOn = true

export class SelectionScene extends Phaser.Scene {

    constructor() {
        super({
            key: "SelectionScene"
        })
    }


    preload() {
        this.load.glsl('matrixshader', 'assets/shader/shader.frag')
    }

    init() {

    }
    create() {
        this.cameras.main.setPostPipeline(GameDefaultShaderPipeline)
        
        //Die x- und y-Koordinate mancher Buttons wurde um 1 Pixel verschoben,
        //damit diese nicht mit dem Shader kollidieren und abgeschnitten werden
        let level1Box = new LevelSelectionButton(this, (1920 / 2)-1, 199, "Level 1", LEVEL_1_GAME_LEVEL_CONFIG)
        let level2Box = new LevelSelectionButton(this, (1920 / 2)-1, 300, "Level 2", LEVEL_2_GAME_LEVEL_CONFIG)
        let level3Box = new LevelSelectionButton(this, (1920 / 2)-1, 400, "Level 3", LEVEL_3_GAME_LEVEL_CONFIG)
        let level4Box = new LevelSelectionButton(this, (1920 / 2)-1, 500, "Level 4", LEVEL_4_GAME_LEVEL_CONFIG)
        let level5Box = new LevelSelectionButton(this, (1920 / 2)-1, 600, "Level 5", LEVEL_5_GAME_LEVEL_CONFIG)

        //Shader toggle button:
        let toggleShader = new GeneralButton(this, (1920/2)-1, 699, "Shader", () => {
            if(isShaderOn) this.cameras.main.resetPostPipeline()
            else this.cameras.main.setPostPipeline(GameDefaultShaderPipeline)
            isShaderOn = !isShaderOn
        })
        
        //Tutorial:
        let tutorial = new GeneralButton(this, (1920/2)-1, 800, "Tutorial", () => {
            window.open("https://youtube.com")
        })
    }


}

class LevelSelectionButton extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, levelGameConfig: GameLevelConfig) {
        super(scene)

        let rectangle = this.scene.add.rectangle(x, y, 220, 75)

        rectangle.setFillStyle(GF_HIDE_COLOR)
        rectangle.setStrokeStyle(1, GF_PRIMARY_COLOR)

        let textElement = this.scene.add.text(x - 105, y - 35, text, {
            align: 'center',
            font: '64px DS-DIGII',
        })

        this.add(textElement)
        this.add(rectangle)

        textElement.setTint(parseInt(GF_PRIMARY_COLOR.toString(16), 16))

        rectangle.setInteractive().on('pointerover', (pointer, localX, localY, event) => {
            rectangle.strokeColor = GF_SELECTED_COLOR
            rectangle.setFillStyle(GF_HIDE_SELECTED_COLOR)
            textElement.setTint(GF_SELECTED_COLOR)

        })
        rectangle.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
            this.scene.scene.start("GameScene", {levelGameConfig: levelGameConfig, isShaderOn: isShaderOn})
        })

        rectangle.setInteractive().on('pointerout', (pointer, localX, localY, event) => {
            rectangle.strokeColor = GF_PRIMARY_COLOR
            rectangle.setFillStyle(GF_HIDE_COLOR)
            textElement.setTint(GF_PRIMARY_COLOR)

        })


        scene.add.existing(this)
    }

}