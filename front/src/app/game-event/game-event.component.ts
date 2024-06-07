import { Component, OnInit } from '@angular/core';
import { PhaseSelectorComponent } from '../components/phase-handler/phase-selector/phase-selector.component';
import { GameState } from '../services/global/game-state.service';

//this component will serve as game event view, displaying phase selection, phase actions, cards to play/select etc
type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Component({
  selector: 'app-game-event',
  standalone: true,
  imports: [
    PhaseSelectorComponent,
  ],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.scss'
})
export class GameEventComponent {

  phase!: Phase;
  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.phase = this.gameStateService.getPhase()
  }

  setNewPhase(newPhase:Phase): void {
    //triggers phase change to emulate server response
    this.phase = this.gameStateService.getPhase()
  }
  
}
