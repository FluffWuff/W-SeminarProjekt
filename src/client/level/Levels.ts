import { DISTANCE_MA_RO, GR_START_POS_X, GR_START_POS_Y, MA_HEIGHT, MA_START_POS_X, MA_START_POS_Y, MA_PRIMARY_COLOR, MA_WIDH, RO_HEIGHT, RO_WIDTH, DISTANCE_MA_OV_X, DISTANCE_MA_OV_Y, OV_COLOR, MA_SELECTED_COLOR, MA_HIDE_COLOR, MA_HIGHLIGHT_COLOR, MA_HIDE_SELECTED_COLOR } from "../util/Constants.js"
import { Button } from "../util/Button.js"
import { OverflowManager } from "./Overflow.js"

type MemoryAddress = Button

export class GameLevel implements ButtonListener {

    public currentTimer: number
    public grid: MemoryAddress[][]

    public routines: MemoryAddress[][] = []

    private currentOverflow = 0
    private overflow: OverflowManager
    private overflowText: Phaser.GameObjects.Text

    private changeableElementList: MemoryAddress[] = []

    private isPlayLineHorizontal = true
    private playLinePos: [number, MemoryAddress[]] = [0, []]


    constructor(public scene: Phaser.Scene, private levelConfig: GameLevelConfig) {
        this.grid = []

        this.fillGridUp()
        this.createRoutines()
        this.overflow = new OverflowManager(this.scene, this.levelConfig.maxOverflow)
        this.createTimer()
        this.createDetails()
        this.updatePlayLine(0)
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
                    MA_HEIGHT * i * 1.025 + MA_START_POS_Y * this.scene.cameras.main.centerY * 2 + 25, false, j, i)
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
            for (var j = 0; j < Math.round(Math.random() * (this.levelConfig.maxRoutineLength - this.levelConfig.minRoutineLength) + this.levelConfig.minRoutineLength); j++) {
                let text = this.grid[lastV][lastH].text
                this.routines[i][j] = this.createMemoryAddress(
                    RO_WIDTH * j * 1.025 + MA_WIDH * this.levelConfig.columns * 1.025 + MA_START_POS_X * this.scene.cameras.main.centerX * 2 + DISTANCE_MA_RO - 16,
                    RO_HEIGHT * i * 1.025 + MA_START_POS_Y * this.scene.cameras.main.centerY * 2, true, -1, -1, text)
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

    private updateOverflow() {
        this.overflowText.setText("overflow (" + this.currentOverflow + "/" + this.levelConfig.maxOverflow + ")")
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
        if (button.isSmall) {
            for (var i = 0; i < this.grid.length; i++) {
                for (var j = 0; j < this.grid[i].length; j++) {
                    let gridElement = this.grid[i][j]
                    
                    if (button.text != gridElement.text) {
                        this.changeableElementList.push(gridElement)
                        gridElement.setTint(MA_HIDE_COLOR)
                    }
                    if((!this.isPlayLineHorizontal && this.playLinePos[0] == gridElement.gridPosX) ||
                     (this.isPlayLineHorizontal && this.playLinePos[0] == gridElement.gridPosY)) {
                        //console.log(gridElement.text)
                        if(button.text == gridElement.text) {
                            gridElement.setTint(MA_SELECTED_COLOR)
                        } else {
                            gridElement.setTint(MA_HIDE_SELECTED_COLOR)
                        }
                    }
                }
            }
            return;
        }

        //adds highlighting effect - indicating next playLine
        if (!this.isPlayLineHorizontal) {
            let rowFieldList = this.grid[button.gridPosY]
            for (var i = 0; i < rowFieldList.length; i++) {
                let changeableButton = rowFieldList[i]
                if (changeableButton.gridPosX != this.playLinePos[0]) {
                    changeableButton.setTint(MA_HIGHLIGHT_COLOR)
                    this.changeableElementList.push(changeableButton)
                }
            }
        } else {
            for (var i = 0; i < this.grid.length; i++) {
                let changeableButton = this.grid[i][button.gridPosX]
                if (changeableButton.gridPosY != this.playLinePos[0]) {
                    this.changeableElementList.push(changeableButton)
                    changeableButton.setTint(MA_HIGHLIGHT_COLOR)
                }
            }
        }

        //highlighting matching fields in the routine
        // TODO

        //highlighting/indicating the current hoverd button/memoryadress - not original but makes it easier to play with
        button.setTint(MA_SELECTED_COLOR)
    }

    onDown(button: Button) {

    }

    onOut(button: Button) {
        if (button.isSmall || this.changeableElementList.length != 0) {
            for (var i = 0; i < this.changeableElementList.length; i++) {
                this.changeableElementList[i].setTint(MA_PRIMARY_COLOR)
            }
            this.changeableElementList = []
        }
        this.updatePlayLine(this.playLinePos[0])
    }

    private createMemoryAddress(x: number, y: number, isSmall: boolean, gridPosX: number, gridPosY: number, text?: string): MemoryAddress {
        if (text == null) {
            let number = Math.round(Math.random() * (8 - 2) + 2)
            let letters = ["A", "B", "C", "D", "E", "F", "X"] //REWORK - BALANCE
            let letter = letters[Math.floor(Math.random() * letters.length)]
            text = letter + number
        }
        return new Button(this, x, y, text, isSmall, {
            align: 'center',
            font: '64px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,

        }, gridPosX, gridPosY)
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