import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter, OnChanges, ViewChildren, QueryList} from '@angular/core';
import { CardBuilderComponent } from '../card-builder/card-builder.component';
import { CommonModule } from '@angular/common';
import { CardBuilder, EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { EventCardBuilderButton, NonEventButton } from '../../../models/core-game/button.model';
import { SettingCardSize } from '../../../types/global.type';
import { PlayableCardModel } from '../../../models/cards/project-card.model';

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
	@Input() cardSize!: SettingCardSize
	@Output() cardBuilderButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
	@Output() alternativePayButtonClicked: EventEmitter<NonEventButton> = new EventEmitter<NonEventButton>()
	@ViewChildren('builder') builders!: QueryList<CardBuilderComponent>

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
		if(button.name==='buildCard'){
			for(let b of this.builders){
				b.updateAlternativeCostButtonsEnabled()
			}
		}
	}
	public onAlternativePayButtonClicked(button: NonEventButton): void {
		this.alternativePayButtonClicked.emit(button)
	}
}
