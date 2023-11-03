import { GameDefaultShaderPipeline } from '../shader/GameShaderPipeline.js';
import { GeneralButton } from '../util/GeneralButton.js';
import { isShaderOn } from './SelectionScene.js';
import { GF_HIDE_COLOR, GF_SELECTED_COLOR, GF_PRIMARY_COLOR, OV_FILL_COLOR } from '../util/Constants.js';
export class EndingScene extends Phaser.Scene {

    isGameWon: boolean

    constructor() {
        super({
            key: "EndingScene"
        })
    }

    init(data) {
        this.isGameWon = data.isGameWon
    }

    preload() {

    }

    create() {
        if(isShaderOn) this.cameras.main.setPostPipeline(GameDefaultShaderPipeline)

        let memoryMatrix = this.add.text((1920 / 2)-1, 400 - 35, "", {
            //align: 'center',
            font: '64px DS-DIGII',
            shadow: {
                fill: true,
                stroke: true,
                offsetX: 5,
                offsetY: 5,
            }
        })
        memoryMatrix.setOrigin(0.5, 0)
        if(this.isGameWon) {
            memoryMatrix.setText("YOU HACKED SUCCESSFULLY")
            memoryMatrix.setTint(parseInt(GF_PRIMARY_COLOR.toString(16), 16))
            memoryMatrix.setShadowColor("#"+GF_HIDE_COLOR.toString(16))
        } else {
            memoryMatrix.setText("YOU FAILED THE HACK...")
            memoryMatrix.setTint(parseInt(OV_FILL_COLOR.toString(16), 16))
            memoryMatrix.setShadowColor("#"+OV_FILL_COLOR.toString(16))    
        }


        let backToTheMainMenu = new GeneralButton(this, (1920 / 2) - 1, 800, "Main Menu", () => {
            this.scene.start("SelectionScene")
        }, 54)
    }


}