import { Component, OnInit } from '@angular/core';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';

@Component({
  selector: 'app-phase-production',
  standalone: true,
  imports: [PlayerReadyComponent],
  templateUrl: './phase-production.component.html',
  styleUrl: './phase-production.component.scss'
})
export class PhaseProductionComponent implements OnInit{
  constructor(private gameStateService: GameState){}
  currentGroupPlayerState!: PlayerStateModel[];
  clientPlayerState!: PlayerStateModel;

  ngOnInit(): void {
    this.gameStateService.currentGroupPlayerState.subscribe(
      groupPlayerState => this.updateState(groupPlayerState)

    )
  }

  updateState(state: PlayerStateModel[]): void {
    this.currentGroupPlayerState = state
    this.clientPlayerState = this.gameStateService.getClientState()
  }
}
