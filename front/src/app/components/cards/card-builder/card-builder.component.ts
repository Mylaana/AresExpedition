import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardBuilder } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../project/playable-card-list/playable-card-list.component';
import { EventCardBuilderButton, NonEventButton } from '../../../models/core-game/button.model';
import { EventCardBuilderButtonComponent } from '../../tools/button/event-card-builder-button.component';
import { ProjectFilter } from '../../../interfaces/global.interface';
import { BuilderOption, ProjectFilterNameEnum } from '../../../enum/global.enum';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CardBuilderAlternativeCostComponent } from '../card-builder-alternative-cost/card-builder-alternative-cost.component';
import { NonEventButtonNames, SettingCardSize } from '../../../types/global.type';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { Subject, takeUntil } from 'rxjs';
import { PlayableCard } from '../../../factory/playable-card.factory';
import { CardBuilder } from '../../../models/core-game/card-builder.model';
import { CardBuilderEventHandlerService } from '../../../services/core-game/card-builder-event-handler.service';
import { fadeIn, fadeInFadeOut, fadeOut } from '../../../animations/animations';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';

type BuilderBackgroundColor = 'green' | 'red' | 'blue' | 'bluered' | 'white' | 'redbluegreen'

@Component({
    selector: 'app-card-builder',
    imports: [
        CommonModule,
        EventCardBuilderButtonComponent,
        PlayableCardListComponent,
		CardBuilderAlternativeCostComponent
    ],
    templateUrl: './card-builder.component.html',
    styleUrl: './card-builder.component.scss',
	animations: [fadeOut, fadeInFadeOut]
})
export class CardBuilderComponent implements OnInit, OnDestroy{
	@Input() cardBuilder!: CardBuilder
	@Input() option!: BuilderOption
	@Input() projectFilter?: ProjectFilter
	@Input() discount: number = 0
	@Input() cardSize!: SettingCardSize
	@Output() cardBuilderListButtonClicked: EventEmitter<EventCardBuilderButton> = new EventEmitter<EventCardBuilderButton>()
	@Output() alternativePayButtonClicked: EventEmitter<NonEventButton> = new EventEmitter<NonEventButton>()
	@ViewChildren('altCost') alternativeCost!: QueryList<CardBuilderAlternativeCostComponent>

	currentEvent!: EventCardBuilder

	_lockBuilder!: NonEventButton
	_hasAlternativeCost: boolean = false
	_hoveredBackground = false
	_hoveredButtons = false

	private destroy$ = new Subject<void>
	constructor(
		private cardBuilderEventService: CardBuilderEventHandlerService
	){}
	ngOnInit(): void {
		this.cardBuilderEventService.currentAlternativeCostUnlocked.pipe(takeUntil(this.destroy$)).subscribe(
			unlocked => this._hasAlternativeCost = unlocked.length>0
		)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	public cardBuilderButtonClicked(button: EventCardBuilderButton): void {
		this.cardBuilderEventService.onCardBuilderButtonClicked(button)
	}
	public hasOptionButton(): boolean {
		return [BuilderOption.drawCard, BuilderOption.gain6MC].includes(this.cardBuilder.getOption())
	}
	public getBackground(): BuilderBackgroundColor {
		switch(this.projectFilter?.type){
			case(ProjectFilterNameEnum.blueOrRedProject):{
				return 'bluered'
			}
			case(ProjectFilterNameEnum.developmentPhaseSecondBuilder):
			case(ProjectFilterNameEnum.green9MCFree):
			case(ProjectFilterNameEnum.greenProject):{
				return 'green'
			}
			case(ProjectFilterNameEnum.blueProject):{
				return 'blue'
			}
			case(ProjectFilterNameEnum.maiNiProductions):{
				return 'redbluegreen'
			}
			case(undefined):{
				return 'redbluegreen'
			}
		}
		return 'white'
	}
	onAlternativePayButtonClicked(button: NonEventButton){
		this.alternativePayButtonClicked.emit(button)
		this.updateAlternativeCostButtonsEnabled()
	}
	public updateAlternativeCostButtonsEnabled(){
		if(!this.alternativeCost){return}
		if(this.cardBuilder.getBuilderIsLocked()){return}
		for(let a of this.alternativeCost){
			a.updateButtonEnabled()
		}
	}
	displayButtons(): boolean {
		return (this.cardBuilder.getButtons()[2].isEnabled() || this.cardBuilder.getButtons()[3].isEnabled()) && !(this._hoveredBackground && !this._hoveredButtons)
	}
}
