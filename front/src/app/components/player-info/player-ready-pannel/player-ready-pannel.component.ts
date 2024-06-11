import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerReadyModel } from '../../../models/player-info/player-state.model';

@Component({
  selector: 'app-player-ready',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-ready-pannel.component.html',
  styleUrl: './player-ready-pannel.component.scss'
})
export class PlayerReadyPannelComponent implements OnInit {
  currentGroupPlayerReady!: PlayerReadyModel[];

  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.gameStateService.currentGroupPlayerReady.subscribe(
      groupPlayerReady => this.currentGroupPlayerReady = groupPlayerReady
    )
  }
}