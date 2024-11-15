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