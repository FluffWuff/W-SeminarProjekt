import { GameLevel } from "../level/Levels.js";
import { LEVEL_3_GAME_LEVEL_CONFIG, MA_BACKGROUND_32, MA_BACKGROUND_64 } from "../util/Constants.js";
export class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: "StartScene"
        });
    }
    init() {
    }
    preload() {
        this.load.image(MA_BACKGROUND_32, 'assets/bitmaps/ma32.png');
        this.load.image(MA_BACKGROUND_64, 'assets/bitmaps/ma64.png');
    }
    create() {
        let gameLevel = new GameLevel(this, LEVEL_3_GAME_LEVEL_CONFIG);
    }
}
//# sourceMappingURL=StartScene.js.map