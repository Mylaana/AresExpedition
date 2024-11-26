import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../enum/phase.enum"
import { GroupMessageContentResultEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../enum/websocket.enum"

export interface WsInputMessage {
    subscription: SubscriptionEnum,
    message: any
}

export interface MessageResult {
    gameId: number,
    contentEnum: any,
    content: any
}

export interface PlayerMessageResult extends MessageResult {
    playerId: number
    contentEnum: PlayerMessageContentResultEnum,
}
export interface GroupMessageResult extends MessageResult {
    contentEnum: GroupMessageContentResultEnum,
}

export interface WsQuery {}
export interface WsDrawQuery extends WsQuery {
    draw: number
    eventId: number
}
export interface WsReadyQuery extends WsQuery {
    ready: boolean
}
export interface WsSelectedPhaseQuery extends WsQuery {
    phase: SelectablePhaseEnum
}

export interface WsResult {}
export interface WsGroupReady extends WsResult {
    playerId: number
    ready: boolean
}
export interface WsDrawResult extends WsResult {
    cardIdList: number[]
    eventId: number
}
export interface WsGameState extends WsResult {
    currentPhase: NonSelectablePhaseEnum
}