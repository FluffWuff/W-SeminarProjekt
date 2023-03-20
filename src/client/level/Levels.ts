import { DISTANCE_MA_RO, GR_START_POS_X, GR_START_POS_Y, MA_HEIGHT, MA_START_POS_X, MA_START_POS_Y, MA_PRIMARY_COLOR, MA_WIDH, RO_HEIGHT, RO_WIDTH, DISTANCE_MA_OV_X, DISTANCE_MA_OV_Y, OV_COLOR, MA_SELECTED_COLOR, MA_HIDE_COLOR, MA_HIGHLIGHT_COLOR, MA_HIDE_SELECTED_COLOR } from "../util/Constants.js"
import { Button } from "../util/Button.js"
import { OverflowManager } from "./Overflow.js"
import { RoutineField, GridField } from './MemoryAddressFields.js';
import { isJsxFragment } from "../../../node_modules/typescript/lib/typescript.js";

type MemoryAddress = Button

export class GameLevel implements ButtonListener {

    public currentTimer: number
    public grid: GridField[][]

    public routines: RoutineField[][] = []

    private overflow: OverflowManager

    private changeableElementList: MemoryAddress[] = []

    private isPlayLineHorizontal = true
    private playLinePos: [number, GridField[]] = [0, []]
    private legalGridField: GridField = null

    private playableRoutines: RoutineField[] = []
    private completedRoutines: RoutineField[][] = []
    constructor(public scene: Phaser.Scene, private levelConfig: GameLevelConfig) {
        this.grid = []

        this.fillGridUp()
        this.createRoutines()
        this.overflow = new OverflowManager(this, this.levelConfig.maxOverflow)
        this.createTimer()
        this.createDetails()
        this.updatePlayLine(0)
    }

    public win() {
        this.scene.scene.start("SinglePlayerScreen")

    }

    public loose() {
        console.log("VERLOREN")
        this.scene.scene.start("SinglePlayerScreen")
    }

    private fillGridUp() {
        let gridText = this.scene.add.text(MA_START_POS_X * this.scene.cameras.main.centerX * 2, MA_START_POS_Y * this.scene.cameras.main.centerY * 2, "memory matrix", {
            align: 'left',
            font: '24px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: "#" + MA_PRIMARY_COLOR.toString(16)
        })
        for (var i = 0; i < this.levelConfig.rows; i++) {
            this.grid[i] = []
            for (var j = 0; j < this.levelConfig.columns; j++) {
                this.grid[i][j] = this.createMemoryAddress(MA_WIDH * j * 1.025 + MA_START_POS_X * this.scene.cameras.main.centerX * 2,
                    MA_HEIGHT * i * 1.025 + MA_START_POS_Y * this.scene.cameras.main.centerY * 2 + 25, false, null, j, i) as GridField
            }
        }
    }

    // NICHT ANFASSEN
    private createRoutines() {
        //Anzahl der Routinen
        let amount = Math.round(Math.random() * (this.levelConfig.maxRoutines - this.levelConfig.minRoutines) + this.levelConfig.minRoutines)
        let routineText = this.scene.add.text(MA_WIDH * this.levelConfig.columns * 1.025 + MA_START_POS_X * this.scene.cameras.main.centerX * 2 + DISTANCE_MA_RO,
            MA_START_POS_Y * this.scene.cameras.main.centerY * 2, "override routines", {
            align: 'left',
            font: '16px DS-DIGII',
            color: "#" + MA_PRIMARY_COLOR.toString(16)
        })
        for (var i = 0; i < amount; i++) {
            this.routines[i] = []
            let isVer = Math.random() < 0.5
            let lastH = Math.floor(this.levelConfig.columns * Math.random())
            let lastV = Math.floor(this.levelConfig.rows * Math.random())
            //console.log("Creating new Routine with startH " + lastH + " and startV " + lastV)
            var lastRoutineField: RoutineField = null
            for (var j = 0; j < Math.round(Math.random() * (this.levelConfig.maxRoutineLength - this.levelConfig.minRoutineLength) + this.levelConfig.minRoutineLength); j++) {
                let text = this.grid[lastV][lastH].text
                let currentRoutineField = this.createMemoryAddress(
                    RO_WIDTH * j * 1.025 + MA_WIDH * this.levelConfig.columns * 1.025 + MA_START_POS_X * this.scene.cameras.main.centerX * 2 + DISTANCE_MA_RO - 16,
                    RO_HEIGHT * i * 1.025 + MA_START_POS_Y * this.scene.cameras.main.centerY * 2, true, text, j) as RoutineField

                currentRoutineField.routineLineNumber = i

                if (lastRoutineField != null)
                    lastRoutineField.nextRoutineField = currentRoutineField
                lastRoutineField = currentRoutineField
                this.routines[i][j] = currentRoutineField
                if (isVer) {
                    let newV = Math.floor(this.levelConfig.rows * Math.random())
                    while (newV == lastV) newV = Math.floor(this.levelConfig.rows * Math.random())
                    lastV = newV
                } else {
                    let newH = Math.floor(this.levelConfig.columns * Math.random())
                    while (newH == lastH) newH = Math.floor(this.levelConfig.columns * Math.random())
                    lastH = newH
                }
                //console.log("Next h: " + lastH + " v: "+ lastV)
                isVer = !isVer
            }
        }

    }

    private createTimer() {

    }

    private createDetails() {

    }

    private updatePlayLine(pos: number) {
        //Alte play line zurücksetzen 
        for (var i = 0; i < this.playLinePos[1].length; i++) {
            this.playLinePos[1][i].setTint(MA_PRIMARY_COLOR)
        }
        this.playLinePos[1] = []

        //neue play line setzen
        this.playLinePos[0] = pos
        if (this.isPlayLineHorizontal) {
            let rowFieldList = this.grid[pos]
            for (var i = 0; i < rowFieldList.length; i++) {
                rowFieldList[i].setTint(MA_SELECTED_COLOR)
                this.playLinePos[1].push(rowFieldList[i])
            }
        } else {
            for (var i = 0; i < this.grid.length; i++) {
                let playableButton = this.grid[i][pos]

                playableButton.setTint(MA_SELECTED_COLOR)
                this.playLinePos[1].push(playableButton)

            }
        }
    }

    onOver(button: Button) {
        //hides all fields not matching the same value in the grid - highlighting only fields who match
        //responsible for managing the highlighting if hoverd over a routine field
        if (button instanceof RoutineField) {
            for (var i = 0; i < this.grid.length; i++) {
                for (var j = 0; j < this.grid[i].length; j++) {
                    let gridElement = this.grid[i][j]

                    if (button.text != gridElement.text) {
                        this.changeableElementList.push(gridElement)
                        gridElement.setTint(MA_HIDE_COLOR)
                    }
                    if ((!this.isPlayLineHorizontal && this.playLinePos[0] == gridElement.gridPosX) ||
                        (this.isPlayLineHorizontal && this.playLinePos[0] == gridElement.gridPosY)) {
                        //console.log(gridElement.text)
                        if (button.text == gridElement.text) {
                            gridElement.setTint(MA_SELECTED_COLOR)
                        } else {
                            gridElement.setTint(MA_HIDE_SELECTED_COLOR)
                        }
                    }
                }
            }
            return;
        }

        let gridField = <GridField>button
        //responsible for 
        //adds highlighting effect - indicating next playLine
        if (!this.isPlayLineHorizontal) {
            let rowFieldList = this.grid[gridField.gridPosY]
            for (var i = 0; i < rowFieldList.length; i++) {
                let changeableButton = rowFieldList[i]
                if (changeableButton.gridPosX != this.playLinePos[0]) {
                    changeableButton.setTint(MA_HIGHLIGHT_COLOR)
                    this.changeableElementList.push(changeableButton)
                }
            }
        } else {
            for (var i = 0; i < this.grid.length; i++) {
                let changeableButton = this.grid[i][gridField.gridPosX]
                if (changeableButton.gridPosY != this.playLinePos[0]) {
                    this.changeableElementList.push(changeableButton)
                    changeableButton.setTint(MA_HIGHLIGHT_COLOR)
                }
            }
        }

        //highlighting matching fields in the routine
        // TODO
        // if hovered field is in playline && in routine front -> highlight (yellow) routine field
        for (var i = 0; i < this.routines.length; i++) {
            var howMuchIsClickedDown = 0
            var startRoutineField = this.routines[i][0]
            do {
                if (startRoutineField.isClickedDown) howMuchIsClickedDown++
                startRoutineField = startRoutineField.nextRoutineField
            } while (startRoutineField.nextRoutineField != null)
            for (var j = howMuchIsClickedDown; j < this.routines[i].length; j++) {
                let currentRoutineField = this.routines[i][j]
                if (gridField.text == currentRoutineField.text && !currentRoutineField.isClickedDown && j == howMuchIsClickedDown) {
                    this.changeableElementList.push(currentRoutineField)
                    currentRoutineField.setTint(MA_SELECTED_COLOR)

                    //ADD more data for onDown() call
                    // - all current routines
                    // - current routines pos
                    // - all current routine fields
                    this.legalGridField = gridField
                    this.playableRoutines.push(currentRoutineField)
                }
            }
        }

        //highlighting/indicating the current hoverd button/memoryadress - not original but makes it easier to play with
        button.setTint(MA_SELECTED_COLOR)
    }

    onDown(button: Button) {
        if (button instanceof RoutineField) return
        let gridField = <GridField>button
        console.log(this.playableRoutines)
        //IF YES -> ILLEGAL move
        if (this.legalGridField == null) {
            console.log("ILLEGAL MOVE!!!!")
            //reset all non-completed routines
            this.overflow.addElementToOverflow(gridField.text)
            for (var i = 0; i < this.routines.length; i++) {
                for (var j = 0; j < this.routines[i].length; j++) {
                    if (typeof this.completedRoutines[i] != undefined) continue
                    console.log(this.completedRoutines[i])

                    this.routines[i][j].isClickedDown = false
                    this.routines[i][j].setTint(MA_PRIMARY_COLOR)

                }
            }
        }
        // IF YES -> LEGAL MOVE
        else if ((this.legalGridField != null) || (gridField.gridPosX == this.legalGridField.gridPosX && gridField.gridPosY == this.legalGridField.gridPosY && gridField.text == this.legalGridField.text)) {
            console.log("Legal Move!")
            //1. routine
            for (var i = 0; i < this.playableRoutines.length; i++) {
                this.playableRoutines[i].setTint(MA_HIDE_COLOR)
                this.playableRoutines[i].isClickedDown = true
                console.log("Clickeddown successfully: " + this.playableRoutines[i].text)
                this.changeableElementList.pop()

                // this.changeableElementList[this.changeableElementList.indexOf(this.playableRoutines[i])] = null
                //console.log(this.playableRoutines[i].nextRoutineField)
                if (this.playableRoutines[i].nextRoutineField == null) {
                    console.log("Routine fertig, routineLineNumber: " + this.playableRoutines[i].routineLineNumber)
                    this.completedRoutines[this.playableRoutines[i].routineLineNumber] = this.routines[this.playableRoutines[i].routineLineNumber]
                    //this.routines[this.playableRoutines[i].routineLineNumber] = [] 

                    if (this.completedRoutines.length == this.routines.length) {
                        this.win()
                    }
                }

            }

        }
        var newPos = 0
        if (this.isPlayLineHorizontal) newPos = gridField.gridPosX
        else newPos = gridField.gridPosY

        this.isPlayLineHorizontal = !this.isPlayLineHorizontal
        this.updatePlayLine(newPos)
        console.log(gridField.text)
    }

    onOut(button: Button) {
        if (button.isSmall || this.changeableElementList.length != 0) {
            for (var i = 0; i < this.changeableElementList.length; i++) {
                this.changeableElementList[i].setTint(MA_PRIMARY_COLOR)
                if (button instanceof RoutineField) {
                    let routineField = <RoutineField>button
                    if (routineField.isClickedDown) routineField.setTint(MA_HIDE_COLOR)
                }
            }
            this.changeableElementList = []
        }
        this.playableRoutines = []
        this.legalGridField = null
        this.updatePlayLine(this.playLinePos[0])
    }

    private createMemoryAddress(x: number, y: number, isSmall: boolean, text?: string, gridPosX?: number, gridPosY?: number, routinePos?: number, nextRoutineField?: RoutineField): MemoryAddress {
        if (text == null) {
            let number = Math.round(Math.random() * (8 - 2) + 2)
            let letters = ["A", "B", "C", "D", "E", "F", "X"] //REWORK - BALANCE
            let letter = letters[Math.floor(Math.random() * letters.length)]
            text = letter + number
        }
        if (isSmall) return new RoutineField(this, x, y, text, routinePos)
        else return new GridField(this, x, y, text, gridPosX, gridPosY)
    }

}

export type GameLevelConfig = {
    rows: number,
    columns: number,
    maxTime: number,
    maxOverflow: number,
    minRoutines: number,
    maxRoutines: number,
    minRoutineLength: number,
    maxRoutineLength: number
}

interface ButtonListener {

    onOver(button: Button);

    onDown(button: Button);

    onOut(button: Button);

}