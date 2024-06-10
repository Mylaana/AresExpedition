import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../services/global/game-state.service';

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Component({
  selector: 'app-server-emulation',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './server-emulation.component.html',
  styleUrl: './server-emulation.component.scss'
})
export class ServerEmulationComponent implements OnInit {
  currentGroupPlayerState!: {};
  currentPhase: string = "planification";
  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.gameStateService.currentPhase.subscribe(
      phase => this.currentPhase = phase
    )
    this.gameStateService.currentGroupPlayerState.subscribe(
      groupPlayerState => this.currentGroupPlayerState = groupPlayerState
    )
    this.gameStateService.addPlayer("joueur 1", "rgb(0, 0, 255)")
    this.gameStateService.addPlayer("joueur 2", "rgb(255, 0, 0)")
  }
  updatePhase(newPhase:Phase): void {
    //sends phase update to service's subject
    this.gameStateService.updatePhase(newPhase)
  }
  printPlayersState(): void {
    console.log(this.currentGroupPlayerState)
}
}
