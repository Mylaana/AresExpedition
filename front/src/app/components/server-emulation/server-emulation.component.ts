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

  currentPhase: string = "planification";
  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.gameStateService.currentPhase.subscribe(
      phase => this.currentPhase = phase
    )
  }
  updatePhase(newPhase:Phase): void {
    //sends phase update to service's subject
    this.gameStateService.updatePhase(newPhase)
  }
}
