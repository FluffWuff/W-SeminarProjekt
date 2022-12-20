export class Button extends Phaser.GameObjects.Text {

    constructor(scene: Phaser.Scene, x: number, y: number, backgroundColor: string, text: string,callback: () => void) {
        super(scene, x, y, text, {});
        this.setStyle({ backgroundColor: backgroundColor, color: "#ffffff", fontFamily: 'Arial', fontSize: "30px" });

        scene.add.existing(this);

        this.setPadding(10).setInteractive({ useHandCursor: true });

        this.on('pointerdown', () => callback());
        this.on('pointerover', () => this.setStyle({ fill: '#f39c12' }), this)
        this.on('pointerout', () => this.setStyle({ fill: '#FFF' }), this);
        console.log("Button " + this.text + " wurde instanziert.");

    }


    destroy(fromScene?: boolean): void {
        console.log("Button " + this.text + " wurde zerstört.");
    }


}