import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EventBaseCardSelector, EventBaseModel } from '../../../models/core-game/event.model';
import { CommonModule } from '@angular/common';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { ProjectListType } from '../../../types/project-card.type';
import { PlayableCardListWrapperComponent } from '../../cards/project/playable-card-list-selector-wrapper/playable-card-list-wrapper.component';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { ProjectCardInfoService } from '../../../services/cards/project-card-info.service';
import { CardSelectorService } from '../../../services/core-game/components-services/card-selector.service';
import { Subject, takeUntil } from 'rxjs';
import { EventOrigin } from '../../../interfaces/global.interface';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';

@Component({
	selector: 'app-standard-card-selector',
	imports: [
		CommonModule,
		PlayableCardListWrapperComponent,
		PlayableCardListComponent,
		HexedBackgroundComponent
	],
	templateUrl: './standard-card-selector.component.html',
	styleUrl: './standard-card-selector.component.scss'
})
export class StandardCardSelectorComponent implements OnInit, OnDestroy {
	@Input() event!: EventBaseModel
	@Output() updateSelectedCardList: EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}> = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()

	_eventOriginCardList!: PlayableCardModel[]

	private destroy$ = new Subject<void>()

	constructor(
		private cardInfoService: ProjectCardInfoService,
		private selectorService: CardSelectorService
	){}

	ngOnInit(): void {
		//this.selectorService.currentNotifyRecalculateSelector.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateEventOriginList())
		//this.updateEventOriginList()
		this.selectorService.currentEventOrigin.pipe(takeUntil(this.destroy$)).subscribe(origin => this.updateEventOriginList(origin))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	updateEventOriginList(origin: EventOrigin | null){
		console.log('update origin', this.event)
		if(!this.event){return}
		if(!origin){return}
		let card = this.cardInfoService.getCardById(origin.originValue)
		if(!card){return}
		this._eventOriginCardList = [card]
	}
	public onUpdateSelectedCardList(input: {selected: PlayableCardModel[], listType: ProjectListType}){
		this.updateSelectedCardList.emit(input)
	}
}
