import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../services/core-game/game-state.service';
import { PhasePlanificationComponent } from '../components/phases/phase-planification/phase-planification.component';
import { PhaseDevelopmentComponent } from '../components/phases/phase-development/phase-development.component';
import { PhaseConstructionComponent } from '../components/phases/phase-construction/phase-construction.component';
import { PhaseActionComponent } from '../components/phases/phase-action/phase-action.component';
import { PhaseProductionComponent } from '../components/phases/phase-production/phase-production.component';
import { PhaseResearchComponent } from '../components/phases/phase-research/phase-research.component';

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
    PhaseResearchComponent
  ],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.scss'
})
export class GameEventComponent {
  playerId!:number;
  currentPhase: string = "planification";
  constructor(private gameStateService: GameState){}

  ngOnInit(): void {
    this.gameStateService.currentPhase.subscribe(
      phase => this.updatePhase(phase)
    )
    this.playerId = this.gameStateService.playerId
  }
  updatePhase(phase:any):void{
    this.currentPhase = phase
  }
}
