import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PhasePlanificationComponent } from '../../phases/phase-planification/phase-planification.component';
import { PhaseDevelopmentComponent } from '../../phases/phase-development/phase-development.component';
import { PhaseConstructionComponent } from '../../phases/phase-construction/phase-construction.component';
import { PhaseActionComponent } from '../../phases/phase-action/phase-action.component';
import { PhaseProductionComponent } from '../../phases/phase-production/phase-production.component';
import { PhaseResearchComponent } from '../../phases/phase-research/phase-research.component';
import { MinMaxEqualType, NonSelectablePhase, SelectablePhase } from '../../../types/global.type';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { RessourceState } from '../../../interfaces/global.interface';
import { DrawModel } from '../../../models/core-game/draw.model';
import { ProjectCardListComponent } from '../../project-hand/project-card-list/project-card-list.component';
import { ProjectCardInfoService } from '../../../services/player-hand/project-card-info.service';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { ChildButton } from '../../../interfaces/global.interface';
import { ButtonComponent } from '../../button/button.component';
import { CardSelector, CardOptions } from '../../../interfaces/global.interface';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { EventModel } from '../../../models/core-game/event.model';
import { ButtonNames } from '../../../types/global.type';
import { PlayableCardZone } from '../../../interfaces/global.interface';

//this component will serve as game event view, displaying phase selection, phase actions, cards to play/select etc

@Component({
  selector: 'app-game-event',
  standalone: true,
  imports: [
    CommonModule,
    PhasePlanificationComponent,
    PhaseDevelopmentComponent,
    PhaseConstructionComponent,
    PhaseActionComponent,
    PhaseProductionComponent,
    PhaseResearchComponent,
    ProjectCardListComponent,
    PlayerReadyComponent,
    ButtonComponent
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
	ngOnInit(): void {
		this.currentEvent.cardSelector = {
				title: '',
				selectFrom: [],
				selectedIdList: [],
				selectionQuantity: 0,
				selectionQuantityTreshold: 'equal',
				phaseFilter: undefined,
				cardOptions: undefined,
			}
			this.currentButtonSelectorId = -1

		this.clientPlayerId = this.gameStateService.clientPlayerId

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
			cardOptions: {initialState: 'default', playable: true},
			phaseFilter: 'development',
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
				cardOptions: {selectable: false, initialState: 'default'},
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
			cardOptions: {initialState: 'default', playable: true},
			phaseFilter: 'construction',
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
				cardOptions: {selectable: false, initialState: 'default'},
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
			selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStatePlayed()),
			selectionQuantity: 0,
			selectionQuantityTreshold: 'min',
			cardOptions: {initialState: 'activable', selectable: false, playable: false},
			phaseFilter: 'action',
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
		draw.cardNumber = clientState.research.drawMod + 2
		draw.drawRule = 'research'
		this.gameStateService.addDrawQueue(draw)
	}

	addHandSizeCheckEvent(): void {
		let newEvent = new EventModel
		newEvent.type = 'forcedSell'
		newEvent.cardSelector = {
			selectFrom: this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand()),
			selectionQuantity: 0,
			selectionQuantityTreshold: 'min',
			cardOptions: {initialState: 'default', selectable: true},
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
				let quantity: number = 2
				newEvent.type = 'selectCard'
				newEvent.cardSelector = {
					selectFrom: this.cardInfoService.getProjectCardList(element.cardList),
					selectionQuantity: quantity,
					selectionQuantityTreshold: 'equal',
					cardOptions: {initialState: 'default', selectable: true},
					title: `Select ${quantity} cards to draw`,
					selectedIdList: [],
				}
				newEvent.button = this.buttons[this.getButtonIdFromName('validateResearch')]

				this.gameStateService.addEventQueue(newEvent)
			}
		};
		if(callCleanAndNext===true){
		this.gameStateService.cleanAndNextDrawQueue()
		}
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
		
		this.currentEvent = ticket

		switch(ticket.type){
			case('forcedSell'):{
				let playerCards = this.gameStateService.getClientPlayerState().cards
				if(playerCards.hand.length <= playerCards.maximum){
					ticket.isFinalized = true
					this.gameStateService.cleanAndNextEventQueue()
					break
				}
				this.currentEvent.cardSelector.selectionQuantity = playerCards.hand.length - playerCards.maximum
				this.currentEvent.cardSelector.title = `Too many cards in hand, please select at least ${ticket.cardSelector.selectionQuantity} cards to sell.`
				this.currentEvent.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(playerCards.hand)
				break
			}
			case('endOfPhase'):{
				ticket.isFinalized = true
				this.gameStateService.cleanAndNextEventQueue()
				this.gameStateService.setPlayerReady(true, this.clientPlayerId)
			}
		}
	}

	public updateSelectedCardList(cardList: number[]){
		this.currentEvent.cardSelector.selectedIdList = cardList

		if(this.currentEvent.button?.id===this.getButtonIdFromName('sellCardsEndPhase')){
		this.updateButtonState(
			'sellCardsEndPhase',
			this.compareValueToTreshold(
				this.currentEvent.cardSelector.selectionQuantity,
				this.currentEvent.cardSelector.selectedIdList.length,
				this.currentEvent.cardSelector.selectionQuantityTreshold)
		)
		return
		}
		if(this.currentPhase==='research'){
		this.updateButtonState(
			'validateResearch',
			this.compareValueToTreshold(
				this.currentEvent.cardSelector.selectionQuantity,
				this.currentEvent.cardSelector.selectedIdList.length,
				this.currentEvent.cardSelector.selectionQuantityTreshold)
		)
		return
		}
		if(this.currentEvent.type === 'selectCardToBuild'){
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
			this.selectPlayableCard(zoneId, this.currentEvent.cardSelector.selectedIdList[0])
			this.currentEvent.cardSelector.playCardActive = undefined
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
			case('sellCardsEndPhase'):{
				this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, this.currentEvent.cardSelector.selectedIdList)
				this.updateButtonState('sellCardsEndPhase',false)
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
				this.currentEvent.cardSelector.cardOptions = {initialState: 'default', selectable: true, playable: true}

				if(clickedButtonName==='selectSecondCard'){
					this.updateButtonState('selectAlternative', false)
				}
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
			case('buildSecondCard'):{
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
				console.log(clickedButtonName)
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
		enabled: startEnabled
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
		this.currentEvent.cardSelector.cardOptions = {selectable: false}
	}

	buildCard(playableCardListId: number): void {
		let buttonCancel: ButtonNames
		let buttonSelect: ButtonNames
		let buttonBuild: ButtonNames
		let card: number[]

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
		
		card = [this.currentEvent.playCardZone[playableCardListId].cardList[0].id]

		this.gameStateService.addCardToPlayerPlayed(this.clientPlayerId, card)
		this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, card)
		this.currentEvent.playCardZone[playableCardListId].cardList = []
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
}
