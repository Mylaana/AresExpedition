import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-status',
  imports: [],
  templateUrl: './card-status.component.html',
  styleUrl: './card-status.component.scss'
})
export class CardStatusComponent {
	@Input() cardCode!: string
	@Input() cardStatus!: string
}
