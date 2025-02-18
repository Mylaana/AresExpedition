import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardBuilder, CardBuilder } from '../../../models/core-game/event.model';
import { ProjectCardListComponent } from '../project/project-card-list/project-card-list.component';
import { EventCardBuilderButton } from '../../../models/core-game/button.model';
import { EventCardBuilderButtonComponent } from '../../tools/button/event-card-builder-button.component';
import { CardBuilderOptionType, SelectablePhase } from '../../../types/global.type';
import { TopDecorationComponent } from '../../tools/layouts/top-decoration/top-decoration.component';
import { ProjectFilterType } from '../../../types/project-card.type';

@Component({
	selector: 'app-card-builder',
	standalone: true,
	imports: [
		CommonModule,
		EventCardBuilderButtonComponent,
		ProjectCardListComponent,
		TopDecorationComponent
	],
	templateUrl: './card-builder.component.html',
	styleUrl: './card-builder.component.scss'
})
export class CardBuilderComponent implements OnInit{
	@Input() cardBuilder!: CardBuilder
	@Input() option!: CardBuilderOptionType
	@Output() cardBuilderListButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
	@Input() projectFilterType!: ProjectFilterType

	@Input() event!: EventBaseModel
	@Input() eventId!: number
	currentEvent!: EventCardBuilder

	public cardBuilderButtonClicked(button: EventCardBuilderButton): void {
		this.cardBuilderListButtonClicked.emit(button)
	}
	ngOnInit(): void {
		console.log('the builder:',this.cardBuilder, 'option:', this.option,'event:', this.event, "filter:", this.projectFilterType)
	}
}
