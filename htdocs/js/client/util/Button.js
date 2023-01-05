import { MA_BACKGROUND_32, MA_BACKGROUND_64, MA_BACKGROUND_COLOR } from "./Constants.js";
export class Button extends Phaser.GameObjects.Group {
    constructor(scene, x, y, text, isSmall, style, callback) {
        super(scene);
        let key = MA_BACKGROUND_64;
        let fontSize = 48;
        if (isSmall) {
            key = MA_BACKGROUND_32;
            fontSize = 24;
        }
        let textElement = new Phaser.GameObjects.Text(scene, x, y, text, style);
        let imageElement = scene.make.image({
            x: x,
            y: y,
            key: key,
            add: true
        });
        imageElement.setPosition(imageElement.x + 32, imageElement.y + 32);
        //textElement.setPosition(imageElement.x, imageElement.y)
        let center64 = textElement.getCenter();
        textElement.setFontSize(fontSize);
        textElement.setOrigin(0.5, 0.5);
        textElement.setPosition(center64.x, center64.y);
        imageElement.setTint(MA_BACKGROUND_COLOR);
        this.add(textElement, true);
        this.add(imageElement, true);
        //this.setStyle(style);
        scene.add.existing(this);
        //this.on('pointerdown', () => callback());
        //this.on('pointerover', () => this.setStyle({ fill: '#f39c12' }), this)
        //this.on('pointerout', () => this.setStyle({ fill: '#FFF' }), this);
        console.log("Button " + text + " wurde instanziert.");
    }
    destroy(fromScene) { }
}
//# sourceMappingURL=Button.js.map