import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { WebsocketQueryMessageFactory } from '../designers/websocket-message-factory.service';
import { GLOBAL_CLIENT_ID, GLOBAL_GAME_ID, GLOBAL_WS_APP_PLAYER, GLOBAL_WS_ACKNOWLEDGE, GLOBAL_WS_APP_DEBUG } from '../../global/global-const';
import { MessageContentQueryEnum } from '../../enum/websocket.enum';
import { myRxStompConfig } from './rx-stomp.config';
import { SelectablePhaseEnum } from '../../enum/phase.enum';
import { PlayerStateModel } from '../../models/player-info/player-state.model';
import { Utils } from '../../utils/utils';
import { PlayerMessage } from '../../interfaces/websocket.interface';
import { v4 as uuidv4 } from 'uuid'
import { myUUID } from '../../types/global.type';


interface QueueMessage {
    destination: string
    body: string
	uuid: myUUID
}

@Injectable({
    providedIn: 'root',
})
export class RxStompService extends RxStomp {
    private messageQueue: QueueMessage[] = []
    private isProcessingQueue = false

    constructor() {
        super()
        this.configure(myRxStompConfig)
        this.connected$.subscribe(() => {
            this.onClientConnected()
        })

		this.watch(GLOBAL_WS_ACKNOWLEDGE).subscribe((message) => {
			this.handleAck(JSON.parse(message.body))
		  })

        this.activate()
    }

    private onClientConnected() {
        console.log('%cCLIENT RECONNECTED', 'color:blue')
		this.isProcessingQueue = false
		this.messageQueue = []
        this.publishGameStateQuery()
    }

    private enqueueMessage(message: PlayerMessage, destination: string=GLOBAL_WS_APP_PLAYER) {
        Utils.logPublishMessage(`${message.contentEnum}`, message.content)

		this.messageQueue.push({body: JSON.stringify(message), destination, uuid: message.uuid})
        this.processQueue()
    }

    private processQueue() {
        if (this.isProcessingQueue || this.messageQueue.length === 0) {
            return
        }

        this.isProcessingQueue = true
        const { destination, body } = this.messageQueue[0]//.shift()!

        this.publish({ destination, body })
		if(destination===GLOBAL_WS_APP_DEBUG){
			this.isProcessingQueue = false
			this.messageQueue.shift()
			this.processQueue()
		}

        // Simulate an ACK or timeout to continue processing the queue
		return
        setTimeout(() => {
            this.isProcessingQueue = false
            this.processQueue()
        }, 1) // Adjust delay as needed based on server response time
    }

	public handleAck(ack: { ackUuid: string }) {
		if (this.messageQueue.length === 0) return

		const headMessage = this.messageQueue[0]

		if (headMessage.uuid != ack.ackUuid) {return}
		this.messageQueue.shift()
		this.isProcessingQueue = false
		this.processQueue()
	  }

    public publishDebugMessage(args: { gameId?: number; playerId?: number; contentEnum?: MessageContentQueryEnum; content: any }) {
        Utils.logError(`PUBLISHED DEBUG: ${args.contentEnum} `, args.content)
        const message : PlayerMessage = {
			uuid: uuidv4(),
            gameId: args.gameId ?? GLOBAL_GAME_ID,
            playerId: args.playerId ?? GLOBAL_CLIENT_ID,
            contentEnum: args.contentEnum ?? MessageContentQueryEnum.debug,
            content: { content: args.content },
        }
        this.enqueueMessage(message, GLOBAL_WS_APP_DEBUG)
		//this.publish({destination:GLOBAL_WS_APP_DEBUG, body:JSON.stringify(message)})
    }

    public publishDraw(drawNumber: number, eventId: number): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createDrawQuery(drawNumber, eventId), GLOBAL_WS_APP_PLAYER)
    }

    public publishClientPlayerReady(ready: boolean): void {
		console.log('enqueue client rdy', ready)
        this.enqueueMessage(WebsocketQueryMessageFactory.createReadyQuery(ready), GLOBAL_WS_APP_PLAYER)
    }

    public publishGameStateQuery(): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createGameStateQuery(), GLOBAL_WS_APP_PLAYER)
    }

    public publishSelectedPhase(phase: SelectablePhaseEnum): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createPhaseSelectedQuery(phase), GLOBAL_WS_APP_PLAYER)
    }

    public publishPlayerState(state: PlayerStateModel): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createClientPlayerStatePush(state), GLOBAL_WS_APP_PLAYER)
    }
}
