import { Injectable } from "@angular/core";
import { GroupMessageResult, PlayerMessageResult, WsDrawResult, WsInputMessage } from "../../interfaces/websocket.interface";
import { GroupMessageContentResultEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../../enum/websocket.enum";
import { WebsocketResultMessageFactory } from "../../services/designers/websocket-message-factory.service";
import { GameState } from "../../services/core-game/game-state.service";

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
    private handlePlayerMessage(message: PlayerMessageResult){
        console.log('player', message)

        switch(message.contentEnum){
            case(PlayerMessageContentResultEnum.draw):{
                this.handlePlayerMessageDrawResult(message.content)
                break
            }
        }
    }
    private handleGroupMessage(message: GroupMessageResult){
        switch(message.contentEnum){
            case(GroupMessageContentResultEnum.debug):{
                break
            }
        }
        console.log('group', message)
    }
    private handlePlayerMessageDrawResult(wsDrawResult: WsDrawResult): void {
        this.gameStateService.handleWsDrawResult(wsDrawResult)
    }
}