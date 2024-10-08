import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildButton, EventMainButton } from '../../../models/core-game/button.model';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Output() childButtonClicked: EventEmitter<ChildButton> = new EventEmitter<ChildButton>()
  @Input() button!: ChildButton;

  onClick(){
    this.childButtonClicked.emit(this.button)
  }
}
