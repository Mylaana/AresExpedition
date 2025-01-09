import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebsocketQueryMessageFactory } from '../designers/websocket-message-factory.service';
import { GLOBAL_CLIENT_ID, GLOBAL_GAME_ID, GLOBAL_WS_APP_PLAYER } from '../../global/global-const';
import { MessageContentQueryEnum, SubscriptionEnum } from '../../enum/websocket.enum';
import { myRxStompConfig } from './rx-stomp.config';
import { SelectablePhaseEnum } from '../../enum/phase.enum';
import { PlayerStateModel } from '../../models/player-info/player-state.model';
import { Utils } from '../../utils/utils';


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
		console.log('%cCLIENT RECONNECTED', 'color:blue')
        this.publishGameStateQuery()
    }

    public publishDebugMessage(param:{gameId?:number, playerId?:number, contentEnum?:MessageContentQueryEnum, content:any}){
        Utils.logError(`PUBLISHED DEBUG: ${param.contentEnum} `, param.content)
		let message = {
            gameId: param.gameId?? GLOBAL_GAME_ID,
            playerId: param.playerId?? GLOBAL_CLIENT_ID,
            contentEnum: param.contentEnum?? MessageContentQueryEnum.debug,
            content: {content:param.content}
        }
        this.publish({destination: "/app/debug", body: JSON.stringify(message)});
    }

	private publishMessage(message: any){
        Utils.logPublishMessage(`${message.contentEnum} (${message.content.length})`, message.content)
		this.publish({destination: GLOBAL_WS_APP_PLAYER, body: JSON.stringify(message)});
    }

    public publishDraw(drawNumber: number, eventId: number): void {
        this.publishMessage(WebsocketQueryMessageFactory.createDrawQuery(drawNumber, eventId))
    }

    public publishClientPlayerReady(ready: boolean): void {
        this.publishMessage(WebsocketQueryMessageFactory.createReadyQuery(ready))
    }

    public publishGameStateQuery(): void {
        this.publishMessage(WebsocketQueryMessageFactory.createGameStateQuery())
    }

    public publishSelectedPhase(phase: SelectablePhaseEnum): void {
        this.publishMessage(WebsocketQueryMessageFactory.createPhaseSelectedQuery(phase))
    }

    public publishPlayerState(state: PlayerStateModel): void {
        this.publishMessage(WebsocketQueryMessageFactory.createClientPlayerStatePush(state))
    }
}
