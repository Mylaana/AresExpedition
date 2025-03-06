import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Message } from '@stomp/stompjs';
import { ProjectCardListComponent } from './components/cards/project/project-card-list/project-card-list.component';
import { GameEventComponent } from './components/core-game/game-event/game-event.component';
import { ServerEmulationComponent } from './components/core-game/server-emulation/server-emulation.component';
import { NonEventButtonComponent } from './components/tools/button/non-event-button.component';
import { HorizontalSeparatorComponent } from './components/tools/layouts/horizontal-separator/horizontal-separator.component';
import { PlayerMessageContentResultEnum } from './enum/websocket.enum';
import { GLOBAL_WS_ACKNOWLEDGE, GLOBAL_WS_GROUP, GLOBAL_WS_PLAYER } from './global/global-const';
import { PlayerMessageResult } from './interfaces/websocket.interface';
import { ProjectCardModel } from './models/cards/project-card.model';
import { NonEventButton } from './models/core-game/button.model';
import { WebsocketHandler } from './models/core-game/websocket-handler';
import { PlayerStateModel } from './models/player-info/player-state.model';
import { ProjectCardInfoService } from './services/cards/project-card-info.service';
import { GameState } from './services/core-game/game-state.service';
import { ButtonDesigner } from './services/designers/button-designer.service';
import { WebsocketResultMessageFactory } from './services/designers/websocket-message-factory.service';
import { RxStompService } from './services/websocket/rx-stomp.service';
import { expandCollapseVertical, fadeIn } from './components/animations/animations';
import { NavigationComponent } from './components/core-game/navigation/navigation.component';
import { SettingsComponent } from './components/core-game/settings/settings.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		ServerEmulationComponent,
		GameEventComponent,
		ProjectCardListComponent,
		NavigationComponent,
		HorizontalSeparatorComponent,
		NonEventButtonComponent,
		SettingsComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	animations: [expandCollapseVertical, fadeIn],
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
	loaded: boolean = false
	@ViewChild('hand') handProjectList!: ProjectCardListComponent
	isScrolled = false
	settingsButton!: NonEventButton;

	_handIsHovered: boolean = false
	_playerPannelIsHovered: boolean = false
	_settings: boolean = false
	_lastScrollY: number = 0
	_connected: boolean = false

	private readonly wsHandler = inject(WebsocketHandler)
	//@ts-ignore
	private groupSubscription: Subscription;
	//@ts-ignore
	private playerSubscription: Subscription;
	//@ts-ignore
	private acknowledgeSubscription: Subscription;

	constructor(
		private elRef: ElementRef,
		private gameStateService: GameState,
		private cardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService
	){}

	ngOnInit(): void {
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.settingsButton = ButtonDesigner.createNonEventButton('settings')
		console.log(this.settingsButton)

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

		this.rxStompService.connectionState$.subscribe(() => {
			this._connected = this.rxStompService.connectionState$.getValue() === 1
		})
	}

	updateHandOnStateChange(state: PlayerStateModel[]): void {
		let clientState = this.gameStateService.getClientState()
		this.playerHand = this.cardInfoService.getProjectCardList(clientState.getProjectHandIdList())
		this.playerPlayed = clientState.getProjectPlayedModelList()

		/*
		if(!this.handProjectList){return}
		this.handProjectList.updatePlayedCardList(clientState.getProjectPlayedModelList())
		*/
	}
	updatePlayerList(playerIdList: number[]){
		this.playerIdList = playerIdList
	}

	loadingFinished(loading: boolean):void{
		if(loading===true){return}

		this.loaded = loading===false
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
	public nonEventButtonClicked(button: NonEventButton){
		switch(button.name){
			case('settings'):{
				this.openSettings()
			}
		}
	}
	public openSettings(){
		this._settings = true
		document.body.style.overflow = 'hidden'
	}
	public closeSettings(){
		this._settings = false
		document.body.style.overflow = ''
	}

	@HostListener('window:keydown', ['$event'])
	handleKeyDown(event: KeyboardEvent) {
	  	if (event.key === 'Escape') {
			if(this._settings){this.closeSettings(); return}
	  	}
	}
	@HostListener('window:scroll', [])
	onScroll() {
		let scrollChanged = window.scrollY > 0;
		if(window.scrollY === (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight) {console.log('max scroll')}
		if(scrollChanged === this.isScrolled){return}
	  	this.isScrolled = window.scrollY > 0;
	}
}
