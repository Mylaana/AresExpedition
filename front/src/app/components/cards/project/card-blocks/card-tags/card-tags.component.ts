import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardType, CardTypeColor } from '../../../../../types/project-card.type';
import { Utils } from '../../../../../utils/utils';

@Component({
    selector: 'app-card-tags',
    imports: [
        CommonModule,
    ],
    templateUrl: './card-tags.component.html',
    styleUrl: './card-tags.component.scss'
})
export class CardTagsComponent {
	@Input() tagsUrl?: string[]
	@Input() cardType!: CardType;
	_color!: CardTypeColor

	ngOnInit(): void {
		this._color = Utils.toCardTypeColor(this.cardType)
	}
}
