import { DeckQueryOptionsEnum } from "../enum/global.enum"
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../enum/phase.enum"
import { GameStatusEnum, GroupMessageContentResultEnum, MessageContentQueryEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../enum/websocket.enum"
import { GameOption } from "../services/core-game/create-game.service"
import { myUUID, PlayerColor } from "../types/global.type"
import { PlayerStateDTO } from "./dto/player-state-dto.interface"
import { OceanBonus } from "./global.interface"

export interface WsInputMessage {
    subscription: SubscriptionEnum,
    message: any
}

export interface MessageResult {
	uuid: myUUID,
    gameId: myUUID,
    contentEnum: any,
    content: any
}
export interface PlayerMessage {
	uuid: myUUID
	gameId?: myUUID
	playerId?: myUUID
	contentEnum: MessageContentQueryEnum
	content: any
}

export interface PlayerMessageResult extends MessageResult {
    playerId: myUUID
    contentEnum: PlayerMessageContentResultEnum,
}
export interface GroupMessageResult extends MessageResult {
    contentEnum: GroupMessageContentResultEnum,
}

export interface WsQuery {}
export interface WsDrawQuery extends WsQuery {
    drawNumber: number
    eventId: number
	isCardProduction: boolean
	thenDiscard: number
	playerState: PlayerStateDTO
}
export interface WsScanKeepQuery extends WsQuery {
    scan: number
	keep: number
	options?: DeckQueryOptionsEnum
    eventId: number
	playerState: PlayerStateDTO
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
export interface WsOceanQuery extends WsQuery {
    oceanNumber: number
	playerState: PlayerStateDTO
}
export interface WsResult {}
export interface WsGroupReady extends WsResult {
    playerId: myUUID
    ready: boolean
}
export interface WsDrawResult extends WsResult {
    cardIdList: string[]
    eventId: number
	keep: number,
	options: DeckQueryOptionsEnum
}
export interface WsOceanResult extends WsResult {
	bonuses: OceanBonus[]
	draw: string[]
}
export interface WsGameState extends WsResult {
    currentPhase: NonSelectablePhaseEnum
    selectedPhase: SelectablePhaseEnum[]
    groupReady: Map<myUUID, boolean>
    groupPlayerStatePublic: Map<string, any>
	gameStatus: GameStatusEnum
	gameOptions: GameOption
}
export interface WSGroupState extends WsResult {
	groupState: PlayerStateDTO[]
}
export interface WsAck {
	gameId: myUUID
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
