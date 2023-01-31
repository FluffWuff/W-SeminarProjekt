import { DISTANCE_MA_OV_X, DISTANCE_MA_OV_Y, MA_START_POS_X, MA_START_POS_Y, OV_COLOR } from "../util/Constants"

export class Overflow extends Phaser.GameObjects.Group {

    private currentOverflow = 0

    constructor(scene: Phaser.Scene, private maxOverflow: number) {
        super(scene)
        let textElement = new Phaser.GameObjects.Text(scene, MA_START_POS_X*this.scene.cameras.main.centerX*2+DISTANCE_MA_OV_X,
            MA_START_POS_Y*this.scene.cameras.main.centerY*2-DISTANCE_MA_OV_Y, "overflow ("+this.currentOverflow+"/"+this.maxOverflow+")", {
            align: 'left',
            font: '20px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: "#"+OV_COLOR.toString(16)
        })
        
    }

}