import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../../cards/phase-card/phase-card.component';
import { CardState } from '../../../types/project-card.type';
import { CardOptions } from '../../../interfaces/global.interface';

@Component({
  selector: 'app-phase-card-upgrade-list',
  standalone: true,
  imports: [
	CommonModule,
	PhaseCardComponent
],
  templateUrl: './phase-card-upgrade-list.component.html',
  styleUrl: './phase-card-upgrade-list.component.scss'
})
export class PhaseCardUpgradeListComponent{
	@Input() phaseIndex!: number;
	@Input() cardOptions!: CardOptions;
	@Output() cardUpgraded: EventEmitter<{phaseIndex: number, phaseCardLevel: number}> = new EventEmitter<{phaseIndex: number, phaseCardLevel: number}>()

	phaseCardIndexList!: number[];
	phaseCardState = new Map<number, CardState>();


	ngOnInit(): void {
		this.phaseCardIndexList = [0, 1, 2]
		let state: CardState = 'selected'
		for(let i in this.phaseCardIndexList){
			if(Number(i)>0){
				state='default'
			}
			this.phaseCardState.set(Number(i), state)
		}
	}

	public cardStateChange(card: {cardId: number, state:CardState}): void {
		for(let i=0; i<this.phaseCardIndexList.length; i++){
			if(this.phaseCardIndexList[i]===card.cardId){
				this.phaseCardState.set(i, 'selected')
				continue
			}
			this.phaseCardState.set(i, 'default')
		}
		this.cardUpgraded.emit({phaseIndex: this.phaseIndex, phaseCardLevel: card.cardId})
	}
	getCardStateFromIndex(index:number): CardState {
		let state = this.phaseCardState.get(index)
		if(!state){
			return 'default'
		}
		return state
	}
}
