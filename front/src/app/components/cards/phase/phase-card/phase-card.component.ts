import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../../models/cards/card-cost.model';
import { deepCopy } from '../../../../functions/global.functions';
import { BaseCardComponent } from '../../base/base-card/base-card.component';
import { PhaseCardModel } from '../../../../models/cards/phase-card.model';


type updateType = 'select' | 'upgradeAndSelect'

@Component({
  selector: 'app-phase-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phase-card.component.html',
  styleUrl: './phase-card.component.scss'
})
export class PhaseCardComponent extends BaseCardComponent {
	@Input() phaseCardLevel: number = 0;
	@Input() phaseIndex!: number;
	@Input() phaseCard!: PhaseCardModel;

	override ngOnInit():void {
		super.ngOnInit()
		if(this.phaseIndex===undefined){this.phaseIndex=0}
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
