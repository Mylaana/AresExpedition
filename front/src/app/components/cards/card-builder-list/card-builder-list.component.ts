import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter, OnChanges, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import { CardBuilderComponent } from '../card-builder/card-builder.component';
import { CommonModule } from '@angular/common';
import { EventCardBuilderButton, NonEventButton } from '../../../models/core-game/button.model';
import { SettingCardSize } from '../../../types/global.type';
import { EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { Subject, takeUntil } from 'rxjs';
import { CardBuilderEventHandlerService } from '../../../services/core-game/card-builder-event-handler.service';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { CardBuilder } from '../../../models/core-game/card-builder.model';
import { Utils } from '../../../utils/utils';

@Component({
    selector: 'app-card-builder-list',
    imports: [
        CommonModule,
        CardBuilderComponent
    ],
    templateUrl: './card-builder-list.component.html',
    styleUrl: './card-builder-list.component.scss'
})
export class CardBuilderListComponent implements OnInit, OnDestroy{
	@Input() event!: EventCardBuilder
	@Input() eventId!: number
	@Input() cardSize!: SettingCardSize
	@Output() cardBuilderButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
	@Output() alternativePayButtonClicked: EventEmitter<NonEventButton> = new EventEmitter<NonEventButton>()

	currentEvent!: EventCardBuilder
	builders!: CardBuilder[]

	destroy$ = new Subject<void>()

	constructor(
		private builderService: CardBuilderEventHandlerService,
		private gameStateFacadeService: GameStateFacadeService
	){}

	ngOnInit(): void {
		this.gameStateFacadeService.currentEventBuilder.pipe(takeUntil(this.destroy$)).subscribe(event => {	
			this.updateEvent(event)
		})
		this.builderService.currentCardBuilder.pipe(takeUntil(this.destroy$)).subscribe((builders) => {
			this.builders = builders
			console.log('updated builders', this.builders)
		})
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	updateEvent(event: EventCardBuilder | null): void {
		this.currentEvent = this.event
		//this.builders = this.currentEvent.cardBuilder
		//this.recalcuateCardBuilderList()
	}
	recalcuateCardBuilderList(): void {
		if(!this.currentEvent){return}
		this.builders = this.currentEvent.cardBuilder
		console.log('CardBuilderListComponent - recalcuateCardBuilderList', this.builders)
	}
	public onCardBuilderButtonClicked(button:EventCardBuilderButton): void {
		console.log(button)
		return
	}
	public onAlternativePayButtonClicked(button: NonEventButton): void {
		this.alternativePayButtonClicked.emit(button)
	}
}
