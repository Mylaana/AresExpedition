import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';
import { SettingCardSize } from '../../../../../types/global.type';

@Component({
	selector: 'app-card-scaling-production',
	imports: [
		CommonModule,
		TextWithImageComponent
	],
	templateUrl: './card-scaling-production.component.html',
	styleUrl: './card-scaling-production.component.scss'
})
export class CardScalingProductionComponent {
	@Input() production!: string
	@Input() hasScalingProduction!: boolean
	@Input() cardSize!: SettingCardSize
}
