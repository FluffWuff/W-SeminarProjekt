import { GameLevelConfig } from "../level/Levels.js"

//Color plate:
export const greenPrimaryColor = 0x82f676
export const greenSecondaryColor = 0x102210
export const yellowColor = 0xa6a666


//MemoryAddress/Spielfeld:
export const MA_WIDH = 64
export const MA_HEIGHT = 64
export const MA_PRIMARY_COLOR = greenPrimaryColor
export const MA_SELECTED_COLOR = yellowColor
export const MA_TEXT_SIZE = 16
export const MA_BACKGROUND_32 = 'memoryaddress_background_32'
export const MA_BACKGROUND_64 = 'memoryaddress_background_64'
export const MA_START_POS_X = 0.3
export const MA_START_POS_Y = 0.3

export const DISTANCE_MA_RO = 60

//Spielfeld:
export const GR_START_POS_X = 40
export const GR_START_POS_Y = 20

//Routinen
export const RO_WIDTH = 32
export const RO_HEIGHT = 32

//Levelkonfigurationen:
export const LEVEL_2_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 3,
    columns: 4,
    maxTime: 120,
    maxErros: 5,
    minRoutines: 2, 
    maxRoutines: 3,
    minRoutineLength: 2,
    maxRoutineLength: 3
}
export const LEVEL_3_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 4,
    columns: 5,
    maxTime: 120,
    maxErros: 4,
    minRoutines: 3, 
    maxRoutines: 4,
    minRoutineLength: 2,
    maxRoutineLength: 5
}
//REWORK:
export const LEVEL_4_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 5,
    columns: 4,
    maxTime: 120,
    maxErros: 4,
    minRoutines: 3, 
    maxRoutines: 4,
    minRoutineLength: 2,
    maxRoutineLength: 5
}
export const LEVEL_5_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 5,
    columns: 4,
    maxTime: 120,
    maxErros: 4,
    minRoutines: 3, 
    maxRoutines: 4,
    minRoutineLength: 2,
    maxRoutineLength: 5
}