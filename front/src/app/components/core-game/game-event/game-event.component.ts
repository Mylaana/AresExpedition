import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PhasePlanificationComponent } from '../../phases/phase-planification/phase-planification.component';
import { PhaseDevelopmentComponent } from '../../phases/phase-development/phase-development.component';
import { PhaseConstructionComponent } from '../../phases/phase-construction/phase-construction.component';
import { PhaseActionComponent } from '../../phases/phase-action/phase-action.component';
import { PhaseProductionComponent } from '../../phases/phase-production/phase-production.component';
import { PhaseResearchComponent } from '../../phases/phase-research/phase-research.component';
import { NonSelectablePhase } from '../../../types/global.type';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { RessourceState } from '../../../interfaces/global.interface';
import { DrawModel } from '../../../models/core-game/draw.model';
import { ProjectCardListComponent } from '../../project-hand/project-card-list/project-card-list.component';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { ProjectCardInfoService } from '../../../services/player-hand/project-card-info.service';

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
    ProjectCardListComponent
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
  cardToSelect: ProjectCardModel[] = []

  ngOnInit(): void {
    this.clientPlayerId = this.gameStateService.clientPlayerId
    this.gameStateService.currentPhase.subscribe(
      phase => this.updatePhase(phase)
    )
    this.gameStateService.currentDrawQueue.subscribe(
      drawQueue => this.handleDrawQueueEvents(drawQueue)
    )
  }

  updatePhase(phase:NonSelectablePhase):void{
    this.currentPhase = phase
    if(phase==="production"){this.applyProductionPhase(this.gameStateService.getClientPlayerState())}
    if(phase==="research"){this.applyResearchPhase(this.gameStateService.getClientPlayerState())}
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

    //var drawQueueUpdated: boolean = false;
    for(let element of drawQueue){
      if(element.isFinalized===true){
        callCleanAndNext = true
        continue
      }
      if(element.cardList.length===0){continue}
      if(element.playerId!=0){
        //preventing bot players to draw
        element.isFinalized = true
        callCleanAndNext = true
        continue
      }
      if(element.drawRule==='draw'){
        this.gameStateService.addCardToPlayerHand(element.playerId, element.cardList)
        element.isFinalized = true
        callCleanAndNext = true
      }
      if(element.drawRule==='research'){
        this.cardToSelect = this.cardInfoService.getProjectCardList(element.cardList)
        
        element.isFinalized = true
        callCleanAndNext = true
      }
    };
    if(callCleanAndNext===true){
      this.gameStateService.cleanAndNextDrawQueue()
    }
    //this.gameStateService.removeDrawQueue(treatedQueue)
  }
}
