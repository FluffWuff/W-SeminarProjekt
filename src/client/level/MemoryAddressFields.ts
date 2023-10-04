import { Button } from "../util/Button.js";
import { GameLevel } from "./Levels.js";

export class RoutineField extends Button {

    public isClickedDown = false
    public nextRoutineField: RoutineField = null
    public routineLineNumber: number = null
    public isDestroyed: boolean = false

    constructor(gameLevel: GameLevel, x: number, y: number, public text: string, public routinePos: number) {
        super(gameLevel, x, y, text, true)
    }

    destroy() {
        this.isDestroyed = true
        super.destroy()
    }

}

export class GridField extends Button {
    constructor(gameLevel: GameLevel, x: number, y: number, public text: string, public gridPosX: number, public gridPosY: number) {
        super(gameLevel, x, y, text, false)
    }
}