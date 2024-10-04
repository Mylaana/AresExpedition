import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PhasePlanificationComponent } from '../../phases/phase-planification/phase-planification.component';
import { PhaseActionComponent } from '../../phases/phase-action/phase-action.component';
import { PhaseProductionComponent } from '../../phases/phase-production/phase-production.component';
import { PhaseResearchComponent } from '../../phases/phase-research/phase-research.component';
import { NonSelectablePhase } from '../../../types/global.type';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { RessourceState } from '../../../interfaces/global.interface';
import { DrawModel } from '../../../models/core-game/draw.model';
import { ProjectCardListComponent } from '../../cards/project/project-card-list/project-card-list.component';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { ChildButton, EventPlayZoneButton, EventSecondaryButton } from '../../../models/core-game/button.model';
import { ButtonComponent } from '../../tools/button/button.component';
import { EventHandler } from '../../../models/core-game/handlers.model';
import { EventBaseModel, EventCardSelector } from '../../../models/core-game/event.model';
import { PhaseCardUpgradeSelectorComponent } from '../../cards/phase/phase-card-upgrade-selector/phase-card-upgrade-selector.component';
import { EventDesigner } from '../../../services/core-game/event-designer.service';
import { EventButtonComponent } from '../../tools/event-button/event-button.component';
import { EventMainButtonComponent } from "../../tools/event-main-button/event-main-button.component";
import { EventSecondaryButtonComponent } from '../../tools/event-secondary-button/event-secondary-button.component';
import { CardBuilderComponent } from '../card-builder/card-builder.component';
import { ProjectCardModel } from '../../../models/cards/project-card.model';

//this component will serve as game event view, displaying phase selection, phase actions, cards to play/select etc

@Component({
  selector: 'app-game-event',
  standalone: true,
  imports: [
    CommonModule,
    PhasePlanificationComponent,
    PhaseActionComponent,
    PhaseProductionComponent,
    PhaseResearchComponent,
    ProjectCardListComponent,
    PlayerReadyComponent,
    ButtonComponent,
    PhaseCardUpgradeSelectorComponent,
    EventButtonComponent,
    EventMainButtonComponent,
	EventSecondaryButtonComponent,
	CardBuilderComponent
],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.scss',
  providers: [EventHandler]
})
export class GameEventComponent {
	constructor(
		private gameStateService: GameState,
		private cardInfoService: ProjectCardInfoService
	){}

	delete: EventBaseModel[] = []

	clientPlayerId!:number
	currentEvent!: EventBaseModel | undefined
	currentEventId: number = -1
	eventCounter: number = -1

	currentPhase: NonSelectablePhase = "planification";
	currentButtonSelectorId!: number;
	sellCardsButton!: EventSecondaryButton;

	phaseList: NonSelectablePhase[] = [
		'planification',
		'development',
		'construction',
		'action',
		'production',
		'research'
	]
	selectionActive: boolean = false

	private readonly eventHandler = inject(EventHandler)

	ngOnInit(): void {
		this.currentButtonSelectorId = -1
		this.clientPlayerId = this.gameStateService.clientPlayerId

		this.gameStateService.currentPhase.subscribe(
			phase => this.updatePhase(phase)
		)
		this.gameStateService.currentDrawQueue.subscribe(
			drawQueue => this.handleDrawQueueNext(drawQueue)
		)
		this.gameStateService.currentEventQueue.subscribe(
			eventQueue => this.handleEventQueueNext(eventQueue)
		)
	}

	updatePhase(phase:NonSelectablePhase):void{
		this.currentPhase = phase
		let events: EventBaseModel[] = []
		switch(phase){
			case('planification'):{events.push(EventDesigner.createGeneric('planificationPhase'));break}
			case('development'):{events.push(EventDesigner.createCardSelectorPlayZone('developmentPhase'));break}
			case('construction'):{events.push(EventDesigner.createCardSelectorPlayZone('constructionPhase'));break}
			case('action'):{events.push(EventDesigner.createCardSelector('actionPhase'));break}
			case('production'):{this.applyProductionPhase(this.gameStateService.getClientPlayerState());break}
			case('research'):{this.applyResearchPhase(this.gameStateService.getClientPlayerState());break}
		}
		events.push(EventDesigner.createCardSelector('selectCardForcedSell'))
		events.push(EventDesigner.createGeneric('endOfPhase'))
		this.gameStateService.addEventQueue(events)
	}

	/**
	 * adds client player's production to stocks
	 */
	applyProductionPhase(clientState: PlayerStateModel): void{
		let newEvent = EventDesigner.createGeneric('productionPhase')
		let newClientRessource: RessourceState[] = []

		newClientRessource = clientState.ressource

		for(let i=0; i<newClientRessource.length; i++){
			if(i===3 || i===4){
			continue
			}
			//megacredit prod
			if(i===0){
			newClientRessource[i].valueStock = newClientRessource[i].valueStock + newClientRessource[i].valueProd + clientState.terraformingRating
			continue
			}
			//cards prod
			if(i===5){
			let draw = new DrawModel;
			draw.playerId = clientState.id
			draw.cardNumber = newClientRessource[i].valueProd
			draw.drawRule = 'draw'
			this.gameStateService.addDrawQueue(draw)
			continue
			}
			//other prod
			newClientRessource[i].valueStock = newClientRessource[i].valueStock + newClientRessource[i].valueProd
		}

		this.gameStateService.updateClientPlayerState(clientState)
		this.gameStateService.addEventQueue(newEvent)
	}

	applyResearchPhase(clientState: PlayerStateModel): void{
		let draw = new DrawModel;
		draw.playerId = clientState.id
		draw.cardNumber = clientState.research.scan + 2
		draw.drawRule = 'research'
		this.gameStateService.addDrawQueue(draw)
	}

	addDrawQueue(playerId: number, cardNumber: number): void {
		let draw = new DrawModel;
		draw.playerId = playerId
		draw.cardNumber = cardNumber
		draw.drawRule = 'draw'
		this.gameStateService.addDrawQueue(draw)
	}

	addPhaseCardUpgradeEvent(upgradeNumber:number, phaseIndexToUpgrade?: number[]): void {
		let newEvent = EventDesigner.createGeneric(
			'upgradePhaseCards',
			{
				phaseCardUpgradeNumber: upgradeNumber,
				phaseCardUpgradeList: phaseIndexToUpgrade
			}
		)
		this.gameStateService.addEventQueue(newEvent, true)
		this.gameStateService.addPhaseCardUpgradeNumber(this.clientPlayerId, upgradeNumber)
	}
	handleDrawQueueNext(drawQueue: DrawModel[]): void {
		if(drawQueue.length===0){
			return
		}
		let callCleanAndNext: boolean = false;

		for(let element of drawQueue){
			if(element.isFinalized===true){
				callCleanAndNext = true
				continue
			}
			if(element.cardList.length===0){continue}

			//elements found
			element.isFinalized = true
			callCleanAndNext = true

			//preventing bot players to draw
			if(element.playerId!=0){continue}
			if(element.drawRule==='draw'){
				this.gameStateService.addCardToPlayerHand(element.playerId, element.cardList)
			}
			if(element.drawRule==='research'){
				let newEvent = EventDesigner.createCardSelector(
					'researchPhaseResult',
					{
						cardSelector:{
							selectFrom: this.cardInfoService.getProjectCardList(element.cardList),
							selectedList: [],
							selectionQuantity: this.gameStateService.getClientPlayerResearchMods().keep
						}
					}
				)
				this.gameStateService.addEventQueue(newEvent)
			}
			if(element.drawRule==='scanKeep'){
				if(!element.keepCardNumber){break}
				let newEvent = EventDesigner.createCardSelector(
					'scanKeepResult',
					{
						cardSelector:{
							selectFrom: this.cardInfoService.getProjectCardList(element.cardList),
							selectedList: [],
							selectionQuantity: element.keepCardNumber
						}
					}
				)
				this.gameStateService.addEventQueue(newEvent,true)
			}
		};
		if(callCleanAndNext===false){return}
		this.gameStateService.cleanAndNextDrawQueue()
	}

	handleEventQueueNext(eventQueue: EventBaseModel[]): void {
		this.currentEvent = this.eventHandler.handleQueueUpdate(eventQueue)
	}

	public updateSelectedCardList(cardList: ProjectCardModel[]){
		console.log('game event push received: ', cardList)
		this.eventHandler.updateSelectedCardList(cardList)
	}

	public childButtonClicked(button: ChildButton ){
		//this.currentEvent.
	}
	public eventMainButtonClicked(){this.eventHandler.eventMainButtonClicked()}
	public eventCardBuilderButtonClicked(button: EventPlayZoneButton){this.eventHandler.playZoneButtonClicked(button)}
	public phaseSelected(): void {this.eventHandler.updateEventMainButton(true)}

}
