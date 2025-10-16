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
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { SettingCardSize } from '../../../../types/global.type';
import { GameTextService } from '../../../../services/core-game/game-text.service';
import { GAME_PHASECARD_NAME_LIST } from '../../../../global/global-const';

type textType = 'abilityTitle' | 'ability' | 'bonusTitle' | 'bonus'

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
	@Input() upgradeFinished!: boolean
	@Input() cardSize!: SettingCardSize
	@Input() isDisplayOnly: boolean = false
	@Output() phaseCardUpgraded: EventEmitter<PhaseCardUpgradeType> = new EventEmitter<PhaseCardUpgradeType>()

	_upgradeButton: NonEventButton = ButtonDesigner.createNonEventButton('upgradePhase')

	constructor(private gameTextService: GameTextService){
		super()
	}

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
		this.state.setUpgraded(this.phaseCard.phaseCardUpgraded || (this.phaseCardLevel===0 && this.phaseGroupUpgraded))
	}
	isUpgradeable(): boolean {
		switch(this.phaseCardLevel){
			case(0):{
				return false
			}
			default:{
				return this.upgradeFinished===false
			}
		}

	}
	isCurrentUpgrade(): boolean {
		switch(this.phaseCardLevel){
			case(0):{
				return this.phaseGroupUpgraded===false
			}
			default:{
				return this.phaseGroupUpgraded===true && this.state.isUpgraded()
			}
		}
	}
	private getLevelToLetter(): string {
		switch(this.phaseCardLevel){
			case(0):{return 'A'}
			case(1):{return 'B'}
			case(2):{return 'C'}
			default:{
				return ''
			}
		}
	}
	private getCardText(): string{
		return GAME_PHASECARD_NAME_LIST[this.phaseIndex] + '_' + this.getLevelToLetter()
	}
	getText(type: textType): string {
		switch(type){
			case('abilityTitle'):{
				return this.gameTextService.getPhaseCardTitle('ability')
			}
			case('bonusTitle'):{
				return this.gameTextService.getPhaseCardTitle('bonus')
			}
			case('ability'):{
				return this.gameTextService.getPhaseCardDescription('ability' ,this.getCardText())
			}
			case('bonus'):{
				return this.gameTextService.getPhaseCardDescription('bonus', this.getCardText())
			}
		}
		return ''
	}
}
