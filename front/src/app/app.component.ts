import { Component, OnInit , AfterViewInit, ViewChild, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelfInfoComponent } from './components/player-info/self-info/self-info.component';
import { ServerEmulationComponent } from './components/core-game/server-emulation/server-emulation.component';
import { GameEventComponent } from './components/core-game/game-event/game-event.component';
import { ProjectCardListComponent } from './components/cards/project/project-card-list/project-card-list.component';
import { GameState } from './services/core-game/game-state.service';
import { ProjectCardModel } from './models/cards/project-card.model';
import { ProjectCardInfoService } from './services/cards/project-card-info.service';
import { NavigationComponent } from './components/core-game/navigation/navigation.component';
import { PlayerPannelComponent } from './components/player-info/player-pannel/player-pannel.component';
import { PlayerStateModel } from './models/player-info/player-state.model';
import { WebsocketHandler } from './models/core-game/websocket-handler';
import { RxStompService } from './services/websocket/rx-stomp.service';
import { GLOBAL_WS_ACKNOWLEDGE, GLOBAL_WS_GROUP, GLOBAL_WS_PLAYER } from './global/global-const';
import { Message } from '@stomp/stompjs';
import { PlayerMessageResult } from './interfaces/websocket.interface';
import { WebsocketResultMessageFactory } from './services/designers/websocket-message-factory.service';
import { PlayerMessageContentResultEnum } from './enum/websocket.enum';
import { HorizontalSeparatorComponent } from './components/tools/layouts/horizontal-separator/horizontal-separator.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		SelfInfoComponent,
		ServerEmulationComponent,
		GameEventComponent,
		ProjectCardListComponent,
		NavigationComponent,
		PlayerPannelComponent,
		HorizontalSeparatorComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	providers: [
		WebsocketHandler
	]
})
export class AppComponent implements OnInit {
	title = 'AresExpedition';
	playerHand: ProjectCardModel[] = [];
	playerPlayed: ProjectCardModel[] = [];
	playerIdList: number[] = [] //this.gameStateService.playerCount.getValue()
	clientPlayerId!: number;
	loading: boolean = true
	@ViewChild('hand') handProjectList!: ProjectCardListComponent

	private readonly wsHandler = inject(WebsocketHandler)
	//@ts-ignore
	private groupSubscription: Subscription;
	//@ts-ignore
	private playerSubscription: Subscription;
	//@ts-ignore
	private acknowledgeSubscription: Subscription;

	constructor(
		private gameStateService: GameState,
		private cardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService
	){}

	ngOnInit(): void {
		this.clientPlayerId = this.gameStateService.clientPlayerId

		this.gameStateService.currentLoadingState.subscribe(
			loading => this.loadingFinished(loading)
		)

		this.groupSubscription = this.rxStompService
		.watch(GLOBAL_WS_GROUP)
		.subscribe((message: Message) => {
			this.handleGroupMessage(message.body)
		});
		this.playerSubscription = this.rxStompService
		.watch(GLOBAL_WS_PLAYER)
		.subscribe((message: Message) => {
			this.handlePlayerMessage(message.body)
		});
		this.acknowledgeSubscription = this.rxStompService
		.watch(GLOBAL_WS_ACKNOWLEDGE)
		.subscribe((message: Message) => {
			this.handleAcknowledgeMessage(message.body)
		});
	}

	updateHandOnStateChange(state: PlayerStateModel[]): void {
		let clientState = this.gameStateService.getClientState()
		this.playerHand = this.cardInfoService.getProjectCardList(clientState.getProjectHandIdList())
		this.playerPlayed = clientState.getProjectPlayedModelList()

		if(!this.handProjectList){return}
		this.handProjectList.updatePlayedCardList(clientState.getProjectPlayedModelList())
	}
	updatePlayerList(playerIdList: number[]){
		this.playerIdList = playerIdList
	}

	loadingFinished(loading: boolean):void{
		if(loading===true){return}

		this.loading = loading
		this.gameStateService.currentPlayerCount.subscribe(
			playerCount => this.updatePlayerList(playerCount)
		)

		this.gameStateService.currentGroupPlayerState.subscribe(
			state => this.updateHandOnStateChange(state)
		)
	}
	private handleGroupMessage(message: any){
		this.wsHandler.handleGroupMessage(WebsocketResultMessageFactory.createGroupMessageResult(message))
	}
	private handlePlayerMessage(message: any){
		let parsedMessage: PlayerMessageResult = WebsocketResultMessageFactory.createPlayerMessageResult(message)

		if(parsedMessage.contentEnum === PlayerMessageContentResultEnum.acknowledge){
			this.rxStompService.handleAck({ackUuid: parsedMessage.uuid})
			return
		}
		this.wsHandler.handlePlayerMessage(parsedMessage)
	}
	private handleAcknowledgeMessage(message: any){
		console.log('ack received:', WebsocketResultMessageFactory.createAckMessage(message))
		this.rxStompService.handleAck({ackUuid:WebsocketResultMessageFactory.createAckMessage(message).uuid})
	}
}
