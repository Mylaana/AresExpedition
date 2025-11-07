import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { enterFromLeft, expandCollapseVertical, fadeIn, fadeInFadeOut } from '../../../../animations/animations';
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from '../../../../enum/phase.enum';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { ButtonBase, EventCardBuilderButton, NonEventButton } from '../../../../models/core-game/button.model';
import { DrawEvent, EventBaseModel, EventPhase } from '../../../../models/core-game/event.model';
import { DrawEventHandler, EventHandler } from '../../../../models/core-game/handlers.model';
import { GameState } from '../../../../services/game-state/game-state.service';
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { ActivationOption, ProjectListType } from '../../../../types/project-card.type';
import { PhaseCardUpgradeSelectorComponent } from '../../../cards/phase/phase-card-upgrade-selector/phase-card-upgrade-selector.component';
import { PlayableCardListComponent } from '../../../cards/project/playable-card-list/playable-card-list.component';
import { EventMainButtonComponent } from "../../../tools/button/event-main-button.component";
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { InitialDraftComponent } from '../../../game-initialization/initial-draft/initial-draft.component';
import { WaitingReadyComponent } from '../../waiting-ready/waiting-ready.component';
import { PhasePlanificationComponent } from '../../../game-event-blocks/phase-planification/phase-planification.component';
import { PhaseProductionComponent } from '../../../game-event-blocks/phase-production/phase-production.component';
import { PhaseActionComponent } from '../../../game-event-blocks/phase-action/phase-action.component';
import { PhaseBuilderComponent } from '../../../game-event-blocks/phase-builder/phase-builder.component';
import { EventFactory } from '../../../../factory/event/event-factory';
import { TagGainListComponent } from '../../../game-event-blocks/tag-gain-list/tag-gain-list.component';
import { SellCardsComponent } from '../../../game-event-blocks/sell-cards/sell-cards.component';
import { EffectPortalComponent } from '../../../game-event-blocks/effect-portal/effect-portal.component';
import { LeftPannelComponent } from '../../../game-event-blocks/left-pannel/left-pannel.component';
import { ConvertResourceComponent } from '../../../game-event-blocks/convert-resource/convert-resource.component';
import { GameParamService } from '../../../../services/core-game/game-param.service';
import { SettingInterfaceSize } from '../../../../types/global.type';
import { EventTitleKeyPipe } from '../../../../pipes/event-title.pipe';
import { GameActiveContentService } from '../../../../services/core-game/game-active-content.service';
import { EventUnionSubTypes } from '../../../../types/event.type';
import { StandardCardSelectorComponent } from '../../../game-event-blocks/standard-card-selector/standard-card-selector.component';

//this component is the main controller, and view

const dedicatedComponentEventSubtypeList: EventUnionSubTypes[] = [
	'planificationPhase', 'productionPhase', 'actionPhaseActivator',
	'upgradePhaseCards', 'selectStartingHand', 'selectCorporation',
	'selectMerger', 'waitingGroupReady','tagSelector',
	'selectCardOptionalSell', 'selectCardForcedSell', 'effectPortal',
	'resourceConversion'
]

@Component({
    selector: 'app-game-event',
    imports: [
        CommonModule,
        PhasePlanificationComponent,
        PhaseProductionComponent,
        PhaseCardUpgradeSelectorComponent,
        EventMainButtonComponent,
        NonEventButtonComponent,
		LeftPannelComponent,
        PhaseActionComponent,
        InitialDraftComponent,
        WaitingReadyComponent,
		PhaseBuilderComponent,
		TagGainListComponent,
		SellCardsComponent,
		EffectPortalComponent,
		ConvertResourceComponent,
		EventTitleKeyPipe,
		StandardCardSelectorComponent
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
		private gameParamService: GameParamService,
		private gameContentService: GameActiveContentService
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
	displayPhaseUpgradeButton!: NonEventButton;
	displayPhaseUpgradeCancelButton!: NonEventButton;
	killCard!: NonEventButton;

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
	_interfaceSize!: SettingInterfaceSize

	private readonly eventHandler = inject(EventHandler)
	private readonly drawHandler = inject(DrawEventHandler)
	private destroy$ = new Subject<void>()

	ngOnInit(): void {
		this.currentButtonSelectorId = -1
		this.sellCardsButton = ButtonDesigner.createNonEventButton('sellOptionalCard')
		this.sellCardsCancelButton = ButtonDesigner.createNonEventButton('sellOptionalCardCancel')
		this.rollbackButton = ButtonDesigner.createNonEventButton('rollBack')
		this.displayPhaseUpgradeButton = ButtonDesigner.createNonEventButton('displayUpgradedPhase')
		this.displayPhaseUpgradeCancelButton = ButtonDesigner.createNonEventButton('displayUpgradedPhaseCancel')
		this.killCard = ButtonDesigner.createNonEventButton('killCard')

		this.gameStateService.currentPhase.pipe(takeUntil(this.destroy$)).subscribe(phase => this.updatePhase(phase))
		this.gameStateService.currentDrawQueue.pipe(takeUntil(this.destroy$)).subscribe(drawQueue => this.handleDrawQueueNext(drawQueue))
		this.gameStateService.currentEventQueue.pipe(takeUntil(this.destroy$)).subscribe(eventQueue => this.handleEventQueueNext(eventQueue))
		this.gameStateService.currentSelectedPhaseList.pipe(takeUntil(this.destroy$)).subscribe(list => this._selectedPhaseList = list)

		this.gameParamService.currentInterfaceSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._interfaceSize = size)
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
	}
	handleDrawQueueNext(drawQueue: DrawEvent[]): void {this.drawHandler.handleQueueUpdate(drawQueue)}
	handleEventQueueNext(eventQueue: EventBaseModel[]): void {
		this.currentEvent = this.eventHandler.handleQueueUpdate(eventQueue)
		this.scrollToTop()
		if(!this.currentEvent){return}
		this.resetValidateButtonState(this.currentEvent)
		this.resetMainButtonState(this.currentEvent)
		this.updateSellButtonsDisplay(this.currentEvent)
		this.updateUpgradedPhaseCardsDisplay(this.currentEvent)
	}
	private resetMainButtonState(event: EventBaseModel): void {
		this.sellCardsButton.resetStartEnabled()
		this.sellCardsButton.locked = event.lockSellButton
		this.sellCardsCancelButton.resetStartEnabled()
		this.sellCardsCancelButton.locked = event.lockSellButton
		this.rollbackButton.resetStartEnabled()
		this.rollbackButton.locked = event.lockRollbackButton
		this.displayPhaseUpgradeButton.resetStartEnabled()
		this.displayPhaseUpgradeButton.locked = event.lockDisplayUpgraded
		this.displayPhaseUpgradeCancelButton.resetStartEnabled()
		this.displayPhaseUpgradeCancelButton.locked = false
	}
	private resetValidateButtonState(event: EventBaseModel): void {
		if(!event.button){return}
		if(event.button.resetEnabledOnEventSwitch){
			event.button.resetStartEnabled()
		}
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
	private updateUpgradedPhaseCardsDisplay(event: EventBaseModel){
		switch(true){
			case(event.subType==='upgradePhaseCards' && event.lockValidateButton===true):{
				this.displayPhaseUpgradeCancelButton.displayed = true
				this.displayPhaseUpgradeButton.displayed = false
				break
			}
			default:{
				this.displayPhaseUpgradeCancelButton.displayed = false
				this.displayPhaseUpgradeButton.displayed = true
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
				this.gameStateService.addEventQueue(EventFactory.createCardSelector('selectCardOptionalSell'), 'first')
				this.sellCardsButton.setEnabled(false)
				this.sellCardsCancelButton.setEnabled(true)
				break
			}
			case('sellOptionalCardCancel'):{
				this.eventHandler.cancelSellCardsOptional()
				break
			}
			case('displayUpgradedPhase'):{
				this.gameStateService.addEventQueue(EventFactory.simple.upgradePhaseCard(0), 'first')
				this.displayPhaseUpgradeButton.setEnabled(false)
				this.displayPhaseUpgradeCancelButton.setEnabled(true)
				break
			}
			case('displayUpgradedPhaseCancel'):{
				this.eventHandler.cancelDisplayUpgradedPhase()
				break
			}
			case('killCard'):{
				this.gameStateService.addEventQueue(EventFactory.createCardSelectorComplex('discardCards',{
					cardSelector:{
						selectionQuantity:100,
						selectionQuantityTreshold:'max'
					}
				}), 'first')
				break
			}
			case('rollBack'):{
				this.gameStateService.publishRollbackQuery()
				break
			}
		}
	}
	public onProjectActivated(input: {card: PlayableCardModel, option: ActivationOption, twice: boolean}){
		this.eventHandler.onProjectActivated(input)
	}
	public eventMainButtonClicked(){this.eventHandler.eventMainButtonClicked()}
	public onCardBuilderButtonClicked(button: EventCardBuilderButton){
		this.eventHandler.cardBuilderButtonClicked(button)
	}
	public onPhaseSelected(): void {this.eventHandler.updateValidateButton(true)}
	isDiscoveryActive(): boolean {
		return this.gameContentService.isContentActive('expansionDiscovery')
	}
	private scrollToTop(){
		if(!this.currentEvent){return}
		if(this.currentEvent.scrollToTopOnActivation===false){return}
		window.scroll({top:0})
	}
	isEventDedicatedComponent(): boolean {
		if(!this.currentEvent){return false}
		if(this.currentEvent.hasCardBuilder()){return true}
		if(dedicatedComponentEventSubtypeList.includes(this.currentEvent.subType)){return true}
		return false
	}
	isStandardSelectorComponent(): boolean {
		if(!this.currentEvent){return false}
		if(this.isEventDedicatedComponent()){return false}
		return this.currentEvent.hasCardsToSelectFrom()
	}
}
