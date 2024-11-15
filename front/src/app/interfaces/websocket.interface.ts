import { SubscriptionEnum } from "../enum/websocket.enum"

export interface DrawQuery {
    drawNumber: number
}
export interface WsInputMessage {
    subscription: SubscriptionEnum,
    message: any
}