import { Injectable } from "@angular/core";
import { MessageContentQueryEnum, PlayerMessageContentResultEnum } from "../enum/websocket.enum";
import { GroupMessageResult, MessageResult, PlayerMessageResult, WsAck, WsDrawQuery, WsDrawResult, WsGroupReady, WsOceanQuery, WsOceanResult, WsReadyQuery, WsScanKeepQuery, WsSelectedPhaseQuery } from "../interfaces/websocket.interface";
import { SelectablePhaseEnum } from "../enum/phase.enum";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { PlayerStateDTO } from "../interfaces/dto/player-state-dto.interface";
import { PlayerMessage } from "../interfaces/websocket.interface";
import { v4 as uuidv4 } from 'uuid'
import { myUUID } from "../types/global.type";
import { AwardsEnum, DeckQueryOptionsEnum, MilestonesEnum, OceanBonusEnum } from "../enum/global.enum";
import { OceanBonus, ScanKeep } from "../interfaces/global.interface";
import { EventUnionSubTypes } from "../types/event.type";
import { GameOption } from "../services/core-game/create-game.service";

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
    public static createDrawQuery(drawNumber: number, eventId: number, dto: PlayerStateDTO, isCardProduction: boolean = false, thenDiscard: number = 0): PlayerMessage {
        let query: WsDrawQuery = {drawNumber:drawNumber, eventId: eventId, playerState: dto, isCardProduction: isCardProduction, thenDiscard: thenDiscard}
        return this.generatePlayerMessage(MessageContentQueryEnum.drawQuery, query)
    }
    public static createScanKeepQuery(scanKeep: ScanKeep, eventId: number, dto: PlayerStateDTO, resultType: EventUnionSubTypes, options?:DeckQueryOptionsEnum): PlayerMessage {
        let query: WsScanKeepQuery = {scan:scanKeep.scan, keep:scanKeep.keep, eventId: eventId, playerState: dto, options:options}
		let contentEnum: MessageContentQueryEnum
		switch(resultType){
			case('researchPhaseResult'):{
				contentEnum = MessageContentQueryEnum.researchQuery
				break
			}
			case('scanKeepResult'):{
				contentEnum = MessageContentQueryEnum.scanKeepQuery
				break
			}
			default:{
				console.error('UNHANDLED RESULT TYPE RECEIVED: ', resultType)
				contentEnum = MessageContentQueryEnum.debug
				break
			}
		}
        return this.generatePlayerMessage(contentEnum, query)
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
    public static createClientPlayerStatePush(dto: PlayerStateDTO): PlayerMessage {
        //let query: PlayerStateDTO = state.toJson() //{secretState: state.toSecretDTO(), publicState: state.toPublicDTO()}
        return this.generatePlayerMessage(MessageContentQueryEnum.playerStatePush, dto)
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
		const entries: Record<OceanBonusEnum, number>[] = content['b']??[]
		const oceanBonuses: OceanBonus[] = entries.map(e => ({
			megacredit: e[OceanBonusEnum.megacredit]??0,
			plant: e[OceanBonusEnum.plant]??0,
			card: e[OceanBonusEnum.card]??0,
		}));
		console.log(entries,oceanBonuses)

        return {
            bonuses: oceanBonuses,
            draw: content['d']??[],
        }
	}
	public static inputToScanKeepResult(content: any): WsDrawResult {
		return {
			cardIdList: content['cardIdList'],
			keep:content['keep'],
			options: content['options'],
			eventId: content['eventId']
		}
	}
	public static inputToGameOption(content: any): GameOption {
		let options: GameOption = {
			discovery: content['expansionDiscovery'],
			foundations: content['expansionFoundations'],
			promo: content['expansionPromo'],
			fanmade: content['expansionFanmade'],
			balanced: content['expansionBalanced'],
			infrastructureMandatory: content['modeInfrastructureMandatory'],
			initialDraft: content['modeInitialDraft'],
			merger: content['modeMerger'],
			standardUpgrade: content['modeStandardUpgrade']
		}
		return options
	}
	public static inputToAwards(content: any): AwardsEnum[] {
		let result: AwardsEnum[] = [];

		for (let a of Object.values(AwardsEnum)) {
			for (let c of content) {
				if (c.toString() === a.toString()) {
					result.push(a as AwardsEnum);
				}
			}
		}
		return result;
	}
	public static inputToMilestone(content: any): MilestonesEnum[] {
		let result: MilestonesEnum[] = [];

		for (let a of Object.values(MilestonesEnum)) {
			for (let c of content) {
				if (c.toString() === a.toString()) {
					result.push(a as MilestonesEnum);
				}
			}
		}
		return result;
	}
}
