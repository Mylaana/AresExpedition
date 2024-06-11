import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlayerPannelComponent } from '../player-pannel/player-pannel.component';
import { GameState } from '../../../services/core-game/game-state.service';

@Component({
  selector: 'app-self-info',
  standalone: true,
  imports: [
    CommonModule,
    PlayerPannelComponent,
  ],
  templateUrl: './self-info.component.html',
  styleUrl: './self-info.component.scss'
})
export class SelfInfoComponent {
  selfPlayerId!: number;
  currentGroupPlayerState!: {};

  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.selfPlayerId = this.gameStateService.playerId

    this.gameStateService.currentGroupPlayerState.subscribe(
      playersState => this.currentGroupPlayerState = playersState
    )

  }
}
