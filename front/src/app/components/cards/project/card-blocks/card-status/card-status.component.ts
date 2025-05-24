import { Component, Input } from '@angular/core';
import { fadeInFadeOut } from '../../../../../animations/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-status',
  imports: [CommonModule],
  templateUrl: './card-status.component.html',
  styleUrl: './card-status.component.scss'
})
export class CardStatusComponent {
	@Input() cardCode!: string
	@Input() cardStatus!: string
	@Input() hovered: boolean = false
}
