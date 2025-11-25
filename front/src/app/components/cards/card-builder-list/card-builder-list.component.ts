import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CardBuilderComponent } from '../card-builder/card-builder.component';
import { CommonModule } from '@angular/common';
import { EventCardBuilderButton, NonEventButton } from '../../../models/core-game/button.model';
import { SettingCardSize } from '../../../types/global.type';
import { EventCardBuilder } from '../../../models/core-game/event.model';
import { Subject, take, takeUntil } from 'rxjs';
import { CardBuilder } from '../../../models/core-game/card-builder.model';
import { CardBuilderService } from '../../../services/core-game/components-services/card-builder.service';


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
	@Input() cardSize!: SettingCardSize
	@Output() cardBuilderButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
	@Output() alternativePayButtonClicked: EventEmitter<NonEventButton> = new EventEmitter<NonEventButton>()

	currentEvent!: EventCardBuilder | null
	builders!: CardBuilder[]
	_discount!: number

	destroy$ = new Subject<void>()

	constructor(
		private builderService: CardBuilderService,
	){}

	ngOnInit(): void {
		this.builderService.currentEventBuilder.pipe(takeUntil(this.destroy$)).subscribe(event => {	
			this.updateEvent(event)
		})
		this.builderService.currentCardBuilder.pipe(takeUntil(this.destroy$)).subscribe((builders) => {
			this.builders = builders
		})
		this.builderService.currentActiveBuilderDiscount.pipe(takeUntil(this.destroy$)).subscribe(discount => {
			this._discount = discount
		})
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	updateEvent(event: EventCardBuilder | null): void {
		this.currentEvent = event
	}
	recalcuateCardBuilderList(): void {
		if(!this.currentEvent){return}
		this.builders = this.currentEvent.cardBuilder
	}
	public onCardBuilderButtonClicked(button:EventCardBuilderButton): void {
		return
	}
	public onAlternativePayButtonClicked(button: NonEventButton): void {
		this.alternativePayButtonClicked.emit(button)
	}
}
