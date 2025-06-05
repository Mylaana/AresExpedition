import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardBuilder, CardBuilder } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../project/playable-card-list/playable-card-list.component';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';
import { EventCardBuilderButtonComponent } from '../../tools/button/event-card-builder-button.component';
import { CardBuilderOptionType } from '../../../types/global.type';
import { ProjectFilterNameEnum } from '../../../enum/global.enum';
import { ProjectFilter } from '../../../interfaces/global.interface';

@Component({
    selector: 'app-card-builder',
    imports: [
        CommonModule,
        EventCardBuilderButtonComponent,
        PlayableCardListComponent,
    ],
    templateUrl: './card-builder.component.html',
    styleUrl: './card-builder.component.scss'
})
export class CardBuilderComponent{
	@Input() cardBuilder!: CardBuilder
	@Input() option!: CardBuilderOptionType
	@Output() cardBuilderListButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
	@Input() projectFilter?: ProjectFilter
	@Input() discount: number = 0

	@Input() event!: EventBaseModel
	@Input() eventId!: number
	currentEvent!: EventCardBuilder

	public cardBuilderButtonClicked(button: EventCardBuilderButton): void {
		this.cardBuilderListButtonClicked.emit(button)
	}
}
