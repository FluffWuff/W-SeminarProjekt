import { DISTANCE_GF_RO, GR_START_POS_X, GR_START_POS_Y, GF_HEIGHT, GF_START_POS_X, GF_START_POS_Y, GF_PRIMARY_COLOR, GF_WIDH, RO_HEIGHT, RO_WIDTH, DISTANCE_GF_OV_X, DISTANCE_GF_OV_Y, OV_COLOR, GF_SELECTED_COLOR, GF_HIDE_COLOR, GF_HIGHLIGHT_COLOR, GF_HIDE_SELECTED_COLOR, GameLevelConfig } from "../util/Constants.js"
import { Button } from "../util/Button.js"
import { OverflowManager } from "./Overflow.js"
import { RoutineField, GridField } from './MemoryAddressFields.js';

type MemoryAddress = Button

type Routine = RoutineField[]

export class GameLevel implements ButtonListener {

    public currentTimer: number
    public grid: GridField[][]
    public routines: Routine[] = []

    private overflow: OverflowManager

    /**
     * Elemente (Gridfields, Routinefields), die bei onOver() oder onDown() geändert wurden
     * In onOut() werden diese Elemente in ihren Urzustand gebracht.
     */
    private elementsRequiringReset: MemoryAddress[] = []


    private isPlayLineHorizontal = true
    /**
     * Die erste Zahl gibt den index der Linie innerhalb des Gridfields an
     * Diese Zahl ist unabhängig vom boolean @isPlayLineHorizontal
     * Das Zweite Element in diesem Pair ist die eine Kopie des Gridfields an der Stelle des index
     */
    private playLinePos: [number, GridField[]] = [0, []]

    //private legalGridField: GridField = null

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
        this.scene.scene.start("EndingScene", { isGameWon: true })

    }

    public loose() {
        this.scene.scene.start("EndingScene", { isGameWon: false })
    }

    //Zuständig um das Grid zu generieren
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

    //Erweiterungsmöglichkeit
    /*private createTimer() {

    }

    private createDetails() {

    }*/

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
        //Hiding all Gridfields not matching with the current RoutineField's value => Creating highlighting effect
        //        
        if (button instanceof RoutineField) {
            for (var i = 0; i < this.grid.length; i++) {
                for (var j = 0; j < this.grid[i].length; j++) {
                    let gridElement = this.grid[i][j]

                    //Setze alle Gridfields aus, die nicht den gleichen Wert des momentanen Routinefields haben
                    if (button.text != gridElement.text) {
                        //Alle Elemente, die jemals in onOver() oder onDown() geändert werden,
                        //müssen wieder zurückgesetzt werden, falls noch vorhanden
                        this.elementsRequiringReset.push(gridElement)
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
        /**
         * Andeutung der nächsten Spiellinie im nächsten Zug.
         * Dabei wird die momentane Spiellinie am GridField horizontal 
         * bzw. vertikal imaginär gedreht und angedeutet.  
         */
        if (!this.isPlayLineHorizontal) {
            let rowFieldList = this.grid[gridField.gridPosY]
            for (var i = 0; i < rowFieldList.length; i++) {
                let changeableButton = rowFieldList[i]
                if (changeableButton.gridPosX != this.playLinePos[0]) {
                    changeableButton.setTint(GF_HIGHLIGHT_COLOR)
                    this.elementsRequiringReset.push(changeableButton)
                }
            }
        } else {
            for (var i = 0; i < this.grid.length; i++) {
                let changeableButton = this.grid[i][gridField.gridPosX]
                if (changeableButton.gridPosY != this.playLinePos[0]) {
                    this.elementsRequiringReset.push(changeableButton)
                    changeableButton.setTint(GF_HIGHLIGHT_COLOR)
                }
            }
        }
        //Markierung des GridFields
        gridField.setTint(GF_SELECTED_COLOR)

        this.calculateLegalRoutineFields(gridField)


    }

    onDown(button: MemoryAddress) {
        //Keine Klick-Interaktion mit einem Routinefield möglich
        if (button instanceof RoutineField) return

        let gridField = <GridField>button
        console.log(this.playableRoutines)

        //Überprüfung, ob der Spielzug innerhalb der Gelbenspiellinie ist
        console.log("Playline is horizontal: " + this.isPlayLineHorizontal + ", pos: " + this.playLinePos[0])
        if ((this.isPlayLineHorizontal && gridField.gridPosY == this.playLinePos[0]) || (!this.isPlayLineHorizontal && gridField.gridPosX == this.playLinePos[0])) {
            this.calculateMove(gridField.gridPosX, gridField.gridPosY)
            console.log("Calculated actual move")
            return
        }

        //Wenn der Spielzug nicht innerhalb der gelben Spiellinie ist, muss
        //der gehörige Pre-Move (Der Move zuvor, um überhaupt den aktuellen Move zu machen) berechnet werden
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
        if (this.elementsRequiringReset.length != 0) { //Es gibt nichts zum zurücksetzten
            console.log(button.text + " " + this.elementsRequiringReset.length)
            for (var i = 0; i < this.elementsRequiringReset.length; i++) {
                let elementToChange = this.elementsRequiringReset[i]
                console.log(i + " " + elementToChange.isSmall)
                if (elementToChange.isSmall) {
                    let routineField = <RoutineField>elementToChange

                    if (!routineField.isClickedDown)
                        elementToChange.setTint(GF_PRIMARY_COLOR)
                } else {
                    elementToChange.setTint(GF_PRIMARY_COLOR)
                }
            }
            if (button instanceof RoutineField) {
                let routineField = <RoutineField>button
                if (routineField.isClickedDown) routineField.setTint(GF_HIDE_COLOR)
            }
            this.elementsRequiringReset = []
        }
        this.playableRoutines = []
        this.updatePlayLine(this.playLinePos[0])
    }

    /**
     * Berechnung eines Moves mit dem aktuellen GridFields und Spiellinie mit den gegeben GridField Koordinaten
     * @param gridPosX X-Koordinate des GridFields
     * @param gridPosY Y-Koordinate des Grdifields
     */
    private calculateMove(gridPosX: number, gridPosY: number) {
        let gridField = this.grid[gridPosY][gridPosX]
        this.calculateLegalRoutineFields(gridField)
        //IF YES -> ILLEGAL move
        if (this.playableRoutines.length == 0) { //Keine Legalen Routinen spielbar
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
        // Else -> LEGAL MOVE, because playableRoutines is not empty => Legal Routine play move available
        else {
            console.log("Legal Move!")
            console.log("Playable routines: ")
            this.playableRoutines.forEach((it) => console.log(it))

            //Alle Routinen, die nicht in this.playableRoutines enthalten sind und resetet werden müssen:
            let routinesRequiringReset = this.routines.filter(routine => {
                //Verhindert, dass noch nicht angefangene Routinen resetet werden (Optimierung)
                if (!routine[0].isClickedDown) return false
                const routineIndex = routine[0].routineLineNumber
                console.log(routineIndex)
                // Wenn return statement wahr ist, dann ist kein Index in playableRoutines vorhanden, der den Index dieser routine entspricht.
                return this.playableRoutines.every(pR => routineIndex != pR.routineLineNumber)
            })

            console.log(routinesRequiringReset.length)
            //Zurücksetzen der Routinen in routinesRequiringReset
            for (var i = 0; i < routinesRequiringReset.length; i++) {
                for (var j = 0; j < routinesRequiringReset[i].length; j++) {
                    if (routinesRequiringReset[i][j].isDestroyed) continue //Bereits vollendete Routinen und graphisch entfernt
                    //console.log(toBeCleared[i][j])
                    routinesRequiringReset[i][j].isClickedDown = false
                    routinesRequiringReset[i][j].setTint(GF_PRIMARY_COLOR)
                }
            }

            //Markierung und Bespielung der Routinen
            for (var i = 0; i < this.playableRoutines.length; i++) {
                let playableRoutine = this.playableRoutines[i]

                //Sicherheitscheck, da in der Vergangenheit Probleme mit 
                //den graphischen Elementen sich ergeben haben
                if (playableRoutine.isDestroyed) continue
                playableRoutine.setTint(GF_HIDE_COLOR)
                playableRoutine.isClickedDown = true
                console.log("Clickeddown successfully: " + playableRoutine.text)

                //Entfernung des RoutineFields aus der Liste zum zurücksetzen:
                let elementsRequiringResetIndex = this.elementsRequiringReset.indexOf(playableRoutine)
                this.elementsRequiringReset.splice(elementsRequiringResetIndex, 1)


                //console.log(playableRoutine.nextRoutineField)
                //Keine weitere Routinefield vorhanden, dann Routinenende erreicht
                if (playableRoutine.nextRoutineField == null) {
                    console.log("Routine fertig, routineLineNumber: " + playableRoutine.routineLineNumber)

                    //Graphische Entfernung der Routine:
                    let completedRoutine = this.routines[playableRoutine.routineLineNumber]
                    for (let i = 0; i < completedRoutine.length; i++) {
                        let completedRoutineField = this.completedRoutines[i]

                        completedRoutine[i].destroy()
                    }
                    this.completedRoutines++
                }

            }
            //Reset all current playableRoutines because they have been played
            this.playableRoutines = []
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

    /**
     * Berechung aller legalen RoutineFields, die angeklickt werden dürfen, in Abhängikeit von @gridField
     * @param gridField GridField, welches angeklickt werden soll
     */
    private calculateLegalRoutineFields(gridField: GridField) {
        this.playableRoutines = []

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
                this.elementsRequiringReset.push(nextRoutineField)

                //Markiere die spielbare Routinefield
                if (!nextRoutineField.isDestroyed) nextRoutineField.setTint(GF_SELECTED_COLOR)

                this.playableRoutines.push(nextRoutineField)
            }

        }
    }

    /**
     * Erstellung einer MemoryAddres mit zufälligem Wert, falls @text null ist.
     * */
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