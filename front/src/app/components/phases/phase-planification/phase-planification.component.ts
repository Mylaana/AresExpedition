import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { SelectablePhase } from '../../../types/global.type';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../tools/button/button.component';
import { ChildButton } from '../../../interfaces/global.interface';

@Component({
  selector: 'app-phase-planification',
  standalone: true,
  imports: [
    CommonModule,
    PlayerReadyComponent,
    ButtonComponent
  ],
  templateUrl: './phase-planification.component.html',
  styleUrl: './phase-planification.component.scss'
})
export class PhasePlanificationComponent {
  @Input() clientPlayerId!: number;
  @Output() phaseSelected: EventEmitter<any> = new EventEmitter<any>()
  buttonList: ChildButton [] = []
  currentPhaseSelected!: string;


  constructor(private gameStateService: GameState){}

  ngOnInit(){
    let phaseList = ["development", "construction", "action", "production", "research"]
    let playerPhase = this.gameStateService.getPlayerPhase(this.clientPlayerId)
    if(playerPhase===undefined){return}
    for(let phase of phaseList){
      this.createPhaseCard(phase as keyof SelectablePhase, playerPhase.previousSelectedPhase!=phase)
    }
  }

  createPhaseCard(buttonName: SelectablePhase, enabled: boolean): void {

    let newButton: ChildButton =  {
      id: this.buttonList.length,
      name: buttonName,
      enabled: enabled,
      imageUrl: `/assets/other/phase_${buttonName}.png`
    }
    this.buttonList.push(newButton)

  }
  public childButtonClicked(button: ChildButton ){
    if(button.name===undefined){return}

    this.currentPhaseSelected = button.name
    this.gameStateService.playerSelectPhase(this.clientPlayerId, button.name as keyof SelectablePhase)
    this.phaseSelected.emit()
  }
}
