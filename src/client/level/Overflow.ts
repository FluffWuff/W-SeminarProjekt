import { DISTANCE_MA_OV_X, DISTANCE_MA_OV_Y, MA_BACKGROUND_64, MA_SELECTED_COLOR, MA_START_POS_X, MA_START_POS_Y, MA_WIDH, OV_COLOR, OV_FILL_COLOR } from "../util/Constants.js"
import { GameLevel } from "./Levels.js"

export class OverflowManager extends Phaser.GameObjects.Group {

    public currentOverflow = 0
    private overflowList: [[Phaser.GameObjects.Image, Phaser.GameObjects.Text]] = [[null, null]]
    
    private textElement: Phaser.GameObjects.Text

    constructor(private gameLevel: GameLevel, private maxOverflow: number) {
        super(gameLevel.scene)
        let overflowBasisX = MA_START_POS_X*this.scene.cameras.main.centerX*2+DISTANCE_MA_OV_X
        let overflowBasisY = MA_START_POS_Y*this.scene.cameras.main.centerY*2-DISTANCE_MA_OV_Y
        this.textElement = new Phaser.GameObjects.Text(gameLevel.scene, overflowBasisX, overflowBasisY, "overflow ("+this.currentOverflow+"/"+this.maxOverflow+")", {
            align: 'left',
            font: '20px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: "#"+OV_COLOR.toString(16),
        })
        
        this.add(this.textElement, true)
        for(var i = 0; i < maxOverflow; i++) {
            let style = {       
                align: 'center',
                font: '64px DS-DIGII',
            }
            let overflowFieldTextElement = new Phaser.GameObjects.Text(gameLevel.scene, overflowBasisX + MA_WIDH*i*1.025, overflowBasisY+20, "", style)
            let imageElement = gameLevel.scene.make.image({
                x: overflowBasisX + MA_WIDH*i*1.025,
                y: overflowBasisY+55,
                key: MA_BACKGROUND_64,
                add: true
            })
            imageElement.setPosition(imageElement.x+32, imageElement.y)
            let center64 = overflowFieldTextElement.getCenter()
            overflowFieldTextElement.setFontSize(48)
            overflowFieldTextElement.setOrigin(0.5, 0.5)
            overflowFieldTextElement.setPosition(center64.x+32, center64.y)
            this.overflowList[i] = [imageElement, overflowFieldTextElement]

            this.add(overflowFieldTextElement, true)
            this.add(imageElement, true)
        }
        this.scene.add.existing(this)
    }

    public addElementToOverflow(text: string) {
        this.currentOverflow++
        if(this.currentOverflow > this.maxOverflow) {
            this.gameLevel.loose()
            return
        }
        this.textElement.setText("overflow ("+this.currentOverflow+"/"+this.maxOverflow+")")
        this.overflowList[this.currentOverflow-1][0].setTint(OV_FILL_COLOR)
        this.overflowList[this.currentOverflow-1][1].setText(text).setTint(OV_FILL_COLOR)
    }

}

export class OverflowObject {

    constructor(scene: Phaser.Scene, x: number, y: number, content: string, overflowManager: OverflowManager) {
        let imageElement = scene.make.image({
            x: x,
            y: y,
            key: MA_BACKGROUND_64,
            add: true
        })
        overflowManager.add(imageElement, true)
    }

}