import { Component, Input, OnInit } from '@angular/core';
import { LayoutHexagonsComponent } from '../../../../tools/layouts/layout-hexagons/layout-hexagons.component';
import { CommonModule } from '@angular/common';
import { CardType, CardTypeColor } from '../../../../../types/project-card.type';
import { Utils } from '../../../../../utils/utils';

@Component({
  selector: 'app-card-background',
  standalone: true,
  imports: [
	CommonModule,
    LayoutHexagonsComponent
  ],
  templateUrl: './card-background.component.html',
  styleUrl: './card-background.component.scss'
})
export class CardBackgroundComponent implements OnInit{
	@Input() cardType!: CardType
	_color!: CardTypeColor

	ngOnInit(): void {
		this._color =  Utils.toCardTypeColor(this.cardType)
	}
}
