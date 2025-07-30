import { Component, Input, OnInit } from '@angular/core';
import { CardType, CardTypeColor } from '../../../../../types/project-card.type';
import { Utils } from '../../../../../utils/utils';
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
