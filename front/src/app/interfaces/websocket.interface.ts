import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../enum/phase.enum"
import { GroupMessageContentResultEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../enum/websocket.enum"
import { PlayerStateModel_PublicDTO, PlayerStateModel_SecretDTO } from "./model.interface"

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
export interface WsPlayerState extends WsQuery {
    secretState: PlayerStateModel_SecretDTO
    publicState: PlayerStateModel_PublicDTO
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
    selectedPhases: SelectablePhaseEnum[]
    groupReady: Map<number, boolean>
    publicPlayerState: any
}