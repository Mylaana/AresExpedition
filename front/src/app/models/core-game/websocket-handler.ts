import { Injectable } from "@angular/core";
import { GroupMessageResult, PlayerMessageResult, WsDrawResult, WsGameState, WsGroupReady } from "../../interfaces/websocket.interface";
import { GroupMessageContentResultEnum, PlayerMessageContentResultEnum } from "../../enum/websocket.enum";
import { WebsocketResultMessageFactory } from "../../services/designers/websocket-message-factory.service";
import { GameState } from "../../services/core-game/game-state.service";
import { EventDesigner } from "../../services/designers/event-designer.service";
import { Utils } from "../../utils/utils";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GameParamService } from "../../services/core-game/game-param.service";
import { myUUID } from "../../types/global.type";

@Injectable()
export class WebsocketHandler {
    clientPlayerId: myUUID = ''

    constructor(private gameStateService: GameState){}

	/*
    handleMessage(message: WsInputMessage){
        switch(message.subscription){
            case(SubscriptionEnum.player):{
                this.handlePlayerMessage(WebsocketResultMessageFactory.createPlayerMessageResult(message.message))
                break
            }
            case(SubscriptionEnum.group):{
                this.handleGroupMessage(WebsocketResultMessageFactory.createGroupMessageResult(message.message))
                break
            }
        }
    }
	*/
    public handlePlayerMessage(message: PlayerMessageResult){
        Utils.logReceivedMessage(`[${message.contentEnum}] ON [PLAYER CHANNEL]`, message.content)
        switch(message.contentEnum){
            case(PlayerMessageContentResultEnum.draw):{
                this.handlePlayerMessageDrawResult(message.content)
                break
            }
            case(PlayerMessageContentResultEnum.gameState):{
                this.handleMessageGameState(message.content, 'player')
                break
            }
			case(PlayerMessageContentResultEnum.startGame):{
				this.gameStateService.startGame()
				break
			}
			case(PlayerMessageContentResultEnum.playerConnect):{
				this.handleMessageConnection(message.content)
				break
			}
            default:{
                console.log('UNHANDLED PLAYER MESSAGE RECEIVED: ', message)
            }
        }
    }
    public handleGroupMessage(message: GroupMessageResult){
        Utils.logReceivedMessage(`[${message.contentEnum}] ON [GROUP CHANNEL]`, message.content)
        switch(message.contentEnum){
            case(GroupMessageContentResultEnum.debug):{
                break
            }
            case(GroupMessageContentResultEnum.ready):{
                this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(message.content))
                break
            }
            case(GroupMessageContentResultEnum.nextPhase):{
                this.handleMessageGameState(message.content, 'group')
                break
            }
            case(GroupMessageContentResultEnum.serverSideUnhandled):{
                console.log('SERVER SIDE UNHANDLED MESSAGE RECEIVED: ',message.content)
                break
            }

            default:{
                console.log('UNHANDLED GROUP MESSAGE RECEIVED: ', message)
            }
        }
    }
	//Player messages
    private handlePlayerMessageDrawResult(content: WsDrawResult): void {
        this.gameStateService.handleWsDrawResult(content)
    }
    private handleMessageGameState(content: WsGameState, origin?: String): void {
		this.gameStateService.reset()
        this.gameStateService.clearEventQueue()
		this.gameStateService.setCurrentPhase(content.currentPhase)
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
    }
	private handleMessageConnection(content: WsGameState): void {
		this.handleMessageGameState(content)
	}

	//Group messages
    private handleGroupMessageReadyResult(groupReady: WsGroupReady[]): void {
        //setting ready
        this.gameStateService.setGroupReady(groupReady)

        switch(this.gameStateService.getClientReady()){
            case(false):{
                this.gameStateService.finalizeEventWaitingGroupReady()
                return
            }
            case(true):{
                this.gameStateService.clearEventQueue()
                this.gameStateService.addEventQueue(EventDesigner.createGeneric("waitingGroupReady"),"first")
                return
            }
        }
    }
	private handleGroupMessageGameState(groupState: PlayerStateDTO[]): void {
		this.gameStateService.setGroupStateFromJson(groupState)
		this.gameStateService.setGameLoaded()
	}
}
