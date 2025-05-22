import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { enterFromLeft, expandCollapseVertical, fadeIn, fadeInFadeOut } from '../../../../animations/animations';
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from '../../../../enum/phase.enum';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { ButtonBase, EventCardBuilderButton, NonEventButton } from '../../../../models/core-game/button.model';
import { DrawEvent, EventBaseModel, EventCardBuilder } from '../../../../models/core-game/event.model';
import { DrawEventHandler, EventHandler } from '../../../../models/core-game/handlers.model';
import { GameState } from '../../../../services/core-game/game-state.service';
import { ButtonDesigner } from '../../../../services/designers/button-designer.service';
import { EventDesigner } from '../../../../services/designers/event-designer.service';
import { ProjectListType } from '../../../../types/project-card.type';
import { CardBuilderListComponent } from '../../../cards/card-builder-list/card-builder-list.component';
import { PhaseCardUpgradeSelectorComponent } from '../../../cards/phase/phase-card-upgrade-selector/phase-card-upgrade-selector.component';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { EventMainButtonComponent } from "../../../tools/button/event-main-button.component";
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { TextWithImageComponent } from '../../../tools/text-with-image/text-with-image.component';
import { InitialDraftComponent } from '../../../game-initialization/initial-draft/initial-draft.component';
import { WaitingReadyComponent } from '../../waiting-ready/waiting-ready.component';
import { PhasePlanificationComponent } from '../../../game-event-blocks/phase-planification/phase-planification.component';
import { PhaseProductionComponent } from '../../../game-event-blocks/phase-production/phase-production.component';
import { PhaseActionComponent } from '../../../game-event-blocks/phase-action/phase-action.component';
import { PhaseBuilderComponent } from '../../../game-event-blocks/phase-builder/phase-builder.component';

//this component is the main controller, and view

@Component({
    selector: 'app-game-event',
    imports: [
        CommonModule,
        PhasePlanificationComponent,
        PhaseProductionComponent,
        PlayableCardListComponent,
        PhaseCardUpgradeSelectorComponent,
        EventMainButtonComponent,
        NonEventButtonComponent,
        TextWithImageComponent,
        PhaseActionComponent,
        InitialDraftComponent,
        WaitingReadyComponent,
		PhaseBuilderComponent
    ],
    templateUrl: './game-event.component.html',
    styleUrl: './game-event.component.scss',
    animations: [expandCollapseVertical, enterFromLeft, fadeIn, fadeInFadeOut],
    providers: [
        EventHandler,
        DrawEventHandler
    ]
})
export class GameEventComponent {
	constructor(
		private elRef: ElementRef, private renderer: Renderer2,
		private gameStateService: GameState,
	){}
	delete: EventBaseModel[] = []

	currentEvent!: EventBaseModel | undefined
	currentEventId: number = -1
	eventCounter: number = -1

	currentPhase: NonSelectablePhaseEnum = NonSelectablePhaseEnum.planification;
	currentButtonSelectorId!: number;

	//Non event buttons
	sellCardsButton!: NonEventButton;
	sellCardsCancelButton!: NonEventButton;
	rollbackButton!: NonEventButton;

	phaseList: NonSelectablePhaseEnum[] = [
		NonSelectablePhaseEnum.planification,
		NonSelectablePhaseEnum.development,
		NonSelectablePhaseEnum.construction,
		NonSelectablePhaseEnum.action,
		NonSelectablePhaseEnum.production,
		NonSelectablePhaseEnum.research
	]
	selectionActive: boolean = false

	_selectedPhaseList: SelectablePhaseEnum[] = []

	@ViewChild('cardListSelector') cardListSelector!: PlayableCardListComponent

	private readonly eventHandler = inject(EventHandler)
	private readonly drawHandler = inject(DrawEventHandler)
	private destroy$ = new Subject<void>()

	ngOnInit(): void {
		this.currentButtonSelectorId = -1
		this.sellCardsButton = ButtonDesigner.createNonEventButton('sellOptionalCard')
		this.sellCardsCancelButton = ButtonDesigner.createNonEventButton('sellOptionalCardCancel')
		this.rollbackButton = ButtonDesigner.createNonEventButton('rollBack')

		this.gameStateService.currentPhase.pipe(takeUntil(this.destroy$)).subscribe(phase => this.updatePhase(phase))
		this.gameStateService.currentDrawQueue.pipe(takeUntil(this.destroy$)).subscribe(drawQueue => this.handleDrawQueueNext(drawQueue))
		this.gameStateService.currentEventQueue.pipe(takeUntil(this.destroy$)).subscribe(eventQueue => this.handleEventQueueNext(eventQueue))
		this.gameStateService.currentSelectedPhaseList.pipe(takeUntil(this.destroy$)).subscribe(list => this._selectedPhaseList = list)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	ngAfterViewInit(): void {
		const commandPannel = this.elRef.nativeElement.querySelector('#command-pannel');
		if (commandPannel) {
			const commandPannelHeight = commandPannel.offsetHeight;
			this.elRef.nativeElement.style.setProperty('--command-pannel-height', `${commandPannelHeight}px`);
		}
	}
	updatePhase(phase:NonSelectablePhaseEnum):void{
		this.currentPhase = phase
		if(this.gameStateService.getClientReady()){return}
		let events: EventBaseModel[] = []
		switch(phase){
			case(NonSelectablePhaseEnum.undefined):{return}
			case(NonSelectablePhaseEnum.planification):{events.push(EventDesigner.createGeneric('planificationPhase'));break}
			case(NonSelectablePhaseEnum.development):{events.push(EventDesigner.createPhase('developmentPhase'));break}
			case(NonSelectablePhaseEnum.construction):{events.push(EventDesigner.createPhase('constructionPhase'));break}
			case(NonSelectablePhaseEnum.action):{events.push(EventDesigner.createPhase('actionPhase'));break}
			case(NonSelectablePhaseEnum.production):{events.push(EventDesigner.createPhase('productionPhase'));break}
			case(NonSelectablePhaseEnum.research):{events.push(EventDesigner.createPhase('researchPhase'));break}

		}
		events.push(EventDesigner.createCardSelector('selectCardForcedSell'))
		events.push(EventDesigner.createGeneric('endOfPhase'))
		events.push(EventDesigner.createGeneric('waitingGroupReady'))
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
		if(!this.currentEvent){return}
		this.resetValidateButtonState(this.currentEvent)
		this.resetMainButtonState(this.currentEvent)
		this.updateSellButtonsDisplay(this.currentEvent)
	}
	private resetMainButtonState(event: EventBaseModel): void {

		this.sellCardsButton.resetStartEnabled()
		this.sellCardsButton.locked = event.lockSellButton
		this.sellCardsCancelButton.resetStartEnabled()
		this.sellCardsCancelButton.locked = event.lockSellButton
		this.rollbackButton.resetStartEnabled()
		this.rollbackButton.locked = event.lockRollbackButton
	}
	private resetValidateButtonState(event: EventBaseModel): void {
		if(!event.button){return}
		event.button.resetStartEnabled()
		event.button.locked = event.lockValidateButton
	}
	private updateSellButtonsDisplay(event: EventBaseModel){
		switch(event.subType){
			case('selectCardOptionalSell'):{
				this.sellCardsCancelButton.displayed = true
				this.sellCardsButton.displayed = false
				break
			}
			default:{
				this.sellCardsCancelButton.displayed = false
				this.sellCardsButton.displayed = true
			}
		}
	}
	public buttonClicked(button: ButtonBase) {
		console.log('game event button clicked:', button)
	}
	public onUpdateSelectedCardList(input: {selected: PlayableCardModel[], listType: ProjectListType}){
		this.eventHandler.updateSelectedCardList(input.selected, input.listType)
	}
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
	public onProjectActivated(input: {card: PlayableCardModel, twice: boolean}){
		this.eventHandler.onProjectActivated(input)
	}
	public onActionPhaseStateUpdate(): void {
		this.eventHandler.updateActionPhaseMainButtonState()
	}
	public eventMainButtonClicked(){this.eventHandler.eventMainButtonClicked()}
	public onCardBuilderButtonClicked(button: EventCardBuilderButton){
		this.eventHandler.cardBuilderButtonClicked(button)
	}
	public onPhaseSelected(): void {this.eventHandler.updateValidateButton(true)}
}
