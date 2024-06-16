import { Component, OnInit } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-selected-phase-pannel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-selected-phase-pannel.component.html',
  styleUrl: './player-selected-phase-pannel.component.scss'
})
export class PlayerSelectedPhasePannelComponent implements OnInit{
  currentGroupPlayerSelectedPhase!: PlayerPhase[];

  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.gameStateService.currentGroupPlayerSelectedPhase.subscribe(
      groupPlayerSelectedPhase => this.currentGroupPlayerSelectedPhase = groupPlayerSelectedPhase
    )
  }
}
