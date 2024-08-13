import { Component, Input, OnInit, Output, EventEmitter, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../interfaces/global.interface';
import { CardOptions } from '../../../interfaces/global.interface';
import { deepCopy } from '../../../functions/global.functions';


type updateType = 'select' | 'upgradeAndSelect'

@Component({
  selector: 'app-phase-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phase-card.component.html',
  styleUrl: './phase-card.component.scss'
})
export class PhaseCardComponent {
	@Input() options?: CardOptions;
	@Input() phaseCardLevel: number = 0;
	@Input() phaseIndex!: number;
	@Input() state!: CardState;
	@Output() cardStateChange: EventEmitter<{cardId: number, state:CardState, stateUpdateType:string}> = new EventEmitter<{cardId: number, state:CardState, stateUpdateType:string}>()

	selectable!: boolean;

	ngOnInit():void {
		if(this.phaseIndex===undefined){this.phaseIndex=0}
		this.selectable = false
	}

	updateState(updateType: updateType){
		let newState: CardState = deepCopy(this.state)
		if(updateType==='upgradeAndSelect'){
			newState.upgraded = true
		}
		newState.selected = true

		if(updateType==='upgradeAndSelect'){
			this.cardStateChange.emit({cardId:this.phaseCardLevel, state: newState, stateUpdateType: 'upgrade'})
		} else {
			this.cardStateChange.emit({cardId:this.phaseCardLevel, state: newState, stateUpdateType: 'select'})
		}

	}
}
