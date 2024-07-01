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
import { PhaseFilter } from '../../../types/phase-card.type';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';

//this component will serve as game event view, displaying phase selection, phase actions, cards to play/select etc

type ButtonNames = 'validateResearch' | 'validateDevelopment' | 'validateConstruction'| 'sellCardsEndPhase' | 'defaultValidate' 
  | 'selectFirstCard' | 'selectSecondCard' | 'selectAlternative'

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

  clientPlayerId!:number;
  currentPhase: NonSelectablePhase = "planification";
  cardSelector!: CardSelector;
  buttons: ChildButton[] = [];
  buttonsIds = new Map<ButtonNames, number>();
  currentButtonSelectorId!: number;
  playCardList: any[] = []


  ngOnInit(): void {
    this.resetCardSelector()
    this.clientPlayerId = this.gameStateService.clientPlayerId
    this.gameStateService.currentPhase.subscribe(
      phase => this.updatePhase(phase)
    )
    this.gameStateService.currentDrawQueue.subscribe(
      drawQueue => this.handleDrawQueueEvents(drawQueue)
    )

    this.createButton('validateResearch', 'Validate', false)
    this.createButton('sellCardsEndPhase', 'Sell', false)
    this.createButton('defaultValidate', 'Select Phase', false)
    this.createButton('validateDevelopment', 'Develop', true)
    this.createButton('validateConstruction', 'Construct', true)
    this.createButton('selectFirstCard', 'Select a card', true)
    this.createButton('selectSecondCard', 'Select a card', true)
    this.createButton('selectAlternative', 'Alternative', true)

    for(let i=0; i<2; i++){
      let cardList: ProjectCardModel[] = []
      this.playCardList.push(cardList)
    }
  }

  updatePhase(phase:NonSelectablePhase):void{
    this.resetCardSelector()
    this.currentPhase = phase
    switch(phase){
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
  }

  applyDevelopmentPhase(): void{
      this.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand())
      this.cardSelector.selectionQuantity = 0
      this.cardSelector.selectionQuantityTreshold = 'min'
      this.cardSelector.cardOptions = {initialState: 'default', playable: true}
      this.cardSelector.buttonId = this.getButtonIdFromName('validateDevelopment')
      this.cardSelector.phaseFilter = 'development'
      this.cardSelector.playCardActive = false
  }

  applyConstructionPhase(): void{
    this.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(this.gameStateService.getClientPlayerStateHand())
    this.cardSelector.selectionQuantity = 0
    this.cardSelector.selectionQuantityTreshold = 'min'
    this.cardSelector.cardOptions = {initialState: 'default', selectable: true, playable: true}
    this.cardSelector.buttonId = this.getButtonIdFromName('validateConstruction')
    this.cardSelector.phaseFilter = 'construction'
  }

  applyActionPhase(): void{
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
  }

  applyResearchPhase(clientState: PlayerStateModel): void{
    let draw = new DrawModel;
    draw.playerId = clientState.id
    draw.cardNumber = clientState.research.drawMod + 2
    draw.drawRule = 'research'
    this.gameStateService.addDrawQueue(draw)
  }

  handleDrawQueueEvents(drawQueue: DrawModel[]): void {
    if(drawQueue.length===0){
      return
    }
    var callCleanAndNext: boolean = false;

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
        this.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(element.cardList)
        this.cardSelector.selectionQuantity = 2
        this.cardSelector.selectionQuantityTreshold = 'equal'
        this.cardSelector.cardOptions = {initialState: 'default', selectable: true}
        this.cardSelector.buttonId = this.getButtonIdFromName('validateResearch')
        this.cardSelector.buttonName = 'validateResearch'
      }
    };
    if(callCleanAndNext===true){
      this.gameStateService.cleanAndNextDrawQueue()
    }
  }

  public updateSelectedCardList(cardList: number[]){
    this.cardSelector.selectedIdList = cardList

    if(String(this.cardSelector.buttonName)==='sellCardsEndPhase'){
      this.updateButtonState(
        'sellCardsEndPhase',
        this.compareValueToTreshold(this.cardSelector.selectionQuantity, this.cardSelector.selectedIdList.length, this.cardSelector.selectionQuantityTreshold)
      )
      return
    }
    if(this.currentPhase==='research'){
      this.updateButtonState(
        'validateResearch',
        this.compareValueToTreshold(this.cardSelector.selectionQuantity, this.cardSelector.selectedIdList.length, this.cardSelector.selectionQuantityTreshold)
      )
      return
    }
    if(this.currentPhase==='development' || this.currentPhase==='construction'){
      console.log('updateSelectedcardlist : ')
      console.log(cardList)
      console.log('selector : ')
      console.log(this.cardSelector.selectedIdList)
      this.selectPlayableCard(0)
    }
  }

  public childButtonClicked(button: ChildButton ){
    if(button.id===this.getButtonIdFromName('defaultValidate')){
      this.gameStateService.setPlayerReady(true, this.clientPlayerId)
      this.updateButtonState('defaultValidate',false)
      return
    }
    if(button.id===this.getButtonIdFromName('validateResearch')){
      this.gameStateService.addCardToPlayerHand(this.clientPlayerId, this.cardSelector.selectedIdList)
      //reset research phase
      this.buttons[button.id].enabled = false
      this.checkCleanAndReady()
      return
    }
    if(button.id===this.getButtonIdFromName('sellCardsEndPhase')){
      this.gameStateService.removeCardFromPlayerHand(this.clientPlayerId, this.cardSelector.selectedIdList)
      this.updateButtonState('sellCardsEndPhase',false)
      this.checkCleanAndReady()
      return
    }
    if(button.id===this.getButtonIdFromName('selectFirstCard')){
      this.cardSelector.playCardActive = true
      this.cardSelector.cardOptions = {initialState: 'default', selectable: true, playable: true}
      this.cardSelector.buttonName = 'selectFirstCard'
      this.currentButtonSelectorId = this.getButtonIdFromName('selectFirstCard')
      this.cardSelector.buttonId = this.getButtonIdFromName('selectFirstCard')
    }
  }

  public phaseSelected(): void {
    this.updateButtonState(
      'defaultValidate',
      true
    )
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

  /**
   * resets the card selector value
   */
  resetCardSelector():void{
    this.cardSelector = {
      title: '',
      buttonId: -1,
      buttonName: '',
      selectFrom: [],
      selectedIdList: [],
      selectionQuantity: 0,
      selectionQuantityTreshold: 'equal',
      phaseFilter: undefined,
      cardOptions: undefined,
    }
    this.currentButtonSelectorId = -1
  }

  checkCleanAndReady(): void {
    this.resetCardSelector()
    let clientCards = this.gameStateService.getClientPlayerState().cards
    if(clientCards.hand.length > clientCards.maximum){
      this.cardSelector.selectFrom = this.cardInfoService.getProjectCardList(clientCards.hand)
      this.cardSelector.selectionQuantity = clientCards.hand.length - clientCards.maximum
      this.cardSelector.title = `Too many cards in hand, please select at least ${this.cardSelector.selectionQuantity} cards to sell.`
      this.cardSelector.selectionQuantityTreshold = 'min'
      this.cardSelector.cardOptions = {initialState: 'default', selectable: true}
      this.cardSelector.buttonId = this.getButtonIdFromName('sellCardsEndPhase')
      this.cardSelector.buttonName = 'sellCardsEndPhase'
      return
    }
    this.gameStateService.setPlayerReady(true, this.clientPlayerId)
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

  getButtonIdFromName(name: ButtonNames): number {
    let result = this.buttonsIds.get(name)
    if(result===undefined){
      result = -1
    }
    return result
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

  selectPlayableCard(playableCardListId: number): void {
    //this.playCardList[playableCardListId].concat(this.cardSelector.selectedIdList)
    let newList: ProjectCardModel[] = []
    for(let i=0; i< this.cardSelector.selectFrom.length; i++){
      if(this.cardSelector.selectFrom[i].id===this.cardSelector.selectedIdList[0]){
        this.playCardList[playableCardListId] = this.cardSelector.selectFrom.splice(i, 1)
      } else {
        newList.push(this.cardSelector.selectFrom[i])
      }
    }
    this.cardSelector.selectFrom = newList
  }
}
