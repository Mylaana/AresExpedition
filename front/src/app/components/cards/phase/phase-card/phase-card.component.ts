import { Component, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../../models/cards/card-cost.model';
import { BaseCardComponent } from '../../base/base-card/base-card.component';
import { PhaseCardModel } from '../../../../models/cards/phase-card.model';
import { Utils } from '../../../../utils/utils';
import { PhaseCardUpgradeType } from '../../../../types/phase-card.type';
import { EventEmitter } from '@angular/core';


type updateType = 'upgrade'

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
	@Output() phaseCardUpgraded: EventEmitter<PhaseCardUpgradeType> = new EventEmitter<PhaseCardUpgradeType>()

	override ngOnInit():void {
		super.ngOnInit()
		if(this.phaseIndex===undefined){this.phaseIndex=0}
		this.setState()
	}

	upgrade(){
		let newState: CardState = Utils.jsonCopy(this.state)
		newState.upgraded = true

		this.phaseCardUpgraded.emit(this.phaseCard.phaseType as PhaseCardUpgradeType)
	}
	refreshState(): void {
		this.setState()
	}
	private setState(): void {
		this.state.upgraded = this.phaseCard.phaseCardUpgraded
	}
}
