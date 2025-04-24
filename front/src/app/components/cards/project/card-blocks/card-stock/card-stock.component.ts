import { Component, Input } from '@angular/core';
import { AdvancedRessourceStock } from '../../../../../interfaces/global.interface';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card-stock',
    imports: [
        CommonModule
    ],
    templateUrl: './card-stock.component.html',
    styleUrl: './card-stock.component.scss'
})
export class CardStockComponent {
	@Input() cardStock?: AdvancedRessourceStock[]
}
