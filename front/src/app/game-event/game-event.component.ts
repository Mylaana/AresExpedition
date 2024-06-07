import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../services/global/game-state.service';
import { PhaseSelectorComponent } from '../components/phases/phase-selector/phase-selector.component';
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
    PhaseSelectorComponent,
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

  currentPhase: string = "planification";
  constructor(private gameStateService: GameState){}

  ngOnInit(): void {
    this.gameStateService.currentPhase.subscribe(
      phase => this.updatePhase(phase)
    )
  }
  updatePhase(phase:any):void{
    this.currentPhase = phase
  }
}
