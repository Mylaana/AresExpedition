import { Component, Input } from '@angular/core';
import { CardType } from '../../../../../types/project-card.type';
import { CommonModule } from '@angular/common';
import { SettingCardSize } from '../../../../../types/global.type';

@Component({
    selector: 'app-card-title',
    imports: [CommonModule],
    templateUrl: './card-title.component.html',
    styleUrl: './card-title.component.scss'
})
export class CardTitleComponent{
	@Input() title!: string
	@Input() cardType!: CardType
	@Input() cardSize!: SettingCardSize
}
