import { Component, Input } from '@angular/core';
import { ButtonBase, CarouselButton } from '../../../../models/core-game/button.model';

@Component({
  selector: 'app-button-carousel',
  imports: [],
  templateUrl: './button-carousel.component.html',
  styleUrl: './button-carousel.component.scss'
})
export class ButtonCarouselComponent {
	@Input() button!: CarouselButton
}
