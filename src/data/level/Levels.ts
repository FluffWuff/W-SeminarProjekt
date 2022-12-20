export class Level {

    public currentTimer: number
    public grid: String[][]

    routines: String[][] = []

    constructor(public levelConfig: LevelConfig) {
        this.grid = []

        for (var i = 0; i < this.levelConfig.rows; i++) {
            for (var j = 0; j < this.levelConfig.columns; j++) {
                this.grid[i][j] = " "
            }
        }

        this.createRoutines()
        this.fillGridUp()
    }

    private createRoutines() {
        let amount = Math.random() * (this.levelConfig.maxRoutines - this.levelConfig.minRoutines) + this.levelConfig.minRoutines
        //imax Anzahl der Routinen im Array
        for(var i = 0; i < amount; i++) { 
            this.routines[i] = []
            // jmax als Laenge der jeweligen Routine
            for(var j = 0; j < Math.random() * (this.levelConfig.maxRoutineLength - this.levelConfig.minRoutineLength) + this.levelConfig.minRoutineLength; j++) {
                this.routines[i][j] = this.createMemoryAddress()
            }
        }
    }

    private fillGridUp() {
        
    }

    private createMemoryAddress(): string {
        let number = Math.round(Math.random() * 9)
        let letters = ["A", "B", "C", "D", "E", "F"]
        let letter = letters[Math.floor(Math.random()*letters.length)]
        return letter + number
    }
}

type LevelConfig = {
    rows: number,
    columns: number,
    maxTime: number,
    maxErros: number,
    minRoutines: number, 
    maxRoutines: number,
    minRoutineLength: number,
    maxRoutineLength: number
}