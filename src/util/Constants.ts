//Color plate:
export const greenPrimaryColor = 0x82f676
export const greenSecondaryColor = 0x102210
export const darkGreenColor = 0x083003
export const brightGreenColor = 0xa5ff99
export const yellowColor = 0xF1F22E
export const darkYellowColr = 0x303003
export const whiteColor = 0xFFFFFF
export const redColor = 0xEC3F47

//Selectionscene:
export const SELECTION_TEXT_SIZE_PX = 16
export const SELECTION_TEXT_Y = 400
export const SINGLE_PLAYER_TEXT_X = 400
export const DISTANCE_SINGLE_MULTI_PLAYER_TEXT_X = 50 //Multipler text ist abhängig vom singlePlayerText



//MemoryAddress/Spielfeld:
export const GF_WIDH = 64
export const GF_HEIGHT = 64
export const GF_PRIMARY_COLOR = greenPrimaryColor
export const GF_SELECTED_COLOR = yellowColor
export const GF_HIDE_SELECTED_COLOR = darkYellowColr
export const GF_HIDE_COLOR = darkGreenColor
export const GF_HIGHLIGHT_COLOR = brightGreenColor
export const GF_TEXT_SIZE = 16
export const GF_BACKGROUND_32 = 'memoryaddress_background_32'
export const GF_BACKGROUND_64 = 'memoryaddress_background_64'
export const GF_START_POS_X = 0.3
export const GF_START_POS_Y = 0.3

//Distanz zwischen Spielfeld und Routinen X-Achse:
export const DISTANCE_GF_RO = 60

//Spielfeld:
export const GR_START_POS_X = 40
export const GR_START_POS_Y = 20

//Routinen WIDTH - HEIGHT
export const RO_WIDTH = 32
export const RO_HEIGHT = 32

//Overflow
export const DISTANCE_GF_OV_X = 150
export const DISTANCE_GF_OV_Y = 250
export const OV_COLOR = whiteColor
export const OV_FILL_COLOR = redColor

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


//Levelkonfigurationen:
export const LEVEL_1_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 2,
    columns: 3,
    maxTime: 120,
    maxOverflow: 5,
    minRoutines: 1, 
    maxRoutines: 2,
    minRoutineLength: 2,
    maxRoutineLength: 2
}
export const LEVEL_2_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 3,
    columns: 4,
    maxTime: 120,
    maxOverflow: 5,
    minRoutines: 2, 
    maxRoutines: 3,
    minRoutineLength: 2,
    maxRoutineLength: 3
}
export const LEVEL_3_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 4,
    columns: 5,
    maxTime: 120,
    maxOverflow: 4,
    minRoutines: 3, 
    maxRoutines: 4,
    minRoutineLength: 2,
    maxRoutineLength: 4
}

export const LEVEL_4_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 5,
    columns: 6,
    maxTime: 120,
    maxOverflow: 4,
    minRoutines: 3, 
    maxRoutines: 4,
    minRoutineLength: 3,
    maxRoutineLength: 5
}
export const LEVEL_5_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 7,
    columns: 8,
    maxTime: 180,
    maxOverflow: 5,
    minRoutines: 4, 
    maxRoutines: 6,
    minRoutineLength: 4,
    maxRoutineLength: 7
}
export const LEVEL_NIL_GAME_LEVEL_CONFIG: GameLevelConfig = {
    rows: 10,
    columns: 10,
    maxTime: 180,
    maxOverflow: 10,
    minRoutines: 10, 
    maxRoutines: 10,
    minRoutineLength: 10,
    maxRoutineLength: 10
}