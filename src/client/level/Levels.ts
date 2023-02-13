import { DISTANCE_MA_RO, GR_START_POS_X, GR_START_POS_Y, MA_HEIGHT, MA_START_POS_X, MA_START_POS_Y, MA_PRIMARY_COLOR, MA_WIDH, RO_HEIGHT, RO_WIDTH, DISTANCE_MA_OV_X, DISTANCE_MA_OV_Y, OV_COLOR, MA_SELECTED_COLOR } from "../util/Constants.js"
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
    
    private currentSelected: MemoryAddress[] = []

    constructor(public scene: Phaser.Scene, private levelConfig: GameLevelConfig) {
        this.grid = []

        this.fillGridUp()
        this.createRoutines()
        this.overflow = new OverflowManager(this.scene, this.levelConfig.maxOverflow)
        this.createTimer()
        this.createDetails()
    }

    private fillGridUp() {
        let gridText = this.scene.add.text(MA_START_POS_X*this.scene.cameras.main.centerX*2, MA_START_POS_Y*this.scene.cameras.main.centerY*2, "memory matrix", {
            align: 'left',
            font: '24px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: "#"+MA_PRIMARY_COLOR.toString(16)
        })
        for(var i = 0; i < this.levelConfig.rows; i++) {
            this.grid[i] = []
            for(var j = 0; j < this.levelConfig.columns; j++) {
                  this.grid[i][j] = this.createMemoryAddress(MA_WIDH*j*1.025+MA_START_POS_X*this.scene.cameras.main.centerX*2,
                     MA_HEIGHT*i*1.025+MA_START_POS_Y*this.scene.cameras.main.centerY*2+25, false)
            }
        }
    }

    // NICHT ANFASSEN
    private createRoutines() {
        //Anzahl der Routinen
        let amount = Math.round(Math.random() * (this.levelConfig.maxRoutines - this.levelConfig.minRoutines) + this.levelConfig.minRoutines)
        let routineText = this.scene.add.text(MA_WIDH*this.levelConfig.columns*1.025+MA_START_POS_X*this.scene.cameras.main.centerX*2+DISTANCE_MA_RO,
            MA_START_POS_Y*this.scene.cameras.main.centerY*2, "override routines", {
            align: 'left',
            font: '16px DS-DIGII',
            color: "#"+MA_PRIMARY_COLOR.toString(16)
        })
        for(var i = 0; i < amount; i++) { 
            this.routines[i] = []
            let isVer = Math.random() < 0.5
            let lastH = Math.floor(this.levelConfig.columns * Math.random())
            let lastV = Math.floor(this.levelConfig.rows * Math.random())
            //console.log("Creating new Routine with startH " + lastH + " and startV " + lastV)
            for(var j = 0; j < Math.round(Math.random() * (this.levelConfig.maxRoutineLength - this.levelConfig.minRoutineLength) + this.levelConfig.minRoutineLength); j++) {
                let text = this.grid[lastV][lastH].text
                this.routines[i][j] =  this.createMemoryAddress(
                    RO_WIDTH*j*1.025+MA_WIDH*this.levelConfig.columns*1.025+MA_START_POS_X*this.scene.cameras.main.centerX*2+DISTANCE_MA_RO-16,
                    RO_HEIGHT*i*1.025+MA_START_POS_Y*this.scene.cameras.main.centerY*2, true, text)                
                if(isVer) {
                    let newV = Math.floor(this.levelConfig.rows * Math.random())
                    while(newV == lastV) newV = Math.floor(this.levelConfig.rows * Math.random())
                    lastV = newV
                } else {
                    let newH = Math.floor(this.levelConfig.columns * Math.random())
                    while(newH == lastH) newH = Math.floor(this.levelConfig.columns * Math.random())
                    lastH = newH
                }
                //console.log("Next h: " + lastH + " v: "+ lastV)
                isVer = !isVer
            }
        }
        
    }

    private updateOverflow() {
        this.overflowText.setText("overflow ("+this.currentOverflow+"/"+this.levelConfig.maxOverflow+")")
    }

    private createTimer() {
        
    }

    private createDetails() {

    }

    onOver(button: Button) {
        if(button.isSmall) {
            //Finde alle Felder, die den gleichen Wert haben
            for(var i = 0; i < this.grid.length; i++) {
                for(var j = 0; j < this.grid[i].length; j++) {
                    let gridElement = this.grid[i][j]
                    if(button.text == gridElement.text) {
                        this.currentSelected.push(gridElement)
                        gridElement.setTint(MA_SELECTED_COLOR)
                    }
                }
            }
        }
        button.setTint(MA_SELECTED_COLOR)
    }

    onDown(button: Button) {
        
    }

    onOut(button: Button) {
        if(button.isSmall) {
            for(var i = 0; i < this.currentSelected.length; i++) {
                this.currentSelected[i].setTint(MA_PRIMARY_COLOR)
            }
            this.currentSelected = []
        }
        button.setTint(MA_PRIMARY_COLOR)
    }

    private createMemoryAddress(x: number, y: number, isSmall: boolean, text?: string): MemoryAddress {
        if(text == null) {
            let number = Math.round(Math.random() * (9-2) + 2)
            let letters = ["A", "B", "C", "D", "E", "F", "X"]
            let letter = letters[Math.floor(Math.random()*letters.length)]
            text = letter+number
        }
        return new Button(this, x, y, text, isSmall, {
            align: 'center',
            font: '64px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            
        })
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