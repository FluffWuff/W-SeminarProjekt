import { GameLevel } from "../level/Levels.js";
import { GF_BACKGROUND_32, GF_BACKGROUND_64, GF_PRIMARY_COLOR, GF_SELECTED_COLOR } from "./Constants.js";

export class Button extends Phaser.GameObjects.Group {

    constructor(gameLevel: GameLevel, x: number, y: number, public text: string, public isSmall: boolean) {
        super(gameLevel.scene);
        
        let key = GF_BACKGROUND_64
        let fontSize = 48

        if(isSmall) {
            key = GF_BACKGROUND_32
            fontSize = 24
        }

        let style = {       
            align: 'center',
            font: '64px DS-DIGII',
        }
        let textElement = new Phaser.GameObjects.Text(gameLevel.scene, x, y, text, style)
        let imageElement = gameLevel.scene.make.image({
            x: x,
            y: y,
            key: key,
            add: true
        })
        
        imageElement.setPosition(imageElement.x+32, imageElement.y+32)
        //textElement.setPosition(imageElement.x, imageElement.y)
        let centerTextElement = textElement.getCenter()
        textElement.setFontSize(fontSize)
        textElement.setOrigin(0.5, 0.5)
        textElement.setPosition(centerTextElement.x, centerTextElement.y)
        
        this.add(textElement, true)
        this.add(imageElement, true)
        this.setTint(parseInt(GF_PRIMARY_COLOR.toString(16), 16));
                
        gameLevel.scene.add.existing(this);

        //pointerover, pointerdown, pointerout
        imageElement.setInteractive().on('pointerover', (pointer, localX, localY, event) => {
            gameLevel.onOver(this)
        })
        imageElement.setInteractive().on('pointerdown', (pointer, localX, localY, event) => {
            gameLevel.onDown(this)
        })
        imageElement.setInteractive().on('pointerout', (pointer, localX, localY, event) => {
            gameLevel.onOut(this)
        })
    }

    destroy(fromScene?: boolean): void {
        super.destroy(true, true)
    }

}