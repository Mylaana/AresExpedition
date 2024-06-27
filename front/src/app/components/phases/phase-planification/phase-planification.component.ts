import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PlayerReadyComponent } from '../../player-info/player-ready/player-ready.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { SelectablePhase } from '../../../types/global.type';
import { state } from '@angular/animations';
import { CommonModule } from '@angular/common';

type PhaseState = 'default' | 'disabled'

interface Phase {
  name: SelectablePhase,
  caption: string,
  state: PhaseState,
  cssClass: string
}

@Component({
  selector: 'app-phase-planification',
  standalone: true,
  imports: [
    CommonModule,
    PlayerReadyComponent
  ],
  templateUrl: './phase-planification.component.html',
  styleUrl: './phase-planification.component.scss'
})
export class PhasePlanificationComponent {
  @Input() clientPlayerId!: number;
  @Output() phaseSelected: EventEmitter<any> = new EventEmitter<any>()
  phaseList: Phase[]= []
  constructor(private gameStateService: GameState){}

  ngOnInit(){
    this.createPhaseCard('development', 'I - Development', 'phase-development')
    this.createPhaseCard('construction', 'II - Construction', 'phase-construction')
    this.createPhaseCard('action', 'III - Action', 'phase-action')
    this.createPhaseCard('production', 'IV - Production', 'phase-production')
    this.createPhaseCard('research', 'V - Research', 'phase-research')
  }

  selectPhase(phaseName: string | undefined){
    if(phaseName===undefined){return}
    this.gameStateService.playerSelectPhase(this.clientPlayerId, phaseName as keyof SelectablePhase)
    this.phaseSelected.emit()
  }
  createPhaseCard(name: SelectablePhase, caption: string, cssClass:string, state?: PhaseState): void {
    if(state===undefined){state='default'}
    let newPhase: Phase = {
      name: name,
      caption: caption,
      state: state,
      cssClass: cssClass
    }
    this.phaseList.push(newPhase)
  }
}
