import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Message } from '@stomp/stompjs';
import { PlayerMessageContentResultEnum } from '../../../../enum/websocket.enum';
import { GLOBAL_WS_ACKNOWLEDGE, GLOBAL_WS_GROUP, GLOBAL_WS_PLAYER } from '../../../../global/global-const';
import { PlayerMessageResult } from '../../../../interfaces/websocket.interface';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { WebsocketResultMessageFactory } from '../../../../factory/websocket-message-factory.service';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { GameEventComponent } from '../../game/game-event/game-event.component';
import { NavigationComponent } from '../../game/navigation/navigation.component';
import { ServerEmulationComponent } from '../../game/server-emulation/server-emulation.component';
import { SettingsComponent } from '../../game/settings/settings.component';
import { WebsocketHandler } from '../../../../models/core-game/websocket-handler';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { GameState } from '../../../../services/game-state/game-state.service';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';
import { RxStompService } from '../../../../services/websocket/rx-stomp.service';
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { CommonModule } from '@angular/common';
import { fadeIn, fadeInFadeOut } from '../../../../animations/animations';
import { myUUID, SettingCardSize } from '../../../../types/global.type';
import { GameParamService } from '../../../../services/core-game/game-param.service';
import { GameOverComponent } from '../../game/game-over/game-over.component';
import { PlayerPlayedCardComponent } from '../../../cards/project/player-played-card/player-played-card.component';
import { ApiService } from '../../../../services/api/api.service';

@Component({
    selector: 'app-game-main',
    imports: [
        CommonModule,
        ServerEmulationComponent,
        PlayableCardListComponent,
        NavigationComponent,
        NonEventButtonComponent,
        SettingsComponent,
        GameEventComponent,
		GameOverComponent,
		PlayerPlayedCardComponent
    ],
    templateUrl: './game-main.component.html',
    styleUrl: './game-main.component.scss',
    animations: [fadeIn, fadeInFadeOut]
})
export class GameMainComponent implements OnInit{
	playerHand: PlayableCardModel[] = [];
	playerHandCorporation: string[] = [];
	playerPlayed: PlayableCardModel[] = [];
	playerIdList: myUUID[] = []
	clientId!: myUUID
	gameId!: myUUID
	session!: boolean
	loaded: boolean = false
	@ViewChild('hand') handProjectList!: PlayableCardListComponent
	isScrolled = false
	settingsButton!: NonEventButton;

	_clientState!: PlayerStateModel
	_groupState!: PlayerStateModel[]
	_handIsHovered: boolean = false
	_playerPannelIsHovered: boolean = false
	_settings: boolean = false
	_lastScrollY: number = 0
	_connected: boolean = false
	_gameOver: boolean = false
	_gameStarted: boolean = false
	_cardSize!: SettingCardSize
	_handCardSize!: SettingCardSize

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
		private rxStompService: RxStompService,
		private gameParam: GameParamService,
		private apiService: ApiService,
	){}
	ngOnInit(): void {
		this.gameParam.currentGameId.subscribe((id) => {
			if(id){
				this.gameId = id
				this.subscribeWsIfValidSessionIds()
			}
		})
		this.gameParam.currentClientId.subscribe((id) => {
			if(id){this.clientId = id
				this.subscribeWsIfValidSessionIds()
			}
		})
		this.gameStateService.currentGroupPlayerState.subscribe(states => this.updateGroupState(states))
		this.gameStateService.currentLoadingState.subscribe(loading => this.loadingFinished(loading))
		this.gameStateService.currentGameStartedState.subscribe(started => this._gameStarted = started)
		this.gameStateService.currentGameOver.subscribe(over => this._gameOver = over)
		//this.rxStompService.connectionState$.subscribe(() => {this._connected = this.rxStompService.connectionState$.getValue() === 1})
		this.settingsButton = ButtonDesigner.createNonEventButton('settings')
		this.gameParam.currentCardSize.subscribe(size => this._cardSize = size)
		this.gameParam.currentHandCardSize.subscribe(size => this._handCardSize = size)
		this.apiService.currentSessionValid.subscribe((session) => {
			this.session=session
			this.subscribeWsIfValidSessionIds()
		})
	}
	subscribeWsIfValidSessionIds(): void {
		if (!this.gameId || !this.clientId) {
			return;
		}
		if(this.session!=true){
			return
		}
		this.rxStompService.connectionState$.subscribe(() => {this._connected = this.rxStompService.connectionState$.getValue() === 1})
		this.groupSubscription = this.rxStompService
			.watch(GLOBAL_WS_GROUP + this.gameId)
			.subscribe((message: Message) => this.handleGroupMessage(message.body));

		this.playerSubscription = this.rxStompService
			.watch(GLOBAL_WS_PLAYER + this.gameId + "/" + this.clientId)
			.subscribe((message: Message) => this.handlePlayerMessage(message.body));

		this.acknowledgeSubscription = this.rxStompService
			.watch(GLOBAL_WS_ACKNOWLEDGE + this.gameId + "/" + this.clientId)
			.subscribe((message: Message) => this.handleAcknowledgeMessage(message.body));
	}
	updateClientState(state: PlayerStateModel): void {
		this.playerHand = this.cardInfoService.getProjectCardList(state.getProjectHandIdList())
		this.playerHandCorporation = state.getCorporationHandIdList()
		this._clientState = state
	}
	updatePlayerList(playerIdList: myUUID[]){
		this.playerIdList = playerIdList
	}

	loadingFinished(loading: boolean):void{
		if(loading===true){return}

		this.loaded = loading===false
		this.gameStateService.currentPlayerCount.subscribe(
			playerCount => this.updatePlayerList(playerCount)
		)
		this.gameStateService.currentClientState.subscribe(state => this.updateClientState(state))
	}
	private updateGroupState(states: PlayerStateModel[]){
		this._groupState = states
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
	updateHandHeight(hovered: boolean): void {
		this._handIsHovered = hovered
		const hand = this.elRef.nativeElement.querySelector('#wrapper-hand')
		if (hand && hand.offsetHeight) {
		  const handHeight = hand.offsetHeight;
		  document.documentElement.style.setProperty('--hand-height', `${handHeight}px`);
		}
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
		if(scrollChanged === this.isScrolled){return}
	  	this.isScrolled = window.scrollY > 0;
	}
}
