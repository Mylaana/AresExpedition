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

  phase!: Phase;
  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.phase = this.gameStateService.getPhase()
  }

  setNewPhase(newPhase:Phase): void {
    //triggers phase change to emulate server response
    this.gameStateService.setNewPhase(newPhase)
    this.phase = this.gameStateService.getPhase()
  }
}
