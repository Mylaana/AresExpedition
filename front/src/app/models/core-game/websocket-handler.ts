import { Injectable } from "@angular/core";
import { MessageResult, WsInputMessage } from "../../interfaces/websocket.interface";
import { SubscriptionEnum } from "../../enum/websocket.enum";
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
    private handlePlayerMessage(message: MessageResult){
        console.log('player', message)
    }
    private handleGroupMessage(message: MessageResult){
        console.log('group', message)
    }
}