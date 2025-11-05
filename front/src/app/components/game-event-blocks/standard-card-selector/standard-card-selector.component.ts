import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventBaseModel, EventCardSelector } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { CommonModule } from '@angular/common';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { ProjectListType } from '../../../types/project-card.type';

@Component({
	selector: 'app-standard-card-selector',
	imports: [
		CommonModule,
		PlayableCardListComponent,
	],
	templateUrl: './standard-card-selector.component.html',
	styleUrl: './standard-card-selector.component.scss'
})
export class StandardCardSelectorComponent implements OnInit{
	@Input() event!: EventBaseModel
	@Output() updateSelectedCardList: EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}> = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()

	_currentEvent!: EventCardSelector
	ngOnInit(): void {
		this._currentEvent = this.event as EventCardSelector
	}
	public onUpdateSelectedCardList(input: {selected: PlayableCardModel[], listType: ProjectListType}){
		this.updateSelectedCardList.emit(input)
	}
    onProjectActivated(a: any){

	}
}
