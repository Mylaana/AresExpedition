import { Injectable } from "@angular/core";
import { MessageContentEnum } from "../../enum/websocket.enum";

interface PlayerMessage {
    gameId: number,
    playerId: number
    contentEnum: MessageContentEnum,
    content: any
}
interface DrawQuery {
    draw: number
}
interface ReadyQuery {
    ready: boolean
}

const clientId = 0
const gameId = 1

@Injectable({
    providedIn: 'root'
})
export class WebsocketQueryMessageFactory{
    private static generatePlayerMessage(contentEnum: MessageContentEnum, content: any): PlayerMessage {
        let message: PlayerMessage = {
            gameId: gameId,
            playerId: clientId,
            content: content,
            contentEnum: contentEnum
        }

        return message
    }
    public static createDrawQuery(drawNumber: number): PlayerMessage {
        let query: DrawQuery = {draw:drawNumber}
        return this.generatePlayerMessage(MessageContentEnum.drawQuery, query)
    }
    public static createReadyQuery(ready: boolean): PlayerMessage {
        let query: ReadyQuery = {ready: ready}
        return this.generatePlayerMessage(MessageContentEnum.ready, query)
    }
}