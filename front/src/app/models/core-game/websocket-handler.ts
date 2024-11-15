import { Injectable } from "@angular/core";
import { GroupMessageResult, MessageResult, PlayerMessageResult, WsInputMessage } from "../../interfaces/websocket.interface";
import { GroupMessageContentResultEnum, PlayerMessageContentResultEnum, SubscriptionEnum } from "../../enum/websocket.enum";
import { WebsocketResultMessageFactory } from "../../services/designers/websocket-query-factory.service";

@Injectable()
export class WebsocketHandler {
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
}