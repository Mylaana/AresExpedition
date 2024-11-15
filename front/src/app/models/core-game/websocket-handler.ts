import { Injectable } from "@angular/core";
import { WsInputMessage } from "../../interfaces/websocket.interface";
import { SubscriptionEnum } from "../../enum/websocket.enum";

@Injectable()
export class WebsocketHandler {
    handleMessage(message: WsInputMessage){
        switch(message.subscription){
            case(SubscriptionEnum.player):{
                this.handlePlayerMessage(message)
                break
            }
            case(SubscriptionEnum.group):{
                this.handleGroupMessage(message)
                break
            }
        }
    }
    private handlePlayerMessage(message: WsInputMessage){
        console.log('player', message)
    }
    private handleGroupMessage(message: WsInputMessage){
        console.log('group', message)
    }
}