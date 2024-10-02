import { Component, Input, OnInit, OnChanges, SimpleChanges, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardSelectorPlayZone } from '../../../models/core-game/event.model';
import { EventSecondaryButtonComponent } from '../../tools/event-secondary-button/event-secondary-button.component';
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
export class CardBuilderComponent {
  @Input() event!: EventBaseModel
  @Input() eventId!: number
  currentEvent!: EventCardSelectorPlayZone

  ngOnInit(): void {
    this.updateCurrentEventFromInput()
  }
	ngOnChanges(changes: SimpleChanges) {
		if ((changes['eventInput'] && changes['eventInput'].currentValue) || (changes['eventId'] && changes['eventId'].currentValue)) {
			this.updateCurrentEventFromInput()
		}
	}
  updateCurrentEventFromInput(): void {
    if(this.event.hasCardBuilder()!=true){
      console.log('failed to convert event: ', this.event)
      return
    }
      this.currentEvent = this.event as EventCardSelectorPlayZone
  }
  public childButtonClicked(button: EventPlayZoneButton): void {

    this.currentEvent.playCardZoneIdHavingFocus = button.parentPlayZoneId

    switch(button.name){
      case('selectCard'):{
        this.currentEvent.activateSelection()
        break
      }
      case('cancelCard'):{
        this.currentEvent.deactivateSelection()
        break
      }
      case('buildCard'):{
        this.currentEvent.deactivateSelection()
        break
      }
      case('alternative'):{
        this.currentEvent.deactivateSelection()
        break
      }
    }
    console.log('button clicked received in card builder ', this.currentEvent)
  }
  public updateSelectedCardList(cardList: number[]): void {
    console.log('card list updated: ', cardList)
  }
}
