import { SELECTION_TEXT_Y } from "../util/Constants"
import { DISTANCE_SINGLE_MULTI_PLAYER_TEXT_X } from "../util/Constants"
import { SELECTION_TEXT_SIZE_PX } from "../util/Constants"
import { SINGLE_PLAYER_TEXT_X } from "../util/Constants"
import { greenPrimaryColor } from "../util/Constants"

export class SelectioScene extends Phaser.Scene {

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
        let singlePlayerText = this.scene.add.text(SINGLE_PLAYER_TEXT_X, SELECTION_TEXT_Y, "Singleplayer", {
            align: 'left',
            font: SELECTION_TEXT_SIZE_PX+'px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: "#"+greenPrimaryColor.toString(16)
        })
        let multiPlayerText = this.scene.add.text(SINGLE_PLAYER_TEXT_X+SELECTION_TEXT_SIZE_PX+DISTANCE_SINGLE_MULTI_PLAYER_TEXT_X, SELECTION_TEXT_Y, "Multiplayer (WIP)", {
            align: 'left',
            font: SELECTION_TEXT_SIZE_PX+'px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: "#"+greenPrimaryColor.toString(16)
        })
        //FIND EVENT
    }

}