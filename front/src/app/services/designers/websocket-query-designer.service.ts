import { Injectable } from "@angular/core";

export enum ContentEnum {
    drawQuery = 'DRAW_QUERY',
    other = 'OTHER'
}
interface PlayerMessage {
    gameId: number,
    clientId: number
    contentEnum: ContentEnum,
    content: any
}
interface DrawQuery {
    draw: number
}

const clientId = 0
const gameId = 1

@Injectable({
    providedIn: 'root'
})
export class WebsocketQueryDesigner{
    private static generatePlayerMessage(contentEnum: ContentEnum, content: any): PlayerMessage {
        let message: PlayerMessage = {
            gameId: gameId,
            clientId: clientId,
            content: content,
            contentEnum: contentEnum
        }

        return message
    }
    public static createDrawQuery(drawNumber: number) : PlayerMessage {
        let drawQuery: DrawQuery = {draw:drawNumber}
        return this.generatePlayerMessage(ContentEnum.drawQuery, drawQuery)
    }
}