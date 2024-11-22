import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebsocketQueryMessageFactory } from '../designers/websocket-message-factory.service';
import { GLOBAL_CLIENT_ID, GLOBAL_GAME_ID, GLOBAL_WS_APP_PLAYER } from '../../global/global-const';
import { MessageContentQueryEnum, SubscriptionEnum } from '../../enum/websocket.enum';
import { WsInputMessage } from '../../interfaces/websocket.interface';
import { myRxStompConfig } from './rx-stomp.config';


@Injectable({
	providedIn: 'root',
})
export class RxStompService extends RxStomp {
	constructor() {
		super();
        this.configure(myRxStompConfig)
        this.activate()
	}
    
	private publishMessage(message: any){
		this.publish({ destination: GLOBAL_WS_APP_PLAYER, body: JSON.stringify(message)});
    }

    private addSubscriptionType(messageBody: any, subscription: SubscriptionEnum): any {
        let result: WsInputMessage = {
            subscription:subscription,
            message: JSON.parse(messageBody)
        }
        return result
    }

    public publishDraw(drawNumber: number, eventId: number): void {
        this.publishMessage(WebsocketQueryMessageFactory.createDrawQuery(drawNumber, eventId))
    }

    public publishClientPlayerReady(ready: boolean): void {
        console.log('CALLED ready: ', ready, 'connected: ', this.connected())
        this.publishMessage(WebsocketQueryMessageFactory.createReadyQuery(ready))
    }

    public publishGameStateQuery(): void {
        this.publishMessage(WebsocketQueryMessageFactory.createGameStateQuery())
    }

    public publishDebugMessage(param:{gameId?:number, playerId?:number, contentEnum:MessageContentQueryEnum, content:any}){
        let message = {
            gameId: param.gameId?? GLOBAL_GAME_ID,
            playerId: param.playerId?? GLOBAL_CLIENT_ID,
            contentEnum: param.contentEnum,
            content: param.content
        }
        console.log('debug message: ',message)
        this.publishMessage(message)
    }
}