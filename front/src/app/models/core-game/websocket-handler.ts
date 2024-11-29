import { Injectable } from "@angular/core";
import { GroupMessageResult, PlayerMessageResult, WsDrawResult, WsGameState, WsGroupReady, WsInputMessage } from "../../interfaces/websocket.interface";
import { GroupMessageContentResultEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../../enum/websocket.enum";
import { WebsocketResultMessageFactory } from "../../services/designers/websocket-message-factory.service";
import { GameState } from "../../services/core-game/game-state.service";
import { EventDesigner } from "../../services/designers/event-designer.service";
import { Utils } from "../../utils/utils";

@Injectable()
export class WebsocketHandler {
    clientPlayerId = this.gameStateService.clientPlayerId
    
    constructor(private gameStateService: GameState){}

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
                this.handleGroupMessageReadyResult(message.content)
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
    private handlePlayerMessageDrawResult(content: WsDrawResult): void {
        this.gameStateService.handleWsDrawResult(content)
    }
    private handleMessageGameState(content: WsGameState, origin: String): void {
        this.gameStateService.clearEventQueue()
        this.gameStateService.setCurrentPhase(content.currentPhase)
        this.handleGroupMessageReadyResult(content.groupReady)
        
    }
    private handleGroupMessageReadyResult(content: Map<number, boolean>): void {
        //converting content to WsGroupReady format
        let wsGroupReady: WsGroupReady[] = []
        const entries = Object.entries(content);
        entries.forEach(([key, value]) => {
            wsGroupReady.push({playerId: +key, ready:value});
        });

        //setting ready
        this.gameStateService.setGroupReady(wsGroupReady)
        
        switch(this.gameStateService.getClientPlayerReady()){
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
}