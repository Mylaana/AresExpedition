import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';
import { SummaryType } from '../../../../../types/project-card.type';
import { SettingCardSize } from '../../../../../types/global.type';

@Component({
    selector: 'app-card-effect',
    imports: [
        CommonModule,
        TextWithImageComponent
    ],
    templateUrl: './card-effect.component.html',
    styleUrl: './card-effect.component.scss'
})
export class CardEffectComponent implements OnInit{
	@Input() effectSummaryType!: SummaryType
	@Input() effectSummaryText?: string
	@Input() effectText!: string
	@Input() cardSize!: SettingCardSize

	_summaryText!: string[]
	ngOnInit(): void {
		this._summaryText = this.effectSummaryText?.split('$mix$')??[this.effectSummaryText??'']
		if(this._summaryText.length<2){return}
	}
	isMixProduction(): boolean {
		if(!this.effectSummaryText){return false}
		return this._summaryText.length>1
	}
}
