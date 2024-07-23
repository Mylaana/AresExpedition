import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerReadyPannelComponent } from '../../player-info/player-ready-pannel/player-ready-pannel.component';
import { SelectablePhase } from '../../../types/global.type';
import { ProjectCardInfoService } from '../../../services/player-hand/project-card-info.service';
import { DrawModel } from '../../../models/core-game/draw.model';

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
export class ServerEmulationComponent implements OnInit {
  debug: boolean = false;
  currentGroupPlayerState!: {};
  currentPhase: string = "planification";
  currentDrawQueue: DrawModel[] = []
  cardsDeck: number[] = [];
  cardsDiscarded: number[] = [];

  constructor(private gameStateService: GameState,
    private cardInfoService: ProjectCardInfoService,
  ){}


  ngOnInit(){
    this.cardsDeck = this.cardInfoService.getProjectCardIdList()

    this.gameStateService.addPlayer("joueur 1", "rgb(0, 0, 255)")
    this.gameStateService.addPlayer("joueur 2", "rgb(255, 0, 0)")

    this.gameStateService.currentPhase.subscribe(
      phase => this.phaseChanged(phase)
    )
    this.gameStateService.currentGroupPlayerState.subscribe(
      groupPlayerState => this.currentGroupPlayerState = groupPlayerState
    )
    this.gameStateService.currentDrawQueue.subscribe(
      drawQueue => this.handleDrawQueueRequest(drawQueue)
    )

    //force draw card list for debug purpose
    let cardDrawList: number[] = [37, 217, 135, 65, 92]

    this.gameStateService.addCardToPlayerHand(this.gameStateService.clientPlayerId, cardDrawList)    
  }

  phaseChanged(phase: Phase){
    this.currentPhase = phase
    if(phase==="planification"){
      let phaseList = ["development","construction","action","production","research"]
      let randomPhase = phaseList[Math.floor(Math.random() * 5)]
      this.gameStateService.playerSelectPhase(1, randomPhase as keyof SelectablePhase)
    }
    this.gameStateService.setPlayerReady(true, 1)
  }

  botReady(){
    this.gameStateService.setPlayerReady(true, 1)
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
  handleDrawQueueRequest(drawQueue: DrawModel[]):void{
    this.currentDrawQueue = drawQueue
    if(drawQueue.length===0){
      return
    }
    for(let element of drawQueue){
      if(this.cardsDeck.length===0){break}
      if(element.isFinalized===true){continue}
      if(element.cardList.length!=0){continue}
      if(element.playerId!=0){
        //preventing bot players to draw
        element.isFinalized = true
        continue
      }
      element.cardList = this.drawCardFromDeck(element.cardNumber)
    };
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
}
