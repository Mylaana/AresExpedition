import { Component, Input, OnInit, OnChanges, SimpleChanges, DoCheck, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardSelectorPlayZone } from '../../../models/core-game/event.model';
import { ProjectCardListComponent } from '../../cards/project/project-card-list/project-card-list.component';
import { EventPlayZoneButton } from '../../../models/core-game/button.model';
import { EventPlayZoneButtonComponent } from '../../tools/event-play-zone-button/event-play-zone-button.component';

@Component({
  selector: 'app-card-builder',
  standalone: true,
  imports: [
    CommonModule,
    EventPlayZoneButtonComponent,
    ProjectCardListComponent
  ],
  templateUrl: './card-builder.component.html',
  styleUrl: './card-builder.component.scss'
})
export class CardBuilderComponent implements OnInit, OnChanges, DoCheck{
  @Input() event!: EventBaseModel
  @Input() eventId!: number
  currentEvent!: EventCardSelectorPlayZone
  @Output() gameEventPlayZoneButtonClicked: EventEmitter<EventPlayZoneButton> = new EventEmitter<EventPlayZoneButton>()

  ngOnInit(): void {
    this.updateCurrentEventFromInput()
  }
	ngOnChanges(changes: SimpleChanges) {
		if (changes['eventId'] && changes['eventId'].currentValue) {
			this.updateCurrentEventFromInput()
		}
	}
  ngDoCheck(): void {
    if(this.currentEvent!=undefined && this.currentEvent!=this.event){this.updateCurrentEventFromInput()}
  }
  updateCurrentEventFromInput(): void {
    if(this.event.hasCardBuilder()!=true){
      console.log('failed to convert event: ', this.event)
      return
    }
    this.currentEvent = this.event as EventCardSelectorPlayZone
  }
  public cardBuilderButtonClicked(button: EventPlayZoneButton): void {
    this.currentEvent.playCardZoneIdHavingFocus = button.parentPlayZoneId
    this.gameEventPlayZoneButtonClicked.emit(button)
  }
  public updateSelectedCardList(cardList: number[]): void {
    console.log('card list updated: ', cardList)
  }
}
