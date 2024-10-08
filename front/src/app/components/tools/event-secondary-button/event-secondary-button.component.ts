import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChildButton, EventButtonBase, EventSecondaryButton } from '../../../models/core-game/button.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-event-secondary-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-secondary-button.component.html',
  styleUrl: './event-secondary-button.component.scss'
})
export class EventSecondaryButtonComponent{
  @Output() childButtonClicked: EventEmitter<EventButtonBase> = new EventEmitter<EventButtonBase>()
  @Input() button!: EventSecondaryButton;
  
  onClick(){
    this.childButtonClicked.emit(this.button)
  }
}