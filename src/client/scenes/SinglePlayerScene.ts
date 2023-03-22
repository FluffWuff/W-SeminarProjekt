export class SinglePlayerScene extends Phaser.Scene {

    constructor() {
        super({
            key: "SinglePlayerScreen"
        })
    }

    init() {

    }

    preload() {

    }

    create() {
        let singlePlayerText = this.add.text(100, 100, "help")
    }


}