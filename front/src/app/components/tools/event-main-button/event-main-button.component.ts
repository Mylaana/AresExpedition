import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChildButton, EventMainButton } from '../../../models/core-game/button.model';

@Component({
  selector: 'app-event-main-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-main-button.component.html',
  styleUrl: './event-main-button.component.scss'
})
export class EventMainButtonComponent extends ChildButton {
  @Output() eventMainButtonClicked: EventEmitter<EventMainButton> = new EventEmitter<EventMainButton>()
  @Input() button!: EventMainButton;

  ngOnInit():void{
    //console.log('main event button init')
  }

  onClick(){
    this.eventMainButtonClicked.emit(this.button)
  }
}