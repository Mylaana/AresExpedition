import { Component, Input } from '@angular/core';
import { GameState } from '../../../services/game-state/game-state.service';

@Component({
  selector: 'app-player-ready',
  standalone: true,
  imports: [],
  templateUrl: './player-ready.component.html',
  styleUrl: './player-ready.component.scss'
})
export class PlayerReadyComponent {
  constructor(private gameState: GameState){};

  ready(isReady:boolean){
    this.gameState.setClientReady(isReady)
  };
}
