import { Component, inject, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PhasePlanificationComponent } from '../../phases/phase-planification/phase-planification.component';
import { PhaseProductionComponent } from '../../phases/phase-production/phase-production.component';
import { NonSelectablePhase } from '../../../types/global.type';
import { ProjectCardListComponent } from '../../cards/project/project-card-list/project-card-list.component';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { ChildButton, EventCardBuilderButton, EventSecondaryButton } from '../../../models/core-game/button.model';
import { DrawEventHandler, EventHandler } from '../../../models/core-game/handlers.model';
import { DrawEvent, EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { PhaseCardUpgradeSelectorComponent } from '../../cards/phase/phase-card-upgrade-selector/phase-card-upgrade-selector.component';
import { EventDesigner } from '../../../services/designers/event-designer.service';
import { EventMainButtonComponent } from "../../tools/event-main-button/event-main-button.component";
import { EventSecondaryButtonComponent } from '../../tools/event-secondary-button/event-secondary-button.component';
import { ProjectCardModel } from '../../../models/cards/project-card.model';
import { CardBuilderListComponent } from '../../cards/card-builder-list/card-builder-list.component';
import { WebsocketHandler } from '../../../models/core-game/websocket-handler';
import { WsInputMessage } from '../../../interfaces/websocket.interface';

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
	EventSecondaryButtonComponent,
	CardBuilderListComponent
],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.scss',
  providers: [
	EventHandler,
	DrawEventHandler,
	WebsocketHandler
]
})
export class GameEventComponent {
	constructor(
		private gameStateService: GameState,
		//private webSocketService: WebsocketService
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

	@ViewChild('cardListSelector') cardListSelector!: ProjectCardListComponent

	private readonly eventHandler = inject(EventHandler)
	private readonly drawHandler = inject(DrawEventHandler)
	private readonly wsHandler = inject(WebsocketHandler)

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
			case('development'):{events.push(EventDesigner.createPhase('developmentPhase'));break}
			case('construction'):{events.push(EventDesigner.createPhase('constructionPhase'));break}
			case('action'):{events.push(EventDesigner.createCardSelector('actionPhase'));break}
			case('production'):{events.push(EventDesigner.createPhase('productionPhase'));break}
			case('research'):{events.push(EventDesigner.createPhase('researchPhase'));break}
			
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

	handleEventQueueNext(eventQueue: EventBaseModel[]): void {this.currentEvent = this.eventHandler.handleQueueUpdate(eventQueue)}

	public updateSelectedCardList(cardList: ProjectCardModel[]){this.eventHandler.updateSelectedCardList(cardList)}
	public childButtonClicked(button: ChildButton ){console.log('game event child button push clicked received')}
	public eventMainButtonClicked(){this.eventHandler.eventMainButtonClicked()}
	public eventCardBuilderListButtonClicked(button: EventCardBuilderButton){
		this.eventHandler.cardBuilderButtonClicked(button)
		if(button.name==='buildCard'){
			this.cardListSelector.updateDiscount(this.currentEvent as EventCardBuilder)
		}
	}
	public phaseSelected(): void {this.eventHandler.updateEventMainButton(true)}
	private handleMessage(message: any){
		this.wsHandler.handleMessage(message as WsInputMessage)
	}
}
