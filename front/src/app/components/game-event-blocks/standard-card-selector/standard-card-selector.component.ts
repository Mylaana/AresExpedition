import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventBaseCardSelector, EventBaseModel } from '../../../models/core-game/event.model';
import { CommonModule } from '@angular/common';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { ProjectListType } from '../../../types/project-card.type';
import { PlayableCardListSelectorWrapperComponent } from '../../cards/project/playable-card-list-selector-wrapper/playable-card-list-wrapper.component';

@Component({
	selector: 'app-standard-card-selector',
	imports: [
		CommonModule,
		PlayableCardListSelectorWrapperComponent
	],
	templateUrl: './standard-card-selector.component.html',
	styleUrl: './standard-card-selector.component.scss'
})
export class StandardCardSelectorComponent {
	@Input() event!: EventBaseModel
	@Output() updateSelectedCardList: EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}> = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()

	_currentEvent!: EventBaseCardSelector

	public onUpdateSelectedCardList(input: {selected: PlayableCardModel[], listType: ProjectListType}){
		this.updateSelectedCardList.emit(input)
	}
}
