import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PhasePlanificationComponent } from '../../phases/phase-planification/phase-planification.component';
import { PhaseProductionComponent } from '../../phases/phase-production/phase-production.component';
import { ButtonNames, NonSelectablePhase } from '../../../types/global.type';
import { ProjectCardListComponent } from '../../cards/project/project-card-list/project-card-list.component';
import { ButtonBase, EventCardBuilderButton, NonEventButton } from '../../../models/core-game/button.model';
import { DrawEventHandler, EventHandler } from '../../../models/core-game/handlers.model';
import { DrawEvent, EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { PhaseCardUpgradeSelectorComponent } from '../../cards/phase/phase-card-upgrade-selector/phase-card-upgrade-selector.component';
import { EventDesigner } from '../../../services/designers/event-designer.service';
import { EventMainButtonComponent } from "../../tools/button/event-main-button.component";
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { ProjectCardModel } from '../../../models/cards/project-card.model';
import { CardBuilderListComponent } from '../../cards/card-builder-list/card-builder-list.component';

import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { ButtonDesigner } from '../../../services/designers/button-designer.service';

//this component is the main controller, and view

@Component({
  selector: 'app-game-event',
  standalone: true,
  imports: [
    CommonModule,
    PhasePlanificationComponent,
    PhaseProductionComponent,
    ProjectCardListComponent,
    PhaseCardUpgradeSelectorComponent,
    EventMainButtonComponent,
	CardBuilderListComponent,
	NonEventButtonComponent
],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.scss',
  providers: [
	EventHandler,
	DrawEventHandler
]
})
export class GameEventComponent {
	constructor(
		private gameStateService: GameState,
	){}

	delete: EventBaseModel[] = []

	clientPlayerId!:number
	currentEvent!: EventBaseModel | undefined
	currentEventId: number = -1
	eventCounter: number = -1

	currentPhase: NonSelectablePhaseEnum = NonSelectablePhaseEnum.planification;
	currentButtonSelectorId!: number;

	//Non event buttons
	sellCardsButton!: NonEventButton;
	sellCardsCancelButton!: NonEventButton;

	phaseList: NonSelectablePhase[] = [
		'planification',
		'development',
		'construction',
		'action',
		'production',
		'research'
	]
	selectionActive: boolean = false

	@ViewChild('cardListSelector') cardListSelector!: ProjectCardListComponent

	private readonly eventHandler = inject(EventHandler)
	private readonly drawHandler = inject(DrawEventHandler)

	ngOnInit(): void {
		this.currentButtonSelectorId = -1
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.sellCardsButton = ButtonDesigner.createNonEventButton('sellOptionalCard')
		this.sellCardsCancelButton = ButtonDesigner.createNonEventButton('sellOptionalCardCancel')

		this.gameStateService.currentPhase.subscribe(phase => this.updatePhase(phase))
		this.gameStateService.currentDrawQueue.subscribe(drawQueue => this.handleDrawQueueNext(drawQueue))
		this.gameStateService.currentEventQueue.subscribe(eventQueue => this.handleEventQueueNext(eventQueue))
	}

	updatePhase(phase:NonSelectablePhaseEnum):void{
		this.currentPhase = phase
		let events: EventBaseModel[] = []
		switch(phase){
			case(NonSelectablePhaseEnum.undefined):{return}
			case(NonSelectablePhaseEnum.planification):{
				this.gameStateService.clearEventQueue()
				events.push(EventDesigner.createGeneric('planificationPhase'))
				break}
			case(NonSelectablePhaseEnum.development):{events.push(EventDesigner.createPhase('developmentPhase'));break}
			case(NonSelectablePhaseEnum.construction):{events.push(EventDesigner.createPhase('constructionPhase'));break}
			case(NonSelectablePhaseEnum.action):{events.push(EventDesigner.createCardSelector('actionPhase'));break}
			case(NonSelectablePhaseEnum.production):{events.push(EventDesigner.createPhase('productionPhase'));break}
			case(NonSelectablePhaseEnum.research):{events.push(EventDesigner.createPhase('researchPhase'));break}

		}
		events.push(EventDesigner.createCardSelector('selectCardForcedSell'))
		events.push(EventDesigner.createGeneric('endOfPhase'))
		this.gameStateService.addEventQueue(events,'last')
	}

	addPhaseCardUpgradeEvent(upgradeNumber:number, phaseIndexToUpgrade?: number[]): void {
		let newEvent = EventDesigner.createGeneric(
			'upgradePhaseCards',
			{
				phaseCardUpgradeNumber: upgradeNumber,
				phaseCardUpgradeList: phaseIndexToUpgrade
			}
		)
		this.gameStateService.addEventQueue(newEvent, 'first')
		//this.gameStateService.addPhaseCardUpgradeNumber(this.clientPlayerId, upgradeNumber)
	}

	handleDrawQueueNext(drawQueue: DrawEvent[]): void {this.drawHandler.handleQueueUpdate(drawQueue)}

	handleEventQueueNext(eventQueue: EventBaseModel[]): void {
		this.currentEvent = this.eventHandler.handleQueueUpdate(eventQueue)
		this.resetSellButtonsState()
	}

	private resetSellButtonsState(): void {
		this.sellCardsButton.resetStartEnabled()
		this.sellCardsCancelButton.resetStartEnabled()
	}
	public buttonClicked(button: ButtonBase) {
		console.log('game event button clicked:', button)
	}
	public updateSelectedCardList(cardList: ProjectCardModel[]){this.eventHandler.updateSelectedCardList(cardList)}
	public nonEventButtonClicked(button: NonEventButton){
		switch(button.name){
			case('sellOptionalCard'):{
				this.gameStateService.addEventQueue(EventDesigner.createCardSelector('selectCardOptionalSell'), 'first')
				this.sellCardsButton.updateEnabled(false)
				this.sellCardsCancelButton.updateEnabled(true)
				break
			}
			case('sellOptionalCardCancel'):{
				this.eventHandler.cancelSellCardsOptional()
			}
		}
	}
	public eventMainButtonClicked(){this.eventHandler.eventMainButtonClicked()}
	public eventCardBuilderListButtonClicked(button: EventCardBuilderButton){
		this.eventHandler.cardBuilderButtonClicked(button)
		if(button.name==='buildCard'){
			this.cardListSelector.updateDiscount(this.currentEvent as EventCardBuilder)
		}
	}
	public phaseSelected(): void {this.eventHandler.updateEventMainButton(true)}
}
