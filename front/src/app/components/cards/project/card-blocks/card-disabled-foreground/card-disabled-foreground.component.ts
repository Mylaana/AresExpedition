import { Component, Input } from '@angular/core';
import { CardType } from '../../../../../types/project-card.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-disabled-foreground',
  imports: [CommonModule],
  templateUrl: './card-disabled-foreground.component.html',
  styleUrl: './card-disabled-foreground.component.scss'
})
export class CardDisabledForegroundComponent {
	@Input() cardType!: CardType
}
