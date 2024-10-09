import { Component, OnInit, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerReadyPannelComponent } from '../../player-info/player-ready-pannel/player-ready-pannel.component';
import { SelectablePhase } from '../../../types/global.type';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { DrawEvent, EventBaseModel } from '../../../models/core-game/event.model';

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Component({
  selector: 'app-server-emulation',
  standalone: true,
  imports: [
    CommonModule,
    PlayerReadyPannelComponent
  ],
  templateUrl: './server-emulation.component.html',
  styleUrl: './server-emulation.component.scss'
})
export class ServerEmulationComponent implements OnInit, AfterViewInit {
  debug: boolean = true;
  currentGroupPlayerState!: {};
  currentEventQueue: EventBaseModel[] = [];
  currentPhase: string = "planification";
  currentDrawQueue: DrawEvent[] = []
  cardsDeck: number[] = [];
  cardsDiscarded: number[] = [];

  constructor(private gameStateService: GameState,
    private cardInfoService: ProjectCardInfoService,
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
      drawQueue => this.handleDrawQueueRequest(drawQueue)
    )
    this.gameStateService.currentLoadingState.subscribe(
      loading => this.loadingFinished(loading)
    )
	this.gameStateService.currentEventQueue.subscribe(
		event => this.currentEventQueue = event
	  )
    //return
    //force draw card list for debug purpose

    let cardDrawList: number[] = [145, 263, 36, 222, 83, 81]

    this.gameStateService.addCardToPlayerHand(this.gameStateService.clientPlayerId, cardDrawList)
  }

  ngAfterViewInit(): void {
    this.gameStateService.setPlayerIdList([0,1,2,3])
  }

  phaseChanged(phase: Phase){
    if(this.gameStateService.loading.getValue()===true){return}
    this.currentPhase = phase

    this.botReady()
  }

  botReady(){
    for(let index of this.gameStateService.playerCount.getValue()){
      if(index===this.gameStateService.clientPlayerId){continue}
      if(this.currentPhase==="planification"){
        let phaseList = ["development","construction","action","production","research"]
        let randomPhase = phaseList[Math.floor(Math.random() * 5)]
        this.gameStateService.playerSelectPhase(index, randomPhase as keyof SelectablePhase)
      }

      //random timeout before bot becomes rdy
      let randomInt = Math.floor(Math.random() * 3) * 1000
      setTimeout(() => {this.gameStateService.setPlayerReady(true, index)}, randomInt)
    }
  }

  updatePhase(newPhase:Phase): void {
    //sends phase update to service's behaviorSubject
    this.gameStateService.updatePhase(newPhase)

    let phaseList = ["development","construction","action","production","research"]
    let randomPhase = phaseList[Math.floor(Math.random() * 5)]
    this.gameStateService.playerSelectPhase(1, randomPhase as keyof SelectablePhase)
    this.gameStateService.setPlayerReady(true, 1)
  }

  printPlayersState(): void {
    console.log(this.currentGroupPlayerState)
    console.log(this.gameStateService.groupPlayerReady.getValue())
  }

  /**
   * provides cards from deck, updates all objects in queue with a list of cards requested
   * @param drawQueue
   * @returns
   */
  handleDrawQueueRequest(drawQueue: DrawEvent[]):void{
    this.currentDrawQueue = drawQueue

    if(drawQueue.length===0){
      return
    }
    let currentDrawEvent = drawQueue[0]
    if(currentDrawEvent.finalized===true || currentDrawEvent.served===true){return}
    if(this.cardsDeck.length===0){
      console.log('no cards left in deck')
      currentDrawEvent.finalized = true
      this.gameStateService.cleanAndNextDrawQueue()
      return
    }

    currentDrawEvent.served=true
    currentDrawEvent.drawResultCardList = this.drawCardFromDeck(currentDrawEvent.drawCardNumber)
    this.gameStateService.cleanAndNextDrawQueue()
  }

  drawCardFromDeck(drawNumber?: number): number[]{
    var resultList: number[] = [];

    if(drawNumber===undefined){
      drawNumber=1
    }
    for(let i=0; i<drawNumber; i++){
      if(this.cardsDeck.length===0){
        //no more cards in deck, need to add reshuffle
        return []
      }
      let index = Math.floor(Math.random()*this.cardsDeck.length);
      resultList.push(this.cardsDeck[index])
      this.cardsDeck.splice(index, 1)
    }
    return resultList
  }
  loadingFinished(loading: boolean):void{
    if(loading===true){return}
    this.botReady()
  }
}
