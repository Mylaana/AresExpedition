import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../../services/core-game/game-state.service';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';
import { DrawEvent, EventBaseModel } from '../../../../models/core-game/event.model';
import { MessageContentQueryEnum } from '../../../../enum/websocket.enum';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { RxStompService } from '../../../../services/websocket/rx-stomp.service';
import { WebsocketQueryMessageFactory } from '../../../../factory/websocket-message-factory.service';
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from '../../../../enum/phase.enum';
import { PlayerReadyModel } from '../../../../models/player-info/player-state.model';
import { myUUID, TagType } from '../../../../types/global.type';
import { GlobalParameterNameEnum } from '../../../../enum/global.enum';
import { GameParamService } from '../../../../services/core-game/game-param.service';

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Component({
    selector: 'app-server-emulation',
    imports: [
        CommonModule,
    ],
    templateUrl: './server-emulation.component.html',
    styleUrl: './server-emulation.component.scss'
})
export class ServerEmulationComponent implements OnInit, AfterViewInit, OnDestroy {
	debug: boolean = false;
	currentGroupPlayerState!: {};
	currentEventQueue: EventBaseModel[] = [];
	currentPhase: string = "planification";
	currentDrawQueue: DrawEvent[] = []
	currentGroupReady: PlayerReadyModel[] = []
	cardsDiscarded: number[] = [];
	phaseList: SelectablePhaseEnum[] = [SelectablePhaseEnum.development,SelectablePhaseEnum.construction,SelectablePhaseEnum.action,SelectablePhaseEnum.production,SelectablePhaseEnum.research]
	authorizedBotPhaseSelection: SelectablePhaseEnum[] = [SelectablePhaseEnum.development,SelectablePhaseEnum.construction,SelectablePhaseEnum.action,SelectablePhaseEnum.production,SelectablePhaseEnum.research]

	clientId: myUUID = ''

	//@ts-ignore
	private groupSubscription: Subscription;
	//@ts-ignore
	private playerSubscription: Subscription;

	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState,
		private cardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService,
		private gameParam: GameParamService
	){}

	ngOnInit(){
		this.gameStateService.currentPhase.pipe(takeUntil(this.destroy$)).subscribe(
			phase => this.phaseChanged(phase)
		)
		this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(
			groupPlayerState => this.currentGroupPlayerState = groupPlayerState
		)
		this.gameStateService.currentDrawQueue.pipe(takeUntil(this.destroy$)).subscribe(
			//drawQueue => this.handleDrawQueueRequest(drawQueue)
		)
		this.gameStateService.currentLoadingState.pipe(takeUntil(this.destroy$)).subscribe(
			loading => this.loadingFinished(loading)
		)
		this.gameStateService.currentEventQueue.pipe(takeUntil(this.destroy$)).subscribe(
			event => this.currentEventQueue = event
		)
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe(
			ready => this.onGroupReadyUpdate(ready)
		)
		this.gameParam.currentDebug.subscribe(debug => this.debug = debug)


		//EventDesigner.createGeneric('upgradePhaseCards', {phaseCardUpgradeList:phaseCardList, phaseCardUpgradeNumber:phaseCardUpgradeCount})
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	ngAfterViewInit(): void {
		//this.gameStateService.setPlayerIdList([0,1,2,3])
	}

	phaseChanged(phase: NonSelectablePhaseEnum){
		//if(this.loading===true){return}
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
			if(index===this.clientId){continue}

		}
	}

	printPlayersState(): void {
		console.log(this.currentGroupPlayerState)
		this.gameStateService.currentGroupPlayerReady.pipe(take(1)).subscribe(value => {console.log(value);});
	}

	loadingFinished(loading: boolean):void{
		if(loading===true){return}
	}
	sendDrawNumber(drawNumber: number): void {
		this.rxStompService.publishDraw(drawNumber, -1, this.gameStateService.getClientStateDTO())
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
		//this.rxStompService.publishDebugMessage({content:'SET_BOTS_READY'})
		//this.rxStompService.publish({ destination: '/app/debug', body: JSON.stringify("SET_BOTS_READY") });

		return
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
	onGroupReadyUpdate(groupReady: PlayerReadyModel[]): void {
		this.currentGroupReady = groupReady
	}
	addRessources(): void {
		this.gameStateService.addRessourceToClient([{name:"megacredit", valueStock:200}])
	}
	drawCards(): void {
		//force draw card list for debug purpose
		let cardDrawList: string[] = ['F14', 'F04']

		this.gameStateService.addCardsToClientHand(cardDrawList)
		this.gameStateService.updateClientState(this.gameStateService.getClientState())
		this.gameStateService.cleanAndNextEventQueue()

	}
	playCard(){
		let playCard = this.cardInfoService.getCardById('FM4')
		if(playCard){
			this.gameStateService.playCardFromClientHand(playCard, 'project')
		}
	}
	resetTag(): void {
		let state = this.gameStateService.getClientState()
		let tags = state.getTags()
		for(let tag of tags){
			tag.valueCount=0
			if(tag.name==='science'){
			}
		}
		this.gameStateService.updateClientState(state)
	}
	getTagName(index: number): string {
		for(let tag of this.gameStateService.getClientState().getTags()){
			if(tag.id===index){
				return tag.name
			}
		}
		return ''
	}
	addTag(index: number) {
		this.gameStateService.addTagFromOtherSourceToClient(this.getTagName(index) as TagType)
	}
	resetRessource(): void {
		let state = this.gameStateService.getClientState()
		let ressources = state.getRessources()
		for(let ressource of ressources){
			ressource.valueStock=0
			ressource.valueProd=0
		}
		this.gameStateService.updateClientState(state)
	}
	getRessourceName(index: number): string {
		for(let ressource of this.gameStateService.getClientState().getRessources()){
			if(ressource.id===index){
				return ressource.name
			}
		}
		return ''
	}
	addRessource(index: number) {
		let state = this.gameStateService.getClientState()
		let ressources = state.getRessources()
		for(let ressource of ressources){
			if(ressource.id!=index){continue}
			switch(index){
				case(0):{
					this.gameStateService.addRessourceToClient([{name:'megacredit', valueStock:10}])
					return
				}
				case(1):{
					this.gameStateService.addRessourceToClient([{name:'heat', valueStock:5}])
					break
				}
				case(2):{
					this.gameStateService.addRessourceToClient([{name:'plant', valueStock:5}])
					return
				}
				case(3):case(4):{
					ressource.valueProd+=1
					this.gameStateService.updateClientState(state)
					return
				}
			}
		}
	}
	getParameterName(index: number): GlobalParameterNameEnum{
		switch(index){
			case(0):{return GlobalParameterNameEnum.ocean}
			case(1):{return GlobalParameterNameEnum.temperature}
			case(2):{return GlobalParameterNameEnum.oxygen}
			case(3):{return GlobalParameterNameEnum.infrastructure}
		}
		return GlobalParameterNameEnum.ocean
	}
	addParameter(index: number) {
		this.gameStateService.addGlobalParameterStepsEOPtoClient({name:this.getParameterName(index), steps:1})
	}
	rapidfireDraw(){
		for(let i = 0; i<10; i++){
			this.sendDrawNumber(1)
		}
	}
}
