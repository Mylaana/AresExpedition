import { Component, Input, OnInit } from '@angular/core';
import { LayoutHexagonsComponent } from '../../../../tools/layouts/layout-hexagons/layout-hexagons.component';
import { CommonModule } from '@angular/common';
import { CardTypeUndefined, CardTypeColor } from '../../../../../types/project-card.type';
import { Utils } from '../../../../../utils/utils';

@Component({
    selector: 'app-card-background',
    imports: [
        CommonModule,
        LayoutHexagonsComponent
    ],
    templateUrl: './card-background.component.html',
    styleUrl: './card-background.component.scss'
})
export class CardBackgroundComponent implements OnInit{
	@Input() cardType!: CardTypeUndefined
	_color!: CardTypeColor

	ngOnInit(): void {
		this._color =  Utils.toCardTypeColor(this.cardType)
	}
}
