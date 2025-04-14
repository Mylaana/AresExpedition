import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardType, CardTypeColor } from '../../../../../types/project-card.type';
import { Utils } from '../../../../../utils/utils';

@Component({
  selector: 'app-card-tags-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-tags-background.component.html',
  styleUrl: './card-tags-background.component.scss'
})
export class CardTagsBackgroundComponent implements OnInit{
	@Input() cardType!: CardType;
	_color!: CardTypeColor

	ngOnInit(): void {
		this._color = Utils.toCardTypeColor(this.cardType)
	}
}
