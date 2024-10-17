import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';

@Component({
  selector: 'app-event-play-zone-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-play-zone-button.component.html',
  styleUrl: './event-play-zone-button.component.scss'
})
export class EventCardBuilderButtonComponent {
  @Output() eventCardBuilderButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
  @Input() button!: EventCardBuilderButton;
  
  onClick(){
    this.eventCardBuilderButtonClicked.emit(this.button)
  }
}
