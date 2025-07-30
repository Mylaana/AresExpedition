import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardType, CardTypeColor, ProjectListType } from '../../../../../types/project-card.type';
import { Utils } from '../../../../../utils/utils';
import { SettingCardSize } from '../../../../../types/global.type';

@Component({
    selector: 'app-card-cost',
    imports: [CommonModule],
    templateUrl: './card-cost.component.html',
    styleUrl: './card-cost.component.scss'
})
export class CardCostComponent implements OnInit {
	@Input() cost: number = 0
	@Input() costInitial !: number
	@Input() cardLocation: ProjectListType = 'none'
	@Input() cardType!: CardType
	@Input() cardSize!: SettingCardSize
	_color!: CardTypeColor

	ngOnInit(): void {
		this._color = Utils.toCardTypeColor(this.cardType)
	}
	isCostMod(): boolean {
		return this.cost!=this.costInitial && this.cardLocation !='played'
	}
}
