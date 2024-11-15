import { MessageContentResultEnum, SubscriptionEnum } from "../enum/websocket.enum"

/*
export interface DrawQuery {
    drawNumber: number
}*/
export interface WsInputMessage {
    subscription: SubscriptionEnum,
    message: any
}

export interface MessageResult {
    gameId: number,
    contentEnum: MessageContentResultEnum,
    content: any
}

export interface PlayerMessageResult extends MessageResult {
    playerId: number
}
export interface GroupMessageResult extends MessageResult {}