import { DISTANCE_MA_OV_X, DISTANCE_MA_OV_Y, MA_BACKGROUND_64, MA_START_POS_X, MA_START_POS_Y, MA_WIDH, OV_COLOR } from "../util/Constants.js"

export class OverflowManager extends Phaser.GameObjects.Group {

    private currentOverflow = 0
    private overflowList = []
    
    constructor(scene: Phaser.Scene, private maxOverflow: number) {
        super(scene)
        let overflowBasisX = MA_START_POS_X*this.scene.cameras.main.centerX*2+DISTANCE_MA_OV_X
        let overflowBasisY = MA_START_POS_Y*this.scene.cameras.main.centerY*2-DISTANCE_MA_OV_Y
        let textElement = new Phaser.GameObjects.Text(scene, overflowBasisX, overflowBasisY, "overflow ("+this.currentOverflow+"/"+this.maxOverflow+")", {
            align: 'left',
            font: '20px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: "#"+OV_COLOR.toString(16),
        })
        this.add(textElement, true)
        for(var i = 0; i < maxOverflow; i++) {
            let imageElement = scene.make.image({
                x: overflowBasisX + MA_WIDH*i*1.025,
                y: overflowBasisY+55,
                key: MA_BACKGROUND_64,
                add: true
            })
            imageElement.setPosition(imageElement.x+32, imageElement.y)
            this.overflowList[i] = imageElement
            this.add(imageElement, true)
        }
        this.scene.add.existing(this)
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