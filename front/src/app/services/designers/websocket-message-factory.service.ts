import { Injectable } from "@angular/core";
import { MessageContentQueryEnum, PlayerMessageContentResultEnum } from "../../enum/websocket.enum";
import { GroupMessageResult, MessageResult, PlayerMessageResult, WsDrawQuery, WsReadyQuery } from "../../interfaces/websocket.interface";

interface PlayerMessage {
    gameId: number,
    playerId: number
    contentEnum: MessageContentQueryEnum,
    content: any
}

const clientId = 0
const gameId = 1

@Injectable({
    providedIn: 'root'
})
export class WebsocketQueryMessageFactory{
    private static generatePlayerMessage(contentEnum: MessageContentQueryEnum, content: any): PlayerMessage {
        let message: PlayerMessage = {
            gameId: gameId,
            playerId: clientId,
            content: content,
            contentEnum: contentEnum
        }

        return message
    }
    public static createDrawQuery(drawNumber: number, eventId: number): PlayerMessage {
        let query: WsDrawQuery = {draw:drawNumber, eventId: eventId}
        return this.generatePlayerMessage(MessageContentQueryEnum.drawQuery, query)
    }
    public static createReadyQuery(ready: boolean): PlayerMessage {
        let query: WsReadyQuery = {ready: ready}
        return this.generatePlayerMessage(MessageContentQueryEnum.ready, query)
    }
}
export class WebsocketResultMessageFactory{
    private static createMessageResult(message: any): MessageResult {
        let result : MessageResult = {
            gameId: message['gameId'],
            contentEnum: message['contentEnum'],
            content: message['content']
        }
        return result
    }
    public static createPlayerMessageResult(message: any): PlayerMessageResult {
        let messageResult = this.createMessageResult(message)
        let result : PlayerMessageResult = {
            gameId: messageResult.gameId,
            playerId: message['playerId'],
            contentEnum: messageResult.contentEnum as PlayerMessageContentResultEnum,
            content: messageResult.content
        }
        return result
    }
    public static createGroupMessageResult(message: any): GroupMessageResult {
        return this.createMessageResult(message) as GroupMessageResult
    }
}