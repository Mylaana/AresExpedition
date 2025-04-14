import { Component, Input } from '@angular/core';
import { AdvancedRessourceStock } from '../../../../../interfaces/global.interface';
import { CommonModule } from '@angular/common';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';

@Component({
  selector: 'app-card-stock',
  standalone: true,
  imports: [
	CommonModule,
	TextWithImageComponent
	],
  templateUrl: './card-stock.component.html',
  styleUrl: './card-stock.component.scss'
})
export class CardStockComponent {
	@Input() cardStock?: AdvancedRessourceStock[]
}
