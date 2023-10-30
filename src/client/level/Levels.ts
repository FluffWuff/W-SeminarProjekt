import { DISTANCE_GF_RO, GR_START_POS_X, GR_START_POS_Y, GF_HEIGHT, GF_START_POS_X, GF_START_POS_Y, GF_PRIMARY_COLOR, GF_WIDH, RO_HEIGHT, RO_WIDTH, DISTANCE_GF_OV_X, DISTANCE_GF_OV_Y, OV_COLOR, GF_SELECTED_COLOR, GF_HIDE_COLOR, GF_HIGHLIGHT_COLOR, GF_HIDE_SELECTED_COLOR, GameLevelConfig } from "../util/Constants.js"
import { Button } from "../util/Button.js"
import { OverflowManager } from "./Overflow.js"
import { RoutineField, GridField } from './MemoryAddressFields.js';

type MemoryAddress = Button

export class GameLevel implements ButtonListener {

    public currentTimer: number
    public grid: GridField[][]

    public routines: RoutineField[][] = []

    private overflow: OverflowManager

    /**
     * Elemente (Gridfields, Routinefields), die bei onOver() oder onDown() geändert wurden
     * In onOut() werden diese Elemente in ihren Urzustand gebracht.
     */
    private changeableElementList: MemoryAddress[] = []


    private isPlayLineHorizontal = true
    /**
     * Die erste Zahl gibt den index der Linie innerhalb des Gridfields an
     * Diese Zahl ist unabhängig vom boolean @isPlayLineHorizontal
     * Das Zweite Element in diesem Pair ist die eine Kopie des Gridfields an der Stelle des index
     */
    private playLinePos: [number, GridField[]] = [0, []]
    
    private legalGridField: GridField = null

    private playableRoutines: RoutineField[] = []
    private completedRoutines: number = 0

    constructor(public scene: Phaser.Scene, private levelConfig: GameLevelConfig) {
        this.grid = []

        this.fillGridUp()
        this.createRoutines()
        this.overflow = new OverflowManager(this, this.levelConfig.maxOverflow)
        //this.createTimer()
        //this.createDetails()
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
        let gridText = this.scene.add.text(GF_START_POS_X * this.scene.cameras.main.centerX * 2, GF_START_POS_Y * this.scene.cameras.main.centerY * 2, "memory matrix", {
            align: 'left',
            font: '24px DS-DIGII',
            //backgroundColor: GF_BACKGROUND_COLOR,
            color: "#" + GF_PRIMARY_COLOR.toString(16)
        })
        for (var i = 0; i < this.levelConfig.rows; i++) {
            this.grid[i] = []
            for (var j = 0; j < this.levelConfig.columns; j++) {
                this.grid[i][j] = this.createMemoryAddress(GF_WIDH * j * 1.025 + GF_START_POS_X * this.scene.cameras.main.centerX * 2,
                    GF_HEIGHT * i * 1.025 + GF_START_POS_Y * this.scene.cameras.main.centerY * 2 + 25, false, null, j, i) as GridField
            }
        }
    }

    /**
     * Diese Funktion ist zuständig, um alle Routinen zu erstellen, sodass diese ineinander schlüssig und verkettet sind.
     */
    private createRoutines() {
        //Bestimmung der Anzahl der Routinen
        let routinenAmount = Math.round(Math.random() * (this.levelConfig.maxRoutines - this.levelConfig.minRoutines) + this.levelConfig.minRoutines)
        let routineText = this.scene.add.text(GF_WIDH * this.levelConfig.columns * 1.025 + GF_START_POS_X * this.scene.cameras.main.centerX * 2 + DISTANCE_GF_RO,
            GF_START_POS_Y * this.scene.cameras.main.centerY * 2, "override routines", {
            align: 'left',
            font: '16px DS-DIGII',
            color: "#" + GF_PRIMARY_COLOR.toString(16)
        })

        //Erstellung der einzelnen Routinen
        for (var i = 0; i < routinenAmount; i++) {
            this.routines[i] = []
            let isVer = Math.random() < 0.5 //Entscheide ob vertikal oder horizontal die Routine beginnen soll
            
            /**
             * Startpunkt der aller ersten Routinenfield in der Routine
             * lastH und lastV werden in der kommenden for-loop immer abwechselnd erneuert
             */
            let lastH = Math.floor(this.levelConfig.columns * Math.random())
            let lastV = Math.floor(this.levelConfig.rows * Math.random())
            console.log("Creating new Routine starting from startH " + lastH + " and startV " + lastV)

            let previousRoutineField: RoutineField = null

            //Bestimmung der momentanten Routinenlänge mit einer Mindestlänge
            let routinenLength = Math.round(Math.random() * (this.levelConfig.maxRoutineLength - this.levelConfig.minRoutineLength) + this.levelConfig.minRoutineLength)  
            for (var j = 0; j < routinenLength; j++) {
                let text = this.grid[lastV][lastH].text
                //Graphische Erstellung des Routinefields
                let currentRoutineField = this.createMemoryAddress(
                    RO_WIDTH * j * 1.025 + GF_WIDH * this.levelConfig.columns * 1.025 + GF_START_POS_X * this.scene.cameras.main.centerX * 2 + DISTANCE_GF_RO - 16,
                    RO_HEIGHT * i * 1.025 + GF_START_POS_Y * this.scene.cameras.main.centerY * 2, true, text, j) as RoutineField

                /**
                 * Hier wird das momentane Routinefield mit dem aktuellen Index der Routinenliste vergeben
                 * Ist für spätere Abfragen in onOver() und onDown() wichtig
                 */
                currentRoutineField.routineLineNumber = i

                //Setze die Referenz vom vorherigen Routinefield zum jetzigen Routinefield, wenn das jetzige nicht das letzte ist
                if (previousRoutineField != null)
                    previousRoutineField.nextRoutineField = currentRoutineField 
                previousRoutineField = currentRoutineField
                this.routines[i][j] = currentRoutineField

                //Bestimmung des neuen vertikalen oder horziontalen Wertes für die nächste Iterierung
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
                //Wechsel von horizontaler zur vertikalen und andersherum
                isVer = !isVer
            }
        }

    }


    private createTimer() {

    }

    private createDetails() {

    }

    private updatePlayLine(pos: number) {
        //Alte Spiellinie zurücksetzen 
        for (var i = 0; i < this.playLinePos[1].length; i++) {
            this.playLinePos[1][i].setTint(GF_PRIMARY_COLOR)
        }
        this.playLinePos[1] = []

        //Neue Spiellinie setzen
        this.playLinePos[0] = pos
        if (this.isPlayLineHorizontal) {
            let rowFieldList = this.grid[pos]
            for (var i = 0; i < rowFieldList.length; i++) {
                rowFieldList[i].setTint(GF_SELECTED_COLOR)
                this.playLinePos[1].push(rowFieldList[i])
            }
        } else {
            for (var i = 0; i < this.grid.length; i++) {
                let playableButton = this.grid[i][pos]

                playableButton.setTint(GF_SELECTED_COLOR)
                this.playLinePos[1].push(playableButton)

            }
        }
    }

    onOver(button: MemoryAddress) {
        //hides all fields not matching the same value in the grid - highlighting only fields who match
        //responsible for managing the highlighting if hoverd over a routine field
        if (button instanceof RoutineField) {
            for (var i = 0; i < this.grid.length; i++) {
                for (var j = 0; j < this.grid[i].length; j++) {
                    let gridElement = this.grid[i][j]

                    if (button.text != gridElement.text) {
                        this.changeableElementList.push(gridElement)
                        gridElement.setTint(GF_HIDE_COLOR)
                    }
                    if ((!this.isPlayLineHorizontal && this.playLinePos[0] == gridElement.gridPosX) ||
                        (this.isPlayLineHorizontal && this.playLinePos[0] == gridElement.gridPosY)) {
                        //console.log(gridElement.text)
                        if (button.text == gridElement.text) {
                            gridElement.setTint(GF_SELECTED_COLOR)
                        } else {
                            gridElement.setTint(GF_HIDE_SELECTED_COLOR)
                        }
                    }
                }
            }
            return;
        }

        let gridField = <GridField>button
        //responsible for indicating next playLine
        //adds highlighting effect
        if (!this.isPlayLineHorizontal) {
            let rowFieldList = this.grid[gridField.gridPosY]
            for (var i = 0; i < rowFieldList.length; i++) {
                let changeableButton = rowFieldList[i]
                if (changeableButton.gridPosX != this.playLinePos[0]) {
                    changeableButton.setTint(GF_HIGHLIGHT_COLOR)
                    this.changeableElementList.push(changeableButton)
                }
            }
        } else {
            for (var i = 0; i < this.grid.length; i++) {
                let changeableButton = this.grid[i][gridField.gridPosX]
                if (changeableButton.gridPosY != this.playLinePos[0]) {
                    this.changeableElementList.push(changeableButton)
                    changeableButton.setTint(GF_HIGHLIGHT_COLOR)
                }
            }
        }

        this.calculateLegalField(gridField)


        //highlighting/indicating the current hoverd button/memoryadress - not original but makes it easier to play with
        button.setTint(GF_SELECTED_COLOR)
    }

    onDown(button: MemoryAddress) {
        if (button instanceof RoutineField) return
        let gridField = <GridField>button
        console.log(this.playableRoutines)

        //check if button press is within yellow playline
        console.log("Playline is horizontal: " + this.isPlayLineHorizontal + ", pos: " + this.playLinePos[0])
        console.log()
        if (this.isPlayLineHorizontal && gridField.gridPosY == this.playLinePos[0]) {
            this.calculateMove(gridField.gridPosX, this.playLinePos[0])
            console.log("Calculated actual move")
            return
        } else if (gridField.gridPosX == this.playLinePos[0]) {
            this.calculateMove(this.playLinePos[0], gridField.gridPosY)
            console.log("Calculated actual move")
            return
        }

        console.log("Move was outside of playline - Calculating pre-move...")
        if (this.isPlayLineHorizontal) {
            this.calculateMove(gridField.gridPosX, this.playLinePos[0]) //Pre-Move
        } else {
            this.calculateMove(this.playLinePos[0], gridField.gridPosY) //Pre-Move
        }
        console.log("Calculated Pre-Move")
        this.calculateMove(gridField.gridPosX, gridField.gridPosY) //Actual Move
        console.log("Calculated actual move")

    }

    onOut(button: Button) {
        if (this.changeableElementList.length != 0) {
            console.log(button.text + " " + this.changeableElementList.length)
            for (var i = 0; i < this.changeableElementList.length; i++) {
                let elementToChange = this.changeableElementList[i]
                console.log(i + " " + elementToChange.isSmall)
                if (elementToChange.isSmall) {
                    let routineField = <RoutineField>elementToChange

                    if (!routineField.isClickedDown)
                        elementToChange.setTint(MA_PRIMARY_COLOR)
                } else {
                    elementToChange.setTint(MA_PRIMARY_COLOR)
                }
            }
            if (button instanceof RoutineField) {
                let routineField = <RoutineField>button
                if (routineField.isClickedDown) routineField.setTint(MA_HIDE_COLOR)
            }
            this.changeableElementList = []
        }
        this.playableRoutines = []
        this.legalGridField = null
        this.updatePlayLine(this.playLinePos[0])
    }

    private calculateMove(x: number, y: number) {
        let gridField = this.grid[y][x]
        this.calculateLegalField(gridField)
        //IF YES -> ILLEGAL move
        if (this.legalGridField == null) {
            console.log("ILLEGAL MOVE!!!!")
            //reset all non-completed routines
            this.overflow.addElementToOverflow(gridField.text) //Erhöhe overflow um 1 mit dem Element, welches gedrückt wurde

            for (var i = 0; i < this.routines.length; i++) {
                for (var j = 0; j < this.routines[i].length; j++) {
                    if (this.routines[i][j].isDestroyed) continue
                    console.log(this.routines[i][j])

                    this.routines[i][j].isClickedDown = false
                    this.routines[i][j].setTint(GF_PRIMARY_COLOR)

                }
            }
        }
        // IF YES -> LEGAL MOVE
        else if ((this.legalGridField != null) ||
            (gridField.gridPosX == this.legalGridField.gridPosX && gridField.gridPosY == this.legalGridField.gridPosY && gridField.text == this.legalGridField.text)) {
            console.log("Legal Move!")
            console.log("Playable routines: ")
            this.playableRoutines.forEach((it) => console.log(it))

            let toBeCleared = this.routines.filter(routine => {
                const routineIndices = routine.map(field => field.routineLineNumber)
                return this.playableRoutines.every(pR => !routineIndices.includes(pR.routineLineNumber))
            })
            console.log(toBeCleared.length)
            for (var i = 0; i < toBeCleared.length; i++) {
                for (var j = 0; j < toBeCleared[i].length; j++) {
                    if (toBeCleared[i][j].isDestroyed) continue

                    console.log(toBeCleared[i][j])

                    toBeCleared[i][j].isClickedDown = false
                    toBeCleared[i][j].setTint(GF_PRIMARY_COLOR)

                }
            }

            //1. routine
            for (var i = 0; i < this.playableRoutines.length; i++) {
                let playableRoutine = this.playableRoutines[i] // if undefined => routine is finished at index i

                if (playableRoutine.isDestroyed) continue
                playableRoutine.setTint(MA_HIDE_COLOR)

                playableRoutine.isClickedDown = true
                console.log("Clickeddown successfully: " + playableRoutine.text)
                this.changeableElementList.pop()


                //console.log(playableRoutine.nextRoutineField)
                if (playableRoutine.nextRoutineField == null) {
                    console.log("Routine fertig, routineLineNumber: " + playableRoutine.routineLineNumber)

                    //Delete Routine from list:
                    let completedRoutine = this.routines[playableRoutine.routineLineNumber]
                    for (let i = 0; i < completedRoutine.length; i++) {
                        let completedRoutineField = this.completedRoutines[i]
                        let changeableElementListIndex = this.changeableElementList.indexOf(completedRoutineField)
                        if (changeableElementListIndex != -1) { //Routinefield ist zum ändern gequeued
                            this.changeableElementList.splice(changeableElementListIndex, 1)
                        }
                        completedRoutine[i].destroy()
                    }
                    this.completedRoutines++
                }

            }
            if (this.routines.length == this.completedRoutines) {
                console.log("WIN!")
                this.win()
            }

        }
        var newPos = 0
        if (this.isPlayLineHorizontal) newPos = gridField.gridPosX
        else newPos = gridField.gridPosY

        this.isPlayLineHorizontal = !this.isPlayLineHorizontal
        this.updatePlayLine(newPos)
        console.log(gridField.text)
    }

    private calculateLegalField(gridField: GridField) {
        //highlighting matching fields in the routine
        // if hovered field is in playline && in routine front -> highlight (yellow) routine field
        for (var i = 0; i < this.routines.length; i++) {
            var howMuchIsClickedDown = 0
            var startRoutineField = this.routines[i][0]
            //Springe zum aktuellsten Feld der Routine und zähle die gedrückten Felder:
            do {
                if (startRoutineField.isClickedDown) howMuchIsClickedDown++
                startRoutineField = startRoutineField.nextRoutineField
            } while (startRoutineField.nextRoutineField != null)

            let nextRoutineField = this.routines[i][howMuchIsClickedDown]

            //Checke ob der Wert des Spielfelds == Wert des aktuellen Routinefelds ist
            if (gridField.text == nextRoutineField.text) {
                this.changeableElementList.push(nextRoutineField)

                if (!nextRoutineField.isDestroyed) nextRoutineField.setTint(MA_SELECTED_COLOR) // after routine is completed, this line can produce a lot of errors


                this.legalGridField = gridField
                this.playableRoutines.push(nextRoutineField)

            }

        }
    }

    private createMemoryAddress(x: number, y: number, isSmall: boolean, text?: string, gridPosX?: number, gridPosY?: number, routinePos?: number): MemoryAddress {
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



interface ButtonListener {

    onOver(button: Button);

    onDown(button: Button);

    onOut(button: Button);

}