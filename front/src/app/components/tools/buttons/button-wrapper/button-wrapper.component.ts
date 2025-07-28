import { Component, Input, OnInit } from '@angular/core';
import { CarouselButton, NonEventButton, ToggleButton } from '../../../../models/core-game/button.model';
import { CommonModule } from '@angular/common';
import { ButtonCarouselComponent } from '../button-carousel/button-carousel.component';
import { NonEventButtonComponent } from '../../button/non-event-button.component';
import { ButtonToggleComponent } from '../button-toggle/button-toggle.component';
import { AnyButton } from '../../../../types/global.type';

@Component({
  selector: 'app-button-wrapper',
  imports: [
	CommonModule,
	ButtonCarouselComponent,
	NonEventButtonComponent,
	ButtonToggleComponent
  ],
  templateUrl: './button-wrapper.component.html',
  styleUrl: './button-wrapper.component.scss'
})
export class ButtonWrapperComponent implements OnInit{
	@Input() button!: AnyButton;

	ngOnInit(): void {
	}

	castToToggle(button: AnyButton): ToggleButton {return button as ToggleButton}
	castToNonEvent(button: AnyButton): NonEventButton {return button as NonEventButton}
	castToCarousel(button: AnyButton): CarouselButton {return button as CarouselButton}
}
