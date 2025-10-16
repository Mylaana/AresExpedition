import { Injectable } from "@angular/core";
import { GroupMessageResult, PlayerMessageResult, WsDrawResult, WsGameState, WsGroupReady, WsOceanResult } from "../../interfaces/websocket.interface";
import { GameStatusEnum, GroupMessageContentResultEnum, PlayerMessageContentResultEnum } from "../../enum/websocket.enum";
import { WebsocketResultMessageFactory } from "../../factory/websocket-message-factory.service";
import { GameState } from "../../services/core-game/game-state.service";
import { Logger } from "../../utils/utils";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { myUUID } from "../../types/global.type";
import { EventFactory } from "../../factory/event/event-factory";
import { GameActiveContentService } from "../../services/core-game/game-active-content.service";

@Injectable()
export class WebsocketHandler {
    clientPlayerId: myUUID = ''

    constructor(
		private gameStateService: GameState,
		private gameContentService: GameActiveContentService
	){}

    public handlePlayerMessage(message: PlayerMessageResult){
        Logger.logReceivedMessage(`[${message.contentEnum}] ON [PLAYER CHANNEL]`, message.content)
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
			case(GroupMessageContentResultEnum.selectCorporationMerger):{
				this.handleMessageSelectCorporation(message.content, true)
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
		this.gameStateService.setSelectedPhaseList(content.selectedPhase)
		this.gameStateService.setRound(content.round)
		this.gameStateService.setDeckSize(content.deck)
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setCurrentPhase(content.currentPhase, false)
		this.gameContentService.setGameOptions(WebsocketResultMessageFactory.inputToGameOption(content.gameOptions))
		if(this.gameContentService.isContentActive('expansionDiscovery')){
			this.gameStateService.setAwards(WebsocketResultMessageFactory.inputToAwards(content.awards))
			this.gameStateService.setMilestone(WebsocketResultMessageFactory.inputToMilestone(content.milestones))
		}
    }
	private handleMessageStartedGameClientGameState(content: WsGameState, isReconnect: boolean): void {
		this.gameStateService.reset()
        this.gameStateService.clearEventQueue()
		this.gameStateService.setSelectedPhaseList(content.selectedPhase)
		this.gameStateService.setRound(content.round)
		this.gameStateService.setDeckSize(content.deck)
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setCurrentPhase(content.currentPhase, isReconnect)
		this.gameContentService.setGameOptions(WebsocketResultMessageFactory.inputToGameOption(content.gameOptions))
		if(this.gameContentService.isContentActive('expansionDiscovery')){
			this.gameStateService.setAwards(WebsocketResultMessageFactory.inputToAwards(content.awards))
			this.gameStateService.setMilestone(WebsocketResultMessageFactory.inputToMilestone(content.milestones))
		}
	}

	private handleMessageConnection(content: WsGameState): void {
		this.gameContentService.setGameOptions(WebsocketResultMessageFactory.inputToGameOption(content.gameOptions))
		if(this.gameContentService.isContentActive('expansionDiscovery')){
			this.gameStateService.setAwards(WebsocketResultMessageFactory.inputToAwards(content.awards))
			this.gameStateService.setMilestone(WebsocketResultMessageFactory.inputToMilestone(content.milestones))
		}
		this.gameStateService.setRound(content.round)
		this.gameStateService.setDeckSize(content.deck)
		if(content.gameStatus===GameStatusEnum.newGame){
			this.gameStateService.setGameStarted(false)
			this.gameStateService.newGame(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
			return
		}

		this.gameStateService.initializeGroupReady(
			WebsocketResultMessageFactory.inputToGroupReady(content.groupReady),
			WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))

		this.gameStateService.setGameStarted()
		switch(content.gameStatus){
			case(GameStatusEnum.selectCorporation):{
				this.handleMessageSelectCorporation(content)
				break
			}
			case(GameStatusEnum.selectCorporationMerger):{
				this.handleMessageSelectCorporation(content, true)
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
		this.gameStateService.initializeGroupReady(
			WebsocketResultMessageFactory.inputToGroupReady(content.groupReady),
			WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setSelectStartingHandEvents()
	}
	private handleMessageSelectCorporation(content: WsGameState, merger: boolean = false){
		this.gameStateService.reset()
		this.gameStateService.clearEventQueue()
		this.handleGroupMessageReadyResult(WebsocketResultMessageFactory.inputToGroupReady(content.groupReady))
		this.handleGroupMessageGameState(WebsocketResultMessageFactory.inputToGroupStateDTO(content.groupPlayerStatePublic))
		this.gameStateService.setSelectCorporationEvents(merger)
	}
	private handleMessageOceanResult(content: WsOceanResult){
		this.gameStateService.addOceanBonus(content)
	}
}
