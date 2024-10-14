import { Component, DoCheck, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CardBuilderComponent } from '../card-builder/card-builder.component';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-card-builder-list',
  standalone: true,
  imports: [
    CommonModule,
    CardBuilderComponent
  ],
  templateUrl: './card-builder-list.component.html',
  styleUrl: './card-builder-list.component.scss'
})
export class CardBuilderListComponent implements OnInit{
  @Input() event!: EventBaseModel
  @Input() eventId!: number
  @Output() eventCardBuilderListButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
  //@Output() cardBuilderListButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()

  currentEvent!: EventCardBuilder
  ngOnInit(): void {
    this.updateEvent()
    console.log(this.event)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['eventId'] && changes['eventId'].currentValue){
      this.updateEvent()
    }
  }
  ngDoCheck(): void {
    
  }
  updateEvent(): void {
    this.currentEvent = this.event as EventCardBuilder
  }
  public cardBuilderListButtonClicked(button:EventCardBuilderButton): void {
    console.log('list received: ', button)
    this.currentEvent.CardBuilderIdHavingFocus = button.parentCardBuilderId
  }
}
