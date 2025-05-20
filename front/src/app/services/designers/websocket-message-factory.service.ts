import { Injectable } from "@angular/core";
import { MessageContentQueryEnum, PlayerMessageContentResultEnum } from "../../enum/websocket.enum";
import { GroupMessageResult, MessageResult, PlayerMessageResult, WsAck, WsDrawQuery, WsGroupReady, WSGroupState, WsOceanQuery, WsOceanResult, WsPlayerState, WsReadyQuery, WsSelectedPhaseQuery } from "../../interfaces/websocket.interface";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { PlayerMessage } from "../../interfaces/websocket.interface";
import { v4 as uuidv4 } from 'uuid'
import { myUUID } from "../../types/global.type";
import { OceanBonusEnum } from "../../enum/global.enum";

@Injectable({
    providedIn: 'root'
})
export class WebsocketQueryMessageFactory{
    private static generatePlayerMessage(contentEnum: MessageContentQueryEnum, content?: any,): PlayerMessage {
        let message: PlayerMessage = {
			uuid: uuidv4(),
			contentEnum: contentEnum,
            content: content??{content:contentEnum}
        }
        return message
    }
    public static createDrawQuery(drawNumber: number, eventId: number, dto: PlayerStateDTO): PlayerMessage {
        let query: WsDrawQuery = {drawNumber:drawNumber, eventId: eventId, playerState: dto}
        return this.generatePlayerMessage(MessageContentQueryEnum.drawQuery, query)
    }
    public static createReadyQuery(ready: boolean): PlayerMessage {
        let query: WsReadyQuery = {ready: ready}
        return this.generatePlayerMessage(MessageContentQueryEnum.ready, query)
    }
    public static createGameStateQuery(): PlayerMessage {
        return this.generatePlayerMessage(MessageContentQueryEnum.playerGameStateQuery)
    }
    public static createPhaseSelectedQuery(phase: SelectablePhaseEnum): PlayerMessage {
        let query: WsSelectedPhaseQuery = {phase: phase}
        return this.generatePlayerMessage(MessageContentQueryEnum.selectedPhase, query)
    }
    public static createClientPlayerStatePush(state: PlayerStateModel): PlayerMessage {
        let query: PlayerStateDTO = state.toJson() //{secretState: state.toSecretDTO(), publicState: state.toPublicDTO()}
        return this.generatePlayerMessage(MessageContentQueryEnum.playerStatePush, query)
    }
	public static createConnectionQuery(): PlayerMessage {
		return this.generatePlayerMessage(MessageContentQueryEnum.playerConnect)
	}
	public static createOceanQuery(oceanNumber: number, dto: PlayerStateDTO): PlayerMessage {
		let query: WsOceanQuery = {oceanNumber:oceanNumber, playerState: dto}
		return this.generatePlayerMessage(MessageContentQueryEnum.oceanQuery, query)
	}
}


export class WebsocketResultMessageFactory{
    private static createMessageResult(message: any): MessageResult {
        let parsedMessage = JSON.parse(message)
        let result : MessageResult = {
			uuid: parsedMessage['uuid'],
            gameId: parsedMessage['gameId'],
            contentEnum: parsedMessage['contentEnum'],
            content: parsedMessage['content']
        }
        return result
    }
    public static createPlayerMessageResult(message: any): PlayerMessageResult {
        let messageResult = this.createMessageResult(message)
        let result : PlayerMessageResult = {
			uuid: messageResult.uuid,
            gameId: messageResult.gameId,
            playerId: message['playerId'],
            contentEnum: messageResult.contentEnum as PlayerMessageContentResultEnum,
            content: messageResult.content
        }
        return result
    }
    public static createGroupMessageResult(message: PlayerStateDTO[]): GroupMessageResult {
        return this.createMessageResult(message) as GroupMessageResult
    }
	public static inputToGroupReady(content: Map<myUUID, boolean>): WsGroupReady[] {
		//converting content to WsGroupReady format
		let result: WsGroupReady[] = []
		const entries = Object.entries(content);
		entries.forEach(([key, value]) => {
			result.push({playerId: key, ready:value});
		});
		return result
	}
	public static inputToGroupStateDTO(content: Map<string, any>): PlayerStateDTO[] {
		let result: PlayerStateDTO[] = []
		const entries = Object.entries(content);
		entries.forEach(([key, value]) => {
			result.push(value)
		});
		return result
	}
	public static createAckMessage(message: any): WsAck {
		let parsedMessage = JSON.parse(message)
        let result : WsAck = {
			uuid: parsedMessage['uuid'],
            gameId: parsedMessage['gameId'],
            contentEnum: parsedMessage['contentEnum'],
        }
        return result
	}
	public static inputToOceanResult(content: any): WsOceanResult {
		let bonuses: Map<OceanBonusEnum, number> = new Map()
		const entries = Object.entries(content['b']??[])
		entries.forEach(([key, value]) => {
			bonuses.set(key as OceanBonusEnum, value as number);
		});
        let result : WsOceanResult = {
            bonuses: bonuses,
            draw: content['d']??[],
        }
        return result
	}
}
