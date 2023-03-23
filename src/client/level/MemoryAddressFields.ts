import Phaser from "phaser"

import { Button } from "../util/Button"
import { GameLevel } from "./Levels"

export class RoutineField extends Button {

    public isClickedDown = false
    public nextRoutineField: RoutineField = null
    public routineLineNumber: number = null

    constructor(gameLevel: GameLevel, x: number, y: number, public text: string, public routinePos: number) {
        super(gameLevel, x, y, text, true)
    }

}

export class GridField extends Button {
    constructor(gameLevel: GameLevel, x: number, y: number, public text: string, public gridPosX: number, public gridPosY: number) {
        super(gameLevel, x, y, text, false)
    }
}