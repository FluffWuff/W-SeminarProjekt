import { GF_HIDE_COLOR, GF_PRIMARY_COLOR, GF_SELECTED_COLOR, GF_HIDE_SELECTED_COLOR } from "./Constants.js"

export class GeneralButton extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, pointerDown: Function, textSize?: number) {
        super(scene)
        if(textSize == undefined) textSize = 64
        let rectangle = this.scene.add.rectangle(x, y, 220, 75)

        rectangle.setFillStyle(GF_HIDE_COLOR)
        rectangle.setStrokeStyle(1, GF_PRIMARY_COLOR)

        let textElement = this.scene.add.text(x - 105, y - 35, text, {
            align: 'center',
            font: textSize+'px DS-DIGII',
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
            pointerDown()
        })

        rectangle.setInteractive().on('pointerout', (pointer, localX, localY, event) => {
            rectangle.strokeColor = GF_PRIMARY_COLOR
            rectangle.setFillStyle(GF_HIDE_COLOR)
            textElement.setTint(GF_PRIMARY_COLOR)
        })


        scene.add.existing(this)
    }

}