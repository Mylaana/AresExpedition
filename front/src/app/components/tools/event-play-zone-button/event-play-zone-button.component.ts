import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventPlayZoneButton } from '../../../models/core-game/button.model';

@Component({
  selector: 'app-event-play-zone-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-play-zone-button.component.html',
  styleUrl: './event-play-zone-button.component.scss'
})
export class EventPlayZoneButtonComponent {
  @Output() eventPlayZoneButtonClicked: EventEmitter<EventPlayZoneButton> = new EventEmitter<EventPlayZoneButton>()
  @Input() button!: EventPlayZoneButton;
  
  onClick(){
    this.eventPlayZoneButtonClicked.emit(this.button)
  }
}
