import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card-starting-megacredits',
    imports: [],
    templateUrl: './card-starting-megacredits.component.html',
    styleUrl: './card-starting-megacredits.component.scss'
})
export class CardStartingMegacreditsComponent {
	@Input() startingMegacredits!: number
}
