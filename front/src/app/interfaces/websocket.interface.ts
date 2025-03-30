import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../enum/phase.enum"
import { GroupMessageContentResultEnum, MessageContentQueryEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../enum/websocket.enum"
import { myUUID, PlayerColor } from "../types/global.type"
import { PlayerStateDTO } from "./dto/player-state-dto.interface"

export interface WsInputMessage {
    subscription: SubscriptionEnum,
    message: any
}

export interface MessageResult {
	uuid: myUUID,
    gameId: number,
    contentEnum: any,
    content: any
}
export interface PlayerMessage {
	uuid: myUUID
	gameId: number
	playerId: number
	contentEnum: MessageContentQueryEnum
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
    drawNumber: number
    eventId: number
}
export interface WsReadyQuery extends WsQuery {
    ready: boolean
}
export interface WsSelectedPhaseQuery extends WsQuery {
    phase: SelectablePhaseEnum
}
export interface WsPlayerState extends WsQuery {
    state: PlayerStateDTO
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
    groupPlayerStatePublic: Map<string, any>
}
export interface WSGroupState extends WsResult {
	groupState: PlayerStateDTO[]
}
export interface WsAck {
	gameId: number
	contentEnum: PlayerMessageContentResultEnum
	uuid: myUUID
}
export interface ApiMessage {
	gameId: myUUID
	players: ApiPlayer[],
	options?: any
}
export interface ApiPlayer {
	id: myUUID,
	name: string,
	color: PlayerColor
}
