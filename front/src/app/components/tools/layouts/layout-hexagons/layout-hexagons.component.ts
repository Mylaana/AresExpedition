import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-layout-hexagons',
    imports: [CommonModule],
    templateUrl: './layout-hexagons.component.html',
    styleUrl: './layout-hexagons.component.scss'
})
export class LayoutHexagonsComponent {
	@Input() color: 'white' | 'blue' = 'white'
}
