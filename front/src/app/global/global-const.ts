import { RessourceType, TagType } from "../types/global.type"

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

export const GAME_TAG_LIST: TagType[] = ['building','space','science','power','earth','jovian','plant','animal','microbe','event']
export const GAME_RESSOURCE_LIST: RessourceType[] = ['megacredit', 'heat', 'plant', 'steel', 'titanium', 'card']
