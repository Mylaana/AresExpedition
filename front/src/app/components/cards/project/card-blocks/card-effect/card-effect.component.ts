import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';
import { SummaryType } from '../../../../../types/project-card.type';

@Component({
  selector: 'app-card-effect',
  standalone: true,
  imports: [
	CommonModule,
	TextWithImageComponent
  ],
  templateUrl: './card-effect.component.html',
  styleUrl: './card-effect.component.scss'
})
export class CardEffectComponent {
	@Input() effectSummaryType!: SummaryType
	@Input() effectSummaryText?: string
	@Input() effectText!: string
}
