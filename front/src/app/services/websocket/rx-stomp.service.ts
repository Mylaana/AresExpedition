import { inject, Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { WebsocketQueryMessageFactory } from '../../factory/websocket-message-factory.service';
import { GLOBAL_WS_APP_PLAYER, GLOBAL_WS_APP_DEBUG } from '../../global/global-const';
import { MessageContentQueryEnum } from '../../enum/websocket.enum';
import { SelectablePhaseEnum } from '../../enum/phase.enum';
import { Logger } from '../../utils/utils';
import { PlayerMessage } from '../../interfaces/websocket.interface';
import { v4 as uuidv4 } from 'uuid'
import { myUUID } from '../../types/global.type';
import { GameParamService } from '../core-game/game-param.service';
import { PlayerStateDTO } from '../../interfaces/dto/player-state-dto.interface';
import { ScanKeep } from '../../interfaces/global.interface';
import { EventUnionSubTypes } from '../../types/event.type';
import { DeckQueryOptionsEnum } from '../../enum/global.enum';
import { AppConfigService } from '../app-config.service';


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
	private connectionState: boolean = false

	private gameId: myUUID = ''
	private clientId: myUUID = ''

    constructor(
		private gameParam: GameParamService
	) {
        super()
		this.gameParam.currentGameId.subscribe((id) => (this.gameId = id??''))
		this.gameParam.currentClientId.subscribe((id) => (this.clientId = id??''))

		const stompConfig = this.buildRxStompConfig()
        this.configure(stompConfig)
        this.connected$.subscribe(() => {
            this.onClientConnected()
        })
		this.connectionState$.subscribe(() => {
			let state = this.connectionState$.getValue()
			this.connectionState = state===1
		})
        this.activate()
    }

	private buildRxStompConfig(): RxStompConfig {
		const configService = inject(AppConfigService)

		return {
			brokerURL: configService.wsUrl,
			connectHeaders: {},
			heartbeatIncoming: 0,
			heartbeatOutgoing: 20000,
			reconnectDelay: 2000,
			debug: (msg: string): void => {
				// console.log(msg)
			}
		}
	}

    private onClientConnected() {
        console.log('%cCLIENT RECONNECTED', 'color:blue')
		this.isProcessingQueue = false
		this.messageQueue = []
        this.publishConnectionQuery()
    }

    private enqueueMessage(message: PlayerMessage, destination: string=GLOBAL_WS_APP_PLAYER) {
		Logger.logPublishMessage(`${message.contentEnum}`, message.content)
		message.playerId = this.clientId
		message.gameId = this.gameId

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

    public publishDebugMessage(args: { gameId?: myUUID; playerId?: myUUID; contentEnum?: MessageContentQueryEnum; content: any }) {
        Logger.logError(`PUBLISHED DEBUG: ${args.contentEnum} `, args.content)
        const message : PlayerMessage = {
			uuid: uuidv4(),
            contentEnum: args.contentEnum ?? MessageContentQueryEnum.debug,
            content: { content: args.content },
        }
        this.enqueueMessage(message, GLOBAL_WS_APP_DEBUG)
		//this.publish({destination:GLOBAL_WS_APP_DEBUG, body:JSON.stringify(message)})
    }

    public publishDraw(drawNumber: number, eventId: number, playerDTO: PlayerStateDTO, isCardProduction: boolean = false, thenDiscard: number =0): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createDrawQuery(drawNumber, eventId, playerDTO, isCardProduction, thenDiscard))
    }

	public publishScanKeep(scanKeep: ScanKeep, eventId: number, playerDTO: PlayerStateDTO, resultType: EventUnionSubTypes, options?: DeckQueryOptionsEnum): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createScanKeepQuery(scanKeep, eventId, playerDTO, resultType, options))
    }

    public publishClientPlayerReady(ready: boolean): void {
		console.log('enqueue client rdy', ready)
        this.enqueueMessage(WebsocketQueryMessageFactory.createReadyQuery(ready))
    }

    public publishGameStateQuery(): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createGameStateQuery())
    }

	private publishConnectionQuery(): void {
		this.enqueueMessage(WebsocketQueryMessageFactory.createConnectionQuery())
	}

    public publishSelectedPhase(phase: SelectablePhaseEnum): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createPhaseSelectedQuery(phase))
    }

    public publishPlayerState(playerDTO: PlayerStateDTO): void {
        this.enqueueMessage(WebsocketQueryMessageFactory.createClientPlayerStatePush(playerDTO))
    }

	public publishOceanQuery(oceanNumber: number, playerDTO: PlayerStateDTO): void {
		this.enqueueMessage(WebsocketQueryMessageFactory.createOceanQuery(oceanNumber, playerDTO))
	}
}
