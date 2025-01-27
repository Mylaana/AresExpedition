export const GLOBAL_GAME_ID = 1
export const GLOBAL_CLIENT_ID = 0
export const GLOBAL_WS_PLAYER = `/topic/player/${GLOBAL_GAME_ID}/${GLOBAL_CLIENT_ID}`
export const GLOBAL_WS_GROUP = `/topic/group/${GLOBAL_GAME_ID}`
export const GLOBAL_WS_ACKNOWLEDGE = `/topic/ack/${GLOBAL_GAME_ID}/${GLOBAL_CLIENT_ID}`
export const GLOBAL_WS_APP_PLAYER = '/app/player'
export const GLOBAL_WS_APP_DEBUG = '/app/debug'

export const DEBUG_LOG_EVENT_RESOLUTION = false
export const DEBUG_LOG_WS_PUBLISH = true
export const DEBUG_LOG_WS_RECEIVED = true
