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

//this component will serve as game event view, displaying phase selection, phase actions, cards to play/select etc
type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"


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
  ],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.scss'
})
export class GameEventComponent {
  constructor(private gameStateService: GameState){}

  clientPlayerId!:number;
  currentPhase: NonSelectablePhase = "planification";

  ngOnInit(): void {
    this.gameStateService.currentPhase.subscribe(
      phase => this.updatePhase(phase)
    )
    this.clientPlayerId = this.gameStateService.clientPlayerId
  }

  updatePhase(phase:NonSelectablePhase):void{
    this.currentPhase = phase

    if(phase==="production"){this.applyProductionPhase(this.gameStateService.getClientPlayerState())}
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
          var draw = new DrawModel;
          draw.playerId = this.clientPlayerId
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
}
