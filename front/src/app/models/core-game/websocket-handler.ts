import { Injectable } from "@angular/core";
import { GroupMessageResult, PlayerMessageResult, WsDrawResult, WsGroupReady, WsInputMessage } from "../../interfaces/websocket.interface";
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
                console.log('GROUP DEBUG:', message)
                break
            }
            case(GroupMessageContentResultEnum.ready):{
                this.handleGroupMessageReadyResult(message.content)
            }
        }
    }
    private handlePlayerMessageDrawResult(content: WsDrawResult): void {
        this.gameStateService.handleWsDrawResult(content)
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