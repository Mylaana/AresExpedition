import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventMainButton, EventSecondaryButton } from '../../../models/core-game/button.model';

@Component({
  selector: 'app-event-secondary-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-secondary-button.component.html',
  styleUrl: './event-secondary-button.component.scss'
})
export class EventSecondaryButtonComponent {
  @Output() childButtonClicked: EventEmitter<EventSecondaryButton> = new EventEmitter<EventSecondaryButton>()
  @Input() button!: EventSecondaryButton;
  
  onClick(){
    this.childButtonClicked.emit(this.button)
  }
}