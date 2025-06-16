import { Injectable } from "@angular/core";
import { GroupMessageResult, PlayerMessageResult, WsDrawResult, WsGameState, WsGroupReady, WsOceanResult } from "../../interfaces/websocket.interface";
import { GameStatusEnum, GroupMessageContentResultEnum, PlayerMessageContentResultEnum } from "../../enum/websocket.enum";
import { WebsocketResultMessageFactory } from "../../factory/websocket-message-factory.service";
import { GameState } from "../../services/core-game/game-state.service";
import { Logger } from "../../utils/utils";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { myUUID } from "../../types/global.type";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { EventFactory } from "../../factory/event factory/event-factory";

@Injectable()
export class WebsocketHandler {
    clientPlayerId: myUUID = ''

    constructor(private gameStateService: GameState){}

    public handlePlayerMessage(message: PlayerMessageResult){
        Logger.logReceivedMessage(`[${message.contentEnum}] ON [PLAYER CHANNEL]`, message.content)
		console.log('message:',message)
        switch(message.contentEnum){
            case(PlayerMessageContentResultEnum.draw):{
                this.handlePlayerMessageDrawResult(message.content)
                break
            }
            case(PlayerMessageContentResultEnum.gameState):{
                this.handleMessageStartedGameClientGameState(message.content, false)
                break
            }
			case(PlayerMessageContentResultEnum.playerConnect):{
				this.handleMessageConnection(message.content)
				break
			}
			case(PlayerMessageContentResultEnum.oceanResult):{
				this.handleMessageOceanResult(WebsocketResultMessageFactory.inputToOceanResult(message.content))
				break
			}
			case(PlayerMessageContentResultEnum.researchResult):{
				this.handleResearchResult(WebsocketResultMessageFactory.inputToScanKeepResult(message.content))
				break
			}
			case(PlayerMessageContentResultEnum.scanKeepResult):{
				this.handleScanKeepResult(WebsocketResultMessageFactory.inputToScanKeepResult(message.content))
				break
			}
            default:{
                console.log('UNHANDLED PLAYER MESSAGE RECEIVED: ', message)
            }
        }
    }
    public handleGroupMessage(message: GroupMessageResult){
        Logger.logReceivedMessage(`[${message.contentEnum}] ON [GROUP CHANNEL]`, message.content)
		console.log('message:',message)
        switch(message.contentEnum){
            case(GroupMessageContentResultEnum.debug):{
                break
            }
            case(GroupMessageContentResultEnum.ready):{
                this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(message.content))
                break
            }
            case(GroupMessageContentResultEnum.nextPhase):{
				this.handleMessageStartedGameGroupGameState(message.content)
				if(message.content.gameStatus===GameStatusEnum.gameOver){
					this.gameStateService.setGameOver()
				}
                break
            }
            case(GroupMessageContentResultEnum.serverSideUnhandled):{
                console.log('SERVER SIDE UNHANDLED MESSAGE RECEIVED: ',message.content)
                break
            }
			case(GroupMessageContentResultEnum.selectStartingHand):{
				this.handleMessageSelectStartingHand(message.content)
				break
			}
			case(GroupMessageContentResultEnum.selectCorporation):{
				this.handleMessageSelectCorporation(message.content)
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
	private handleScanKeepResult(content: WsDrawResult){
		this.gameStateService.handleWsDrawResult(content)
	}
	private handleResearchResult(content: WsDrawResult){
		this.gameStateService.handleWsDrawResult(content)
	}

	//these two functions will need to be different cause of private datas in it or not
    private handleMessageStartedGameGroupGameState(content: WsGameState): void {
		this.gameStateService.reset()
        this.gameStateService.clearEventQueue()
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setCurrentPhase(content.currentPhase, false)
		this.gameStateService.setSelectedPhaseList(content.selectedPhase)
    }
	private handleMessageStartedGameClientGameState(content: WsGameState, isReconnect: boolean): void {
		this.gameStateService.reset()
        this.gameStateService.clearEventQueue()
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setCurrentPhase(content.currentPhase, isReconnect)
		this.gameStateService.setSelectedPhaseList(content.selectedPhase)
	}

	private handleMessageConnection(content: WsGameState): void {
		if(content.gameStatus===GameStatusEnum.newGame){
			this.gameStateService.newGame(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
			return
		}

		this.gameStateService.initializeGroupReady(
			WebsocketResultMessageFactory.inputToGroupReady(content.groupReady),
			WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))


		switch(content.gameStatus){
			case(GameStatusEnum.selectCorporation):{
				this.handleMessageSelectCorporation(content)
				break
			}
			case(GameStatusEnum.selectStartingHand):{
				this.handleMessageSelectStartingHand(content)
				break
			}
			case(GameStatusEnum.started):{
				this.handleMessageStartedGameClientGameState(content, true)
				break
			}
			case(GameStatusEnum.gameOver):{
				this.handleMessageStartedGameClientGameState(content, true)
				this.gameStateService.setGameOver()
				break
			}
		}
		if(this.gameStateService.getClientReady()){
			this.gameStateService.addEventQueue(EventFactory.createGeneric('waitingGroupReady'),'first')
		}
	}

	//Group messages
    private handleGroupMessageReadyResult(groupReady: WsGroupReady[]): void {
        //setting ready
        this.gameStateService.setGroupReady(groupReady)
    }
	private handleGroupMessageGameState(groupState: PlayerStateDTO[]): void {
		this.gameStateService.setGroupStateFromJson(groupState)
		this.gameStateService.setGameLoaded()
	}
	private handleMessageSelectStartingHand(content: WsGameState){
		this.gameStateService.reset()
		this.gameStateService.clearEventQueue()
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setSelectStartingHandEvents()
	}
	private handleMessageSelectCorporation(content: WsGameState){
		this.gameStateService.reset()
		this.gameStateService.clearEventQueue()
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setSelectCorporationEvents()
	}
	private handleMessageOceanResult(content: WsOceanResult){
		this.gameStateService.addOceanBonus(content)
	}
}
