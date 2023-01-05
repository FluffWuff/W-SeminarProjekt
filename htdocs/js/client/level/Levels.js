import { Button } from "../util/Button.js";
import { MA_HEIGHT, MA_START_POS_X, MA_START_POS_Y, MA_TEXT_COLOR, MA_WIDH, RO_HEIGHT, RO_START_POS_X, RO_START_POS_Y, RO_WIDTH } from "../util/Constants.js";
export class GameLevel {
    constructor(scene, levelConfig) {
        this.scene = scene;
        this.levelConfig = levelConfig;
        this.routines = [];
        this.grid = [];
        //Gucken, ob es unnötig geworden ist:
        /*for (var i = 0; i < this.levelConfig.rows; i++) {
            for (var j = 0; j < this.levelConfig.columns; j++) {
                this.grid[i][j] = null
            }
        }*/
        //this.createMemoryAddress(100, 100)
        this.fillGridUp();
        this.createRoutines();
    }
    createRoutines() {
        let amount = Math.round(Math.random() * (this.levelConfig.maxRoutines - this.levelConfig.minRoutines) + this.levelConfig.minRoutines);
        //imax Anzahl der Routinen im Array
        let routineText = this.scene.add.text(RO_START_POS_X, RO_START_POS_Y, "override routines", {
            align: 'left',
            font: '16px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: MA_TEXT_COLOR
        });
        for (var i = 0; i < amount; i++) {
            this.routines[i] = [];
            // jmax als Laenge der jeweligen Routine
            for (var j = 0; j < Math.round(Math.random() * (this.levelConfig.maxRoutineLength - this.levelConfig.minRoutineLength) + this.levelConfig.minRoutineLength); j++) {
                this.routines[i][j] = this.createMemoryAddress(RO_WIDTH * j * 1.025 + RO_START_POS_X - 16, RO_HEIGHT * i * 1.025 + RO_START_POS_Y, true);
            }
        }
        //Routinen ins Spielfeld einfügen:
        //Nehme random zahl für Abstand, boolean ob horizontal oder vertikal
    }
    fillGridUp() {
        let gridText = this.scene.add.text(MA_START_POS_X, MA_START_POS_Y, "memory matrix", {
            align: 'left',
            font: '16px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: MA_TEXT_COLOR
        });
        for (var i = 0; i < this.levelConfig.rows; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.levelConfig.columns; j++) {
                this.grid[i][j] = this.createMemoryAddress(MA_WIDH * j * 1.025 + MA_START_POS_X, MA_HEIGHT * i * 1.025 + MA_START_POS_Y + 16, false);
            }
        }
    }
    createMemoryAddress(x, y, isSmall) {
        let number = Math.round(Math.random() * (9 - 2) + 2);
        let letters = ["A", "B", "C", "D", "E", "F"];
        let letter = letters[Math.floor(Math.random() * letters.length)];
        let text = letter + number;
        return new Button(this.scene, x, y, text, isSmall, {
            align: 'center',
            font: '64px DS-DIGII',
            //backgroundColor: MA_BACKGROUND_COLOR,
            color: MA_TEXT_COLOR,
        }, () => { });
    }
}
//# sourceMappingURL=Levels.js.map