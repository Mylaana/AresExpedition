import { Component, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCardComponent } from '../../base/base-card/base-card.component';
import { PhaseCardModel } from '../../../../models/cards/phase-card.model';
import { Utils } from '../../../../utils/utils';
import { PhaseCardUpgradeType } from '../../../../types/phase-card.type';
import { EventEmitter } from '@angular/core';
import { CardState } from '../../../../interfaces/card.interface';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { TextWithImageComponent } from '../../../tools/text-with-image/text-with-image.component';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { ButtonDesigner } from '../../../../services/designers/button-designer.service';
import { NonEventButton } from '../../../../models/core-game/button.model';

@Component({
    selector: 'app-phase-card',
    imports: [
        CommonModule,
        HexedBackgroundComponent,
        TextWithImageComponent,
        NonEventButtonComponent
    ],
    templateUrl: './phase-card.component.html',
    styleUrl: './phase-card.component.scss'
})
export class PhaseCardComponent extends BaseCardComponent {
	@Input() phaseCardLevel: number = 0;
	@Input() phaseIndex!: number;
	@Input() phaseCard!: PhaseCardModel;
	@Input() phaseGroupUpgraded: boolean = false
	@Output() phaseCardUpgraded: EventEmitter<PhaseCardUpgradeType> = new EventEmitter<PhaseCardUpgradeType>()

	_upgradeButton: NonEventButton = ButtonDesigner.createNonEventButton('upgradePhase')

	override ngOnInit():void {
		super.ngOnInit()
		if(this.phaseIndex===undefined){this.phaseIndex=0}
		this.setState()
		console.log(this.phaseCard)
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
		this.state.setUpgraded(this.phaseCard.phaseCardUpgraded)
	}
}
