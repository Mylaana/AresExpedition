import { Injectable } from "@angular/core";

export enum ContentEnum {
    drawQuery = 'DRAW_QUERY',
    ready = 'READY_QUERY',
    other = 'OTHER'
}
interface PlayerMessage {
    gameId: number,
    playerId: number
    contentEnum: ContentEnum,
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
    private static generatePlayerMessage(contentEnum: ContentEnum, content: any): PlayerMessage {
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
        return this.generatePlayerMessage(ContentEnum.drawQuery, query)
    }
    public static createReadyQuery(ready: boolean): PlayerMessage {
        let query: ReadyQuery = {ready: ready}
        return this.generatePlayerMessage(ContentEnum.ready, query)
    }
}