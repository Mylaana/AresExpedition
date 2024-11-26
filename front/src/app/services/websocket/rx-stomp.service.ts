import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebsocketQueryMessageFactory } from '../designers/websocket-message-factory.service';
import { GLOBAL_CLIENT_ID, GLOBAL_GAME_ID, GLOBAL_WS_APP_PLAYER } from '../../global/global-const';
import { MessageContentQueryEnum, SubscriptionEnum } from '../../enum/websocket.enum';
import { WsInputMessage } from '../../interfaces/websocket.interface';
import { myRxStompConfig } from './rx-stomp.config';
import { SelectablePhaseEnum } from '../../enum/phase.enum';


@Injectable({
	providedIn: 'root',
})
export class RxStompService extends RxStomp {
	constructor() {
		super();
        this.configure(myRxStompConfig)
        this.connected$.subscribe(() => {
            this.onClientConnected()
        })
        
        this.activate()
	}
    
    private onClientConnected(){
        this.publishGameStateQuery()
    }

	private publishMessage(message: any){
        console.log(`%cPUBLISHED: ${message.contentEnum}: `, 'color:red', message.content)
		this.publish({destination: GLOBAL_WS_APP_PLAYER, body: JSON.stringify(message)});
    }

    public publishDraw(drawNumber: number, eventId: number): void {
        this.publishMessage(WebsocketQueryMessageFactory.createDrawQuery(drawNumber, eventId))
    }

    public publishClientPlayerReady(ready: boolean, origin: String): void {
        console.log('sent ready:', origin)
        this.publishMessage(WebsocketQueryMessageFactory.createReadyQuery(ready))
    }

    public publishGameStateQuery(): void {
        this.publishMessage(WebsocketQueryMessageFactory.createGameStateQuery())
    }

    public publishSelectedPhase(phase: SelectablePhaseEnum): void {
        this.publishMessage(WebsocketQueryMessageFactory.createPhaseSelectedQuery(phase))
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