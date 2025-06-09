import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter, OnChanges} from '@angular/core';
import { CardBuilderComponent } from '../card-builder/card-builder.component';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';

@Component({
    selector: 'app-card-builder-list',
    imports: [
        CommonModule,
        CardBuilderComponent
    ],
    templateUrl: './card-builder-list.component.html',
    styleUrl: './card-builder-list.component.scss'
})
export class CardBuilderListComponent implements OnInit, OnChanges{
	@Input() event!: EventBaseModel
	@Input() eventId!: number
	@Output() cardBuilderButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()

	currentEvent!: EventCardBuilder
	ngOnInit(): void {
		this.updateEvent()
	}
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['event'] && changes['event'].currentValue){
			this.updateEvent()
		}
	}
	updateEvent(): void {
		this.currentEvent = this.event as EventCardBuilder
	}
	public onCardBuilderButtonClicked(button:EventCardBuilderButton): void {
		this.currentEvent.cardBuilderIdHavingFocus = button.parentCardBuilderId
		this.cardBuilderButtonClicked.emit(button)
	}
}
