import { Component, Input } from '@angular/core';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { SelectablePhase } from '../../../types/global.type';

@Component({
  selector: 'app-phase-planification',
  standalone: true,
  imports: [PlayerReadyComponent],
  templateUrl: './phase-planification.component.html',
  styleUrl: './phase-planification.component.scss'
})
export class PhasePlanificationComponent {
  @Input() clientPlayerId!: number;

  constructor(private gameStateService: GameState){}

  selectPhase(phaseName: string){
    this.gameStateService.playerSelectPhase(this.clientPlayerId, phaseName as keyof SelectablePhase)
  }
}
