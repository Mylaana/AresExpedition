import { Component, OnInit, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { DrawEvent, EventBaseModel } from '../../../models/core-game/event.model';
import { MessageContentQueryEnum } from '../../../enum/websocket.enum';
import { Subscription, take } from 'rxjs';
import { RxStompService } from '../../../services/websocket/rx-stomp.service';
import { WebsocketQueryMessageFactory } from '../../../services/designers/websocket-message-factory.service';
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from '../../../enum/phase.enum';
import { PlayerReadyModel } from '../../../models/player-info/player-state.model';

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Component({
	selector: 'app-server-emulation',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './server-emulation.component.html',
	styleUrl: './server-emulation.component.scss',
})
export class ServerEmulationComponent implements OnInit, AfterViewInit {
	debug: boolean = false;
	currentGroupPlayerState!: {};
	currentEventQueue: EventBaseModel[] = [];
	currentPhase: string = "planification";
	currentDrawQueue: DrawEvent[] = []
	currentGroupReady: PlayerReadyModel[] = []
	cardsDeck: number[] = [];
	cardsDiscarded: number[] = [];
	phaseList: SelectablePhaseEnum[] = [SelectablePhaseEnum.development,SelectablePhaseEnum.construction,SelectablePhaseEnum.action,SelectablePhaseEnum.production,SelectablePhaseEnum.research]
	authorizedBotPhaseSelection: SelectablePhaseEnum[] = [SelectablePhaseEnum.development,SelectablePhaseEnum.construction,SelectablePhaseEnum.action,SelectablePhaseEnum.production,SelectablePhaseEnum.research]

	//@ts-ignore
	private groupSubscription: Subscription;
	//@ts-ignore
	private playerSubscription: Subscription;

	constructor(private gameStateService: GameState,
		private cardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService
	){}


	ngOnInit(){
		this.cardsDeck = this.cardInfoService.getProjectCardIdList()

		this.gameStateService.addPlayer("joueur 1", "rgb(0, 0, 255)")
		this.gameStateService.addPlayer("joueur 2", "rgb(255, 0, 0)")
		this.gameStateService.addPlayer("joueur 3", "rgb(0, 255, 0)")
		this.gameStateService.addPlayer("joueur 4", "rgb(255, 255, 255)")

		this.gameStateService.currentPhase.subscribe(
			phase => this.phaseChanged(phase)
		)
		this.gameStateService.currentGroupPlayerState.subscribe(
			groupPlayerState => this.currentGroupPlayerState = groupPlayerState
		)
		this.gameStateService.currentDrawQueue.subscribe(
			//drawQueue => this.handleDrawQueueRequest(drawQueue)
		)
		this.gameStateService.currentLoadingState.subscribe(
			loading => this.loadingFinished(loading)
		)
		this.gameStateService.currentEventQueue.subscribe(
			event => this.currentEventQueue = event
		)
		this.gameStateService.currentGroupPlayerReady.subscribe(
			ready => this.currentGroupReady = ready
		)



		//force draw card list for debug purpose
		//let cardDrawList: number[] = [263, 36, 222, 81, 123, 204, 141, 253]
		let cardDrawList: number[] = [253]
		//this.gameStateService.addRessourceToClient([{name:"megacredit", valueStock:50}])
		//this.gameStateService.addCardsToClientHand(cardDrawList)
	}

	ngAfterViewInit(): void {
		this.gameStateService.setPlayerIdList([0,1,2,3])
	}

	phaseChanged(phase: NonSelectablePhaseEnum){
		if(this.gameStateService.loading.getValue()===true){return}
		this.currentPhase = phase

		if(this.currentPhase===NonSelectablePhaseEnum.planification){
			this.planificationPhaseBotSelection()
		}

		//bots autoready
		//setTimeout(() => {this.sendBotsReady()}, 10000);
		this.sendBotsReady()
	}
	planificationPhaseBotSelection(){
		for(let index of this.gameStateService.playerCount.getValue()){
			if(index===this.gameStateService.clientPlayerId){continue}

		}
	}

	printPlayersState(): void {
		console.log(this.currentGroupPlayerState)
		this.gameStateService.currentGroupPlayerReady.pipe(take(1)).subscribe(value => {console.log(value);});
	}

	loadingFinished(loading: boolean):void{
		if(loading===true){return}
	}
	sendDrawNumber(): void {
		this.rxStompService.publishDraw(2, -1)
	}
	sendReady(): void {
		//this.websocket.sendReady(true)
		/*
		let message = JSON.stringify(WebsocketQueryMessageFactory.createReadyQuery(true))
		this.rxStompService.publish({ destination: '/app/player', body: message });
		*/
		this.rxStompService.publishClientPlayerReady(true)
	}
	sendNotReady(): void {
		let message = JSON.stringify(WebsocketQueryMessageFactory.createReadyQuery(false))
		this.rxStompService.publish({ destination: '/app/player', body: message });
		//this.websocket.sendReady(false)
	}
	sendtest(): void {
		let message = JSON.stringify("test")
		this.rxStompService.publish({ destination: '/app/debug', body: message});
		//this.websocket.sendReady(false)
	}
	sendBotsReady(): void {
		this.rxStompService.publishDebugMessage({content:'SET_BOTS_READY'})
		//this.rxStompService.publish({ destination: '/app/debug', body: JSON.stringify("SET_BOTS_READY") });

		return
		for(let index of this.gameStateService.playerCount.getValue()){
			if(index===this.gameStateService.clientPlayerId){continue}
			this.botIdReady(index)
		}
	}
	botIdReady(id: number){
		//this.websocket.sendDebugMessage({gameId:1,playerId:id,contentEnum:MessageContentQueryEnum.ready,content:{ready:true}})
		let message = {gameId:1,playerId:id,contentEnum:MessageContentQueryEnum.ready,content:{ready:true}}
		this.rxStompService.publish({ destination: '/app/player', body: JSON.stringify(message) });
	}
	printEventQueue(): void {
		this.gameStateService.currentEventQueue.pipe(take(1)).subscribe(value => {console.log(value);});
	}
	printDrawQueue(): void {
		this.gameStateService.currentDrawQueue.pipe(take(1)).subscribe(value => {console.log(value);});
	}
}
