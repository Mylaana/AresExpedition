import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PhasePlanificationComponent } from '../../phases/phase-planification/phase-planification.component';
import { PhaseActionComponent } from '../../phases/phase-action/phase-action.component';
import { PhaseProductionComponent } from '../../phases/phase-production/phase-production.component';
import { PhaseResearchComponent } from '../../phases/phase-research/phase-research.component';
import { EventType, MinMaxEqualType, NonSelectablePhase, SelectablePhase } from '../../../types/global.type';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GlobalParameter, RessourceStock, RessourceState, CardRessourceStock, AdvancedRessourceStock } from '../../../interfaces/global.interface';
import { DrawModel } from '../../../models/core-game/draw.model';
import { ProjectCardListComponent } from '../../cards/project/project-card-list/project-card-list.component';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { ChildButton } from '../../../interfaces/global.interface';
import { ButtonComponent } from '../../tools/button/button.component';
import { ProjectCardModel } from '../../../models/cards/project-card.model';
import { EventModel } from '../../../models/core-game/event.model';
import { ButtonNames } from '../../../types/global.type';
import { PlayableCardZone } from '../../../interfaces/global.interface';
import { PhaseCardUpgradeSelectorComponent } from '../../cards/phase/phase-card-upgrade-selector/phase-card-upgrade-selector.component';
import { types } from 'node:util';

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
	PhaseCardUpgradeSelectorComponent
  ],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.scss'
})
export class GameEventComponent {
	constructor(
		private gameStateService: GameState,
		private cardInfoService: ProjectCardInfoService
	){}

	delete: EventModel[] = []

	clientPlayerId!:number;
	currentEvent: EventModel = new EventModel;
	currentEventId: number = -1
	eventCounter: number = -1

	currentPhase: NonSelectablePhase = "planification";
	buttons: ChildButton[] = [];
	buttonsIds = new Map<ButtonNames, number>();
	currentButtonSelectorId!: number;
	sellCardsButton!: ChildButton;

	phaseList: NonSelectablePhase[] = [
		'planification',
		'development',
		'construction',
		'action',
		'production',
		'research'
	]
	phaseButtons = new  Map<NonSelectablePhase, ButtonNames>(
			[
				['planification', 'validatePlanification'],
				['development', 'validateDevelopment'],
				['construction', 'validateConstruction'],
				['action', 'validateAction'],
				['production', 'validateProduction'],
				['research', 'validateResearch']
			]
		)
	eventMainButton = new Map<EventType, ButtonNames>(
		[
			['discardCards','discardCards'],
			['drawCards','drawCards'],
			['upgradePhase','upgradePhase'],
			['addRessourceToSelectedCard', 'addRessourceToSelectedCard']
		]
	)
	ngOnInit(): void {
		this.currentEvent.cardSelector = {
				title: '',
				selectFrom: [],
				selectedIdList: [],
				selectionQuantity: 0,
				selectionQuantityTreshold: 'equal',
				phaseFilter: undefined,
				cardInitialState: undefined,
			}
			this.currentButtonSelectorId = -1

		this.clientPlayerId = this.gameStateService.clientPlayerId

		this.createButton('defaultValidate', 'default validation button', true)

		this.createButton('validatePlanification', 'Select Phase', false)
		this.createButton('validateDevelopment', 'End Development phase', true)
		this.createButton('validateConstruction', 'End Constructuction phase', true)
		this.createButton('validateAction', 'End Action phase', true)
		this.createButton('validateProduction', 'End Production phase', true)
		this.createButton('validateResearch', 'Validate', false)
		this.createButton('sellCardsEndPhase', 'Sell', false)

		this.createButton('selectFirstCard', 'Select a card', true)
		this.createButton('cancelFirstCard', 'Cancel <X>', false)
		this.createButton('buildFirstCard', 'Build', false)

		this.createButton('selectSecondCard', 'Select a card', true)
		this.createButton('cancelSecondCard', 'X', false)
		this.createButton('buildSecondCard', 'Build', false)

		this.createButton('selectAlternative', 'Alternative', true)

		this.createButton('validateOptionalSellCards', 'Sell selected cards', true)
		this.createButton('callOptionalSellCards', 'Sell C.', true)
		this.sellCardsButton = this.buttons[this.getButtonIdFromName('callOptionalSellCards')]

		this.createButton('upgradePhase', 'End upgrade phase selection', true)

		this.createButton('drawCards', 'Draw', true)
		this.createButton('discardCards', 'Discard', false)
		this.createButton('addRessourceToSelectedCard', 'Add ressources', false)
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
		switch(phase){
			case('planification'):{
				this.applyPlanificationPhase()
				break
			}
			case('development'):{
				this.applyDevelopmentPhase()
				break
			}
			case('construction'):{
				this.applyConstructionPhase()
				break
			}
			case('action'):{
				this.applyActionPhase()
				break
			}
			case('production'):{
				this.applyProductionPhase(this.gameStateService.getClientPlayerState())
				break
			}
			case('research'):{
				this.applyResearchPhase(this.gameStateService.getClientPlayerState())
				break
			}
		}

		this.addHandSizeCheckEvent()
		this.addEndOfPhaseEvent()
	}

	applyPlanificationPhase(): void {
		let newEvent = new EventModel
		newEvent.type = 'planification'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'max',
			title: '',
			selectedIdList: [],
		}
		newEvent.button = this.buttons[this.getButtonIdFromName('validatePlanification')]

		this.gameStateService.addEventQueue(newEvent)
  	}

	applyDevelopmentPhase(): void {
		let newEvent = new EventModel
		newEvent.type = 'selectCardToBuild'
		newEvent.cardSelector = {
			selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand()),
			selectionQuantity: 0,
			selectionQuantityTreshold: 'min',
			cardInitialState: {playable: true},
			phaseFilter: {type:'development'},
			playCardActive: -1,
			title: 'Play Green cards :',
			selectedIdList: [],
		}
		newEvent.button = this.buttons[this.getButtonIdFromName('validateDevelopment')]
		newEvent.playCardZone = []

		for(let i=0; i<2; i++){
			let buttonId: number
			if(i===0){buttonId=this.getButtonIdFromName('selectFirstCard')}else{buttonId=this.getButtonIdFromName('selectSecondCard')}
			let cardZone: PlayableCardZone = {
				cardList: [],
				cardInitialState: {selectable: false, playable: true},
				currentButton: undefined
			}
			newEvent.playCardZone.push(cardZone)
		}
		this.gameStateService.addEventQueue(newEvent)
		this.resetPlayable()
  	}

	applyConstructionPhase(): void {
		let newEvent = new EventModel
		newEvent.type = 'selectCardToBuild'
		newEvent.cardSelector = {
			selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand()),
			selectionQuantity: 0,
			selectionQuantityTreshold: 'min',
			cardInitialState: {playable: true},
			phaseFilter: {type:'construction'},
			playCardActive: -1,
			title: 'Play Blue/Red cards :',
			selectedIdList: [],
		}
		newEvent.button = this.buttons[this.getButtonIdFromName('validateConstruction')]
		newEvent.playCardZone = []

		for(let i=0; i<2; i++){
			let buttonId: number
			if(i===0){buttonId=this.getButtonIdFromName('selectFirstCard')}else{buttonId=this.getButtonIdFromName('selectSecondCard')}
			let cardZone: PlayableCardZone = {
				cardList: [],
				cardInitialState: {selectable: false, playable: true},
				currentButton: undefined
			}
			newEvent.playCardZone.push(cardZone)
		}
		this.gameStateService.addEventQueue(newEvent)
		this.resetPlayable()
	}

	applyActionPhase(): void {
		let newEvent = new EventModel
		newEvent.type = 'selectCardToActivate'
		newEvent.cardSelector = {
			selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerPlayedCardsId()),
			selectionQuantity: 0,
			selectionQuantityTreshold: 'min',
			cardInitialState: {activable: true, selectable: false, playable: false},
			phaseFilter: {type:'action'},
			title: 'Activate cards :',
			selectedIdList: [],
		}
		newEvent.button = this.buttons[this.getButtonIdFromName('validateAction')]

		this.gameStateService.addEventQueue(newEvent)
		this.resetPlayable()
	}

	/**
	 * adds client player's production to stocks
	 */
	applyProductionPhase(clientState: PlayerStateModel): void{
		var newClientRessource: RessourceState[] = []

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

		let newEvent = new EventModel
		newEvent.type = 'production'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'max',
			title: '',
			selectedIdList: [],
		}
		newEvent.button = this.buttons[this.getButtonIdFromName('validateProduction')]

		this.gameStateService.addEventQueue(newEvent)
		this.resetPlayable()
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

	addHandSizeCheckEvent(): void {
		let newEvent = new EventModel
		newEvent.type = 'forcedSell'
		newEvent.cardSelector = {
			selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand()),
			selectionQuantity: 0,
			selectionQuantityTreshold: 'min',
			cardInitialState: {selectable: true, ignoreCost: true},
			title: ``,
			selectedIdList: [],
		}
		newEvent.button = this.buttons[this.getButtonIdFromName('sellCardsEndPhase')]

		this.gameStateService.addEventQueue(newEvent)
	}
	addEndOfPhaseEvent(): void {
		let newEvent = new EventModel
		newEvent.type = 'endOfPhase'
		this.gameStateService.addEventQueue(newEvent)
	}
	addPhaseCardUpgradeEvent(upgradeNumber:number, phaseIndexToUpgrade?: number[]): void {
		let newEvent: EventModel = new EventModel
		newEvent.type = 'upgradePhase'
		newEvent.cardSelector = {
			selectFrom: [],
			selectionQuantity: upgradeNumber,
			selectionQuantityTreshold: 'max',
			title: '',
			selectedIdList: [],
		}
		newEvent.value = phaseIndexToUpgrade
		newEvent.button = this.buttons[this.getButtonIdFromName('upgradePhase')]
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
				let newEvent = new EventModel
				let quantity: number = 2 + this.gameStateService.getClientPlayerResearchMods().keep
				newEvent.type = 'research'
				newEvent.cardSelector = {
					selectFrom: this.cardInfoService.getProjectCardList(element.cardList),
					selectionQuantity: quantity,
					selectionQuantityTreshold: 'equal',
					cardInitialState: {selectable:true, ignoreCost: true},
					title: `Select ${quantity} cards to draw`,
					selectedIdList: [],
				}
				newEvent.button = this.buttons[this.getButtonIdFromName('validateResearch')]

				this.gameStateService.addEventQueue(newEvent)
			}
		};
		if(callCleanAndNext===false){return}
		this.gameStateService.cleanAndNextDrawQueue()
	}

	handleEventQueueNext(eventQueue: EventModel[]): void {
		this.delete = eventQueue
		if(eventQueue.length===0){
			this.currentEvent=eventQueue[0]
			return
		}
		if(eventQueue[0].isFinalized===true){
			this.gameStateService.cleanAndNextEventQueue()
			return
		}

		//sets event id if undefined
		if(eventQueue[0].eventId === undefined){
			this.eventCounter++
			eventQueue[0].eventId = this.eventCounter
		}

		let ticket = eventQueue[0]

		
		if(this.currentEvent != ticket){
			//saves current event status in event queue
			for(let e of eventQueue){
				if(e.eventId === this.currentEventId){
					e = this.currentEvent
					break
				}
			}
		}

		if (this.currentEvent === ticket){return}
		//remove stateFromParent before switching event
		if(this.currentEvent && this.currentEvent.cardSelector && this.currentEvent.cardSelector.stateFromParent){this.currentEvent.cardSelector.stateFromParent=undefined}

		this.currentEvent = ticket

		//reset currentEvent parameters
		this.currentEvent.selectionActive = false

		//bind unbound current event to their main button
		if(!this.currentEvent.button){
			this.currentEvent.button = this.getEventMainButton(this.currentEvent.type)
		}

		//reset current event button state
		if(ticket.button){
			let button = this.buttons[ticket.button.id]
			button.enabled = button.startEnabled
		}

		switch(ticket.type){
			case('forcedSell'):{
				let playerCards = this.gameStateService.getClientPlayerState().cards
				if(playerCards.hand.length <= playerCards.maximum){
					ticket.isFinalized = true
					break
				}
				this.currentEvent.cardSelector.selectionQuantity = playerCards.hand.length - playerCards.maximum
				this.currentEvent.cardSelector.title = `Too many cards in hand, please select at least ${ticket.cardSelector.selectionQuantity} cards to sell.`
				this.currentEvent.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(playerCards.hand)

				this.currentEvent.selectionActive = true
				break
			}
			case('endOfPhase'):{
				ticket.isFinalized = true
				this.gameStateService.setPlayerReady(true, this.clientPlayerId)
				break
			}
			case('selectCard'):{
				this.currentEvent.selectionActive = true
				break
			}
			case('optionalSell'):{
				this.currentEvent.selectionActive = true
				break
			}
			case('upgradePhase'):{
				this.currentEvent.selectionActive = true
				this.gameStateService.addPhaseCardUpgradeNumber(this.clientPlayerId, this.currentEvent.cardSelector.selectionQuantity)
				break
			}
			case('selectCardToBuild'):{
				this.currentEvent.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand())
				break
			}
			case('drawCards'):{
				ticket.isFinalized = true
				this.currentEvent.button = this.buttons[this.getButtonIdFromName('drawCards')]
				this.addDrawQueue(this.clientPlayerId, ticket.value)
				break
			}
			case('discardCards'):{
				this.currentEvent.selectionActive = true
				this.currentEvent.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerState().cards.hand)			
				break
			}
			case('increaseGlobalParameter'):{
				this.currentEvent.isFinalized = true
				let parameter: GlobalParameter = this.currentEvent.value
				this.gameStateService.addGlobalParameterStepsEOPtoPlayerId(this.clientPlayerId, {name:parameter.name, steps:parameter.addEndOfPhase})
				break
			}
			case('ressourceGain'):{
				this.currentEvent.isFinalized = true
				let ressources: RessourceStock[] = [].concat(this.currentEvent.value)
				this.gameStateService.addRessourceToClientPlayer(ressources)
				break
			}
			case('cardRessourceGain'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.addRessourceToClientPlayerCard(this.currentEvent.value)
				break
			}
			case('increaseResearchScanValue'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.addClientPlayerResearchScanValue(this.currentEvent.value)
				break
			}
			case('increaseResearchKeepValue'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.addClientPlayerResearchKeepValue(this.currentEvent.value)
				break
			}
			case('deactivateTrigger'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.setClientPlayerTriggerAsInactive(this.currentEvent.value)
 				break
			}
			case('addRessourceToSelectedCard'):{
				this.currentEvent.selectionActive = true
				this.currentEvent.cardSelector.selectFrom = this.gameStateService.getClientPlayerState().cards.getProjectPlayedList(
					this.currentEvent.cardSelector.phaseFilter)
				if(this.currentEvent.cardSelector.selectFrom.length===0){
					console.log('no cards found to add:', this.currentEvent.value)
					this.currentEvent.isFinalized = true
				}
				break
			}
		}

		if(ticket.isFinalized===false){return}
		this.gameStateService.cleanAndNextEventQueue()
	}

	public updateSelectedCardList(cardList: number[]){
		this.currentEvent.cardSelector.selectedIdList = cardList
		switch(this.currentEvent.type){
			case('forcedSell'):{
				this.updateButtonState(
					'sellCardsEndPhase',
					this.compareValueToTreshold(
						this.currentEvent.cardSelector.selectionQuantity,
						this.currentEvent.cardSelector.selectedIdList.length,
						this.currentEvent.cardSelector.selectionQuantityTreshold)
				)
				return
			}
			case('research'):{
				this.updateButtonState(
					'validateResearch',
					this.compareValueToTreshold(
						this.currentEvent.cardSelector.selectionQuantity,
						this.currentEvent.cardSelector.selectedIdList.length,
						this.currentEvent.cardSelector.selectionQuantityTreshold)
			)
			return
			}
			case('selectCardToBuild'):{
				if(this.currentEvent.cardSelector.playCardActive===undefined){return}

				let zoneId = this.currentEvent.cardSelector.playCardActive

				switch(zoneId){
					case(0):{
						this.updateButtonState('selectFirstCard', false)
						this.updateButtonState('buildFirstCard', true)
						this.updateButtonState('cancelFirstCard', true)
						break
					}
					case(1):{
						this.updateButtonState('selectSecondCard', false)
						this.updateButtonState('buildSecondCard', true)
						this.updateButtonState('cancelSecondCard', true)
						break
					}
					default:{
						return
					}
				}
				this.currentEvent.selectionActive = false
				this.selectPlayableCard(zoneId, this.currentEvent.cardSelector.selectedIdList[0])
				this.currentEvent.cardSelector.playCardActive = undefined
				return
			}
			case('discardCards'):{
				this.updateButtonState(
					'discardCards',
					this.compareValueToTreshold(
						this.currentEvent.cardSelector.selectionQuantity,
						this.currentEvent.cardSelector.selectedIdList.length,
						this.currentEvent.cardSelector.selectionQuantityTreshold)
				)
				return
			}
			case('addRessourceToSelectedCard'):{
				this.updateButtonState(
					'addRessourceToSelectedCard',
					this.compareValueToTreshold(
						this.currentEvent.cardSelector.selectionQuantity,
						this.currentEvent.cardSelector.selectedIdList.length,
						this.currentEvent.cardSelector.selectionQuantityTreshold)
				)
				return
			}
		}
		
	}

	public childButtonClicked(button: ChildButton ){
		let clickedButtonName: ButtonNames | undefined = this.getButtonNameFromId(button.id)
		switch(clickedButtonName){
			case(undefined):{return}

			case('validatePlanification'):{
				this.updateButtonState('validatePlanification', false)
				this.currentEvent.isFinalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('validateResearch'):{
				this.gameStateService.addCardToPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				//reset research phase
				this.buttons[button.id].enabled = false
				this.currentEvent.isFinalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('sellCardsEndPhase'):
			case('validateOptionalSellCards'):{
				this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				this.updateButtonState('sellCardsEndPhase',false)
				this.gameStateService.sellCardsFromClientHand( this.currentEvent.cardSelector.selectedIdList.length)
				this.currentEvent.isFinalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('selectFirstCard'):
			case('selectSecondCard'):{
				let zoneId: number
				if(clickedButtonName==='selectFirstCard'){
					zoneId = 0
				} else {
					zoneId = 1
				}
				this.currentEvent.cardSelector.playCardActive = zoneId
				this.currentEvent.cardSelector.stateFromParent = {selectable: true}

				if(clickedButtonName==='selectSecondCard'){
					this.updateButtonState('selectAlternative', false)
				}

				this.currentEvent.selectionActive = true
				break
			}
			case('cancelFirstCard'):{
				this.cancelBuildCardSelection(0)
				break
			}
			case('cancelSecondCard'):{
				this.cancelBuildCardSelection(1)
				this.updateButtonState('selectAlternative', true)
				break
			}
			case('buildFirstCard'):{
				this.buildCard(0)
				break
			}
			case('buildSecondCard'):
			{
				this.buildCard(1)
				break
			}
			case('validateDevelopment'):
			case('validateConstruction'):
			case('validateAction'):
			case('validateProduction'):
			{
				this.currentEvent.isFinalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('selectAlternative'):{
				this.updateButtonState('selectSecondCard', false)
				this.updateButtonState('buildSecondCard', false)
				this.updateButtonState('cancelSecondCard', false)
				this.updateButtonState('selectAlternative', false)
				console.log(clickedButtonName)
				break
			}
			case('callOptionalSellCards'):{
				let newEvent = new EventModel
				newEvent.type = 'optionalSell'
				newEvent.cardSelector = {
					selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand()),
					selectionQuantity: 0,
					selectionQuantityTreshold: 'min',
					cardInitialState: {selectable:true, ignoreCost: true},
					title: `Sell any card number :`,
					selectedIdList: [],
				}
				newEvent.button = this.buttons[this.getButtonIdFromName('validateOptionalSellCards')]
				this.gameStateService.addEventQueue(newEvent, true)
				break
			}
			case('upgradePhase'):{
				this.currentEvent.isFinalized = true
				this.gameStateService.removePhaseCardUpgradeNumber(this.clientPlayerId, 0 , true)
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('discardCards'):{
				this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				this.currentEvent.isFinalized = true
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
			case('addRessourceToSelectedCard'):{
				let stockList: AdvancedRessourceStock[] = []
				if(!Array.isArray(this.currentEvent.value)){
					stockList.push(this.currentEvent.value)
				} else {
					stockList = this.currentEvent.value
				}
				let cardStock: CardRessourceStock = {
					cardId: this.currentEvent.cardSelector.selectedIdList[0],
					stock: stockList
				}
				this.gameStateService.addRessourceToClientPlayerCard(cardStock)
				this.currentEvent.isFinalized = true
				this.currentEvent.cardSelector.stateFromParent = {selected:false, selectable:false, activable:false, ignoreCost:false, playable:false, upgradable:false, upgraded:false}
				this.gameStateService.cleanAndNextEventQueue()
				break
			}
		}
	}

	public phaseSelected(): void {
		this.updateButtonState('validatePlanification', true)
	}

	/**
	 *
	 * @param buttonId
	 * @param option
	 * option.enabled will set the state to default if true and to disabled if false
	 */
	updateButtonState(buttonName:ButtonNames, enabled: boolean): void{
		let buttonId = this.buttonsIds.get(buttonName)
		if(buttonId===undefined){return}

		this.buttons[buttonId].enabled = enabled
	}

	createButton(buttonName: ButtonNames, caption: string, startEnabled: boolean): void {
		let newButton: ChildButton = {
		id: this.buttons.length,
		caption: caption,
		enabled: startEnabled,
		startEnabled: startEnabled
		}
		this.buttonsIds.set(buttonName, this.buttons.length)
		this.buttons.push(newButton)
	}

	getButtonIdFromName(name: ButtonNames | undefined): number {
		if(name===undefined){return -1}

		let result = this.buttonsIds.get(name)
		if(result===undefined){
		result = -1
		}
		return result
	}

	getButtonNameFromId(id: number): ButtonNames | undefined {
		for(let [key, value] of this.buttonsIds){
			if(value===id){
				return key
			}
		}
		return undefined
	  }

	/**
	 *
	 * @param treshold
	 * @param value
	 * @param tresholdType
	 * @returns boolean
	 */
	compareValueToTreshold(treshold: number, value:number, tresholdType: MinMaxEqualType): boolean {
		switch(tresholdType){
		case('equal'):{
			return value === treshold
		}
		case('min'): {
			return value >= treshold
		}
		case('max'): {
			return value <= treshold
		}
		}
	}

	selectPlayableCard(playCardListId: number, playedCardId: number): void {
		let newList: ProjectCardModel[] = []
		let selectedCardIndex: number = 0

		for(let i=0; i< this.currentEvent.cardSelector.selectFrom.length; i++){
			if(this.currentEvent.cardSelector.selectFrom[i].id===playedCardId){
				selectedCardIndex = i
			} else {
				newList.push(this.currentEvent.cardSelector.selectFrom[i])
			}
		}
		this.currentEvent.playCardZone[playCardListId].cardList = this.currentEvent.cardSelector.selectFrom.splice(selectedCardIndex, 1)

		//update card selector state
		this.currentEvent.cardSelector.selectFrom = newList
		this.currentEvent.cardSelector.cardInitialState = {selectable: false}
	}

	buildCard(playableCardListId: number): void {
		let buttonCancel: ButtonNames
		let buttonSelect: ButtonNames
		let buttonBuild: ButtonNames
		let card: ProjectCardModel

		if(playableCardListId===0){
			buttonBuild = 'buildFirstCard'
			buttonSelect = 'selectFirstCard'
			buttonCancel = 'cancelFirstCard'
		} else {
			buttonBuild = 'buildSecondCard'
			buttonSelect = 'selectSecondCard'
			buttonCancel = 'cancelSecondCard'
			this.updateButtonState('selectAlternative', false)
		}

		this.updateButtonState(buttonBuild, false)
		this.updateButtonState(buttonSelect, false)
		this.updateButtonState(buttonCancel, false)

		card = this.currentEvent.playCardZone[playableCardListId].cardList[0]

		this.currentEvent.playCardZone[playableCardListId].cardList = []
		this.gameStateService.playCardFromClientHand(card)
	}

	cancelBuildCardSelection(playableCardListId: number): void {
		let buttonCancel: ButtonNames
		let buttonSelect: ButtonNames
		let buttonBuild: ButtonNames

		if(playableCardListId===0){
			buttonBuild = 'buildFirstCard'
			buttonSelect = 'selectFirstCard'
			buttonCancel = 'cancelFirstCard'
		} else {
			buttonBuild = 'buildSecondCard'
			buttonSelect = 'selectSecondCard'
			buttonCancel = 'cancelSecondCard'
			this.updateButtonState('selectAlternative', false)
		}

		this.updateButtonState(buttonBuild, false)
		this.updateButtonState(buttonSelect, true)
		this.updateButtonState(buttonCancel, false)

		let newList: ProjectCardModel[] = []
		for(let c of this.currentEvent.cardSelector.selectFrom){
			newList.push(c)
		}
		newList.push(this.currentEvent.playCardZone[playableCardListId].cardList[0])
		this.currentEvent.cardSelector.selectFrom = newList
		this.currentEvent.playCardZone[playableCardListId].cardList = []
	}

	resetPlayable():void{
		this.updateButtonState('selectFirstCard', true)
		this.updateButtonState('selectSecondCard', true)
		this.updateButtonState('selectAlternative', true)
	}
	getEventMainButton(eventType: EventType): ChildButton {
		let buttonName = this.eventMainButton.get(eventType)
		let button: ChildButton
		if(!buttonName){buttonName='defaultValidate'}
		button = this.buttons[this.getButtonIdFromName(buttonName)]

		//reset enabled
		button.enabled = button.startEnabled
		
		return button
	}
}
