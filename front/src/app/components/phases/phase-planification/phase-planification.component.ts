import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { ButtonNames, SelectablePhase } from '../../../types/global.type';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../tools/button/button.component';
import { ChildButton } from '../../../models/core-game/button.model';
import { PhaseCardModel } from '../../../models/cards/phase-card.model';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';

const phaseList = ["development", "construction", "action", "production", "research"]
const phaseIndexMap = new Map<number, SelectablePhase>([
  [0, 'development'],
  [1, 'construction'],
  [2, 'action'],
  [3, 'production'],
  [4, 'research']
])

@Component({
  selector: 'app-phase-planification',
  standalone: true,
  imports: [
    CommonModule,
    PlayerReadyComponent,
    ButtonComponent,
    TextWithImageComponent
  ],
  templateUrl: './phase-planification.component.html',
  styleUrl: './phase-planification.component.scss'
})
export class PhasePlanificationComponent {
  @Input() clientPlayerId!: number;
  @Output() phaseSelected: EventEmitter<any> = new EventEmitter<any>()
  buttonList: ChildButton [] = []
  currentPhaseSelected!: string;
  selectedPhaseCards: PhaseCardModel[] = []
  currentPhaseCard!: PhaseCardModel | undefined

  constructor(private gameStateService: GameState){}

  ngOnInit(){
    let playerPhase = this.gameStateService.getPlayerPhase(this.clientPlayerId)
    if(playerPhase===undefined){return}
    for(let phase of phaseList){
      this.createPhaseButtons(phase as keyof SelectablePhase, playerPhase.previousSelectedPhase!=phase)
    }
    this.setPhaseCards()
  }
  createPhaseButtons(buttonName: SelectablePhase, enabled: boolean): void {
    let newButton: ChildButton =  {
      name:buttonName as ButtonNames,
      id: this.buttonList.length,
      enabled: enabled,
      startEnabled: enabled,
      imageUrl: `/assets/other/phase_${buttonName}.png`
    }
    this.buttonList.push(newButton)
  }
  setPhaseCards(): void {
    this.selectedPhaseCards = this.gameStateService.getClientPlayerSelectedPhaseCards()
  }
  setCurrentPhaseCard(): void {
    //let index: number
    for(let index of phaseIndexMap.keys()){
      if(String(phaseIndexMap.get(index))===this.currentPhaseSelected){
        this.currentPhaseCard = this.selectedPhaseCards[index]
        return
      }
    }
    this.currentPhaseCard = undefined
  }
  public childButtonClicked(button: ChildButton ){
    if(button.name===undefined){return}
    this.currentPhaseSelected = button.name
    this.gameStateService.playerSelectPhase(this.clientPlayerId, button.name as keyof SelectablePhase)
    this.setCurrentPhaseCard()
    this.phaseSelected.emit()
  }
}
