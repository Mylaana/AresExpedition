import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';
import { ButtonComponent } from './button.component';
import { TextWithImageComponent } from '../text-with-image/text-with-image.component';

@Component({
  selector: 'app-event-card-builder-button',
  standalone: true,
  imports: [
	CommonModule,
	TextWithImageComponent
],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class EventCardBuilderButtonComponent extends ButtonComponent{
  @Output() eventCardBuilderButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
  @Input() override button!: EventCardBuilderButton;
}
