import { Injectable } from "@angular/core";
import { GroupMessageResult, PlayerMessageResult, WsDrawResult, WsGameState, WsGroupReady, WsInputMessage } from "../../interfaces/websocket.interface";
import { GroupMessageContentResultEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../../enum/websocket.enum";
import { WebsocketResultMessageFactory } from "../../services/designers/websocket-message-factory.service";
import { GameState } from "../../services/core-game/game-state.service";
import { NonSelectablePhaseEnum } from "../../enum/phase.enum";

@Injectable()
export class WebsocketHandler {
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
        switch(message.contentEnum){
            case(PlayerMessageContentResultEnum.draw):{
                this.handlePlayerMessageDrawResult(message.content)
                break
            }
            case(PlayerMessageContentResultEnum.gameState):{
                this.handlePlayerMessageGameState(message.content)
                break
            }
            default:{
                console.log('UNHANDLED PLAYER MESSAGE RECEIVED: ', message)
            }
        }
    }
    public handleGroupMessage(message: GroupMessageResult){
        console.log('resolving ws message: ', message.contentEnum)
        switch(message.contentEnum){
            case(GroupMessageContentResultEnum.debug):{
                console.log('GROUP DEBUG:', message)
                break
            }
            case(GroupMessageContentResultEnum.ready):{
                this.handleGroupMessageReadyResult(message.content)
                console.log('ready serve status: ', message.content)
                break
            }
            case(GroupMessageContentResultEnum.nextPhase):{
                //console.log('NEXT PHASE FULL GAME STATE: ', message)
                this.handlePlayerMessageGameState(message.content)
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
    private handlePlayerMessageGameState(content: WsGameState): void {
        console.log('RECEIVED GAME STATE ON PLAYER CHANNEL:', content)
        this.gameStateService.setCurrentPhase(content.currentPhase)
        
    }
    private handleGroupMessageReadyResult(content: Map<number, boolean>): void {
        let groupReady: WsGroupReady[] = []
        const entries = Object.entries(content);

        entries.forEach(([key, value]) => {
            groupReady.push({playerId: +key, ready:value});
        });
        this.gameStateService.handleWsGroupReady(groupReady)
    }
}