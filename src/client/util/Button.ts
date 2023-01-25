import { MA_BACKGROUND_32, MA_BACKGROUND_64, MA_PRIMARY_COLOR, MA_SELECTED_COLOR } from "./Constants.js";

export class Button extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, x: number, y: number, public text: string, isSmall: boolean, style: object, callback: () => void) {
        super(scene);
        
        let key = MA_BACKGROUND_64
        let fontSize = 48

        if(isSmall) {
            key = MA_BACKGROUND_32
            fontSize = 24
        }

        let textElement = new Phaser.GameObjects.Text(scene, x, y, text, style)
        let imageElement = scene.make.image({
            x: x,
            y: y,
            key: key,
            add: true
        })
        
        imageElement.setPosition(imageElement.x+32, imageElement.y+32)
        //textElement.setPosition(imageElement.x, imageElement.y)
        let center64 = textElement.getCenter()
        textElement.setFontSize(fontSize)
        textElement.setOrigin(0.5, 0.5)
        textElement.setPosition(center64.x, center64.y)
        
        this.add(textElement, true)
        this.add(imageElement, true)
        this.setTint(parseInt(MA_PRIMARY_COLOR.toString(16), 16));
        
        scene.add.existing(this);

        //find onclick event:
        //https://phaser.io/examples/v2/text/text-events
        
        //this.on('pointerdown', () => callback());
        //textElement.on('pointerover', () => this.setTint(parseInt(MA_SELECTED_COLOR.toString(16), 16)), this)
        //textElement.on('pointerout', () => this.setTint(parseInt(MA_PRIMARY_COLOR.toString(16), 16)), this);
        //console.log("Button " + text + " wurde instanziert.");

    }


    destroy(fromScene?: boolean): void {}


}