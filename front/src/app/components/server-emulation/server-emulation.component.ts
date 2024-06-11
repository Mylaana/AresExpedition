import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../services/core-game/game-state.service';
import { PlayerReadyPannelComponent } from '../player-info/player-ready-pannel/player-ready-pannel.component';
import { PhaseHandlerService } from '../../services/core-game/phase-handler.service';
import { SelectablePhase } from '../../types/global.type';

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Component({
  selector: 'app-server-emulation',
  standalone: true,
  imports: [
    CommonModule,
    PlayerReadyPannelComponent
  ],
  templateUrl: './server-emulation.component.html',
  styleUrl: './server-emulation.component.scss'
})
export class ServerEmulationComponent implements OnInit {
  currentGroupPlayerState!: {};
  currentPhase: string = "planification";

  constructor(
    private gameStateService: GameState,
    private phaseHandler: PhaseHandlerService
  ){}


  ngOnInit(){
    this.gameStateService.addPlayer("joueur 1", "rgb(0, 0, 255)")
    this.gameStateService.addPlayer("joueur 2", "rgb(255, 0, 0)")

    this.gameStateService.currentPhase.subscribe(
      phase => this.phaseChanged(phase)
    )
    this.gameStateService.currentGroupPlayerState.subscribe(
      groupPlayerState => this.currentGroupPlayerState = groupPlayerState
    )

  }
  phaseChanged(phase: Phase){
    this.currentPhase = phase
    if(phase==="planification"){
      let phaseList = ["development","construction","action","production","research"]
      let randomPhase = phaseList[Math.floor(Math.random() * 5)]
      this.phaseHandler.playerSelectPhase(1, randomPhase as keyof SelectablePhase)
    }
    this.gameStateService.setPlayerReady(true, 1)
  }
  botReady(){
    this.gameStateService.setPlayerReady(true, 1)
  }
  updatePhase(newPhase:Phase): void {
    //sends phase update to service's subject
    this.gameStateService.updatePhase(newPhase)

    let phaseList = ["development","construction","action","production","research"]
    let randomPhase = phaseList[Math.floor(Math.random() * 5)]
    this.phaseHandler.playerSelectPhase(1, randomPhase as keyof SelectablePhase)
    this.gameStateService.setPlayerReady(true, 1)
  }
  printPlayersState(): void {
    console.log(this.currentGroupPlayerState)
    console.log(this.gameStateService.groupPlayerReady.getValue())
}
}
