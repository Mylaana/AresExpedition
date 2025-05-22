import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OceanBonus } from '../../../interfaces/global.interface';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { RessourceType } from '../../../types/global.type';

@Component({
    selector: 'app-ocean-card',
    imports: [
		CommonModule,
		TextWithImageComponent
	],
    templateUrl: './ocean-card.component.html',
    styleUrl: './ocean-card.component.scss'
})
export class OceanCardComponent {
	@Input() currentStep = 0
	@Input() addEop = 0
	@Input() oceanFlippedBonus!: OceanBonus[]
	_maxStep = 9
	_progressionList = [1,2,3,4,5,6,7,8,9]

	toMegacreditText(oceanBonus: OceanBonus): string[] | undefined {
		if(oceanBonus.megacredit===0){return}
		return this.toOtherText(oceanBonus.megacredit, '$ressource_megacredit$')
	}
	toPlantText(oceanBonus: OceanBonus): string[] | undefined {
		return this.toOtherText(oceanBonus.plant, '$ressource_plant$')
	}
	toCardText(oceanBonus: OceanBonus): string[] | undefined {
		return this.toOtherText(oceanBonus.card, '$ressource_card$')
	}

	private toOtherText(value: number, ressourceText: string): string[] | undefined {
		if(value===0){return}
		let result: string[] = []
		for(let i=0; i<value; i++){
			result.push(ressourceText)
		}
		return result
	}

}
