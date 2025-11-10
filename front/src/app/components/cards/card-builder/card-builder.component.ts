import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseModel, EventCardBuilder, CardBuilder } from '../../../models/core-game/event.model';
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
    styleUrl: './card-builder.component.scss'
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

	@Input() event!: EventBaseModel
	@Input() eventId!: number

	currentEvent!: EventCardBuilder

	_lockBuilder!: NonEventButton
	_hasAlternativeCost: boolean = false
	private destroy$ = new Subject<void>
	constructor(private gameState: GameStateFacadeService){

	}
	ngOnInit(): void {
		this._lockBuilder = ButtonDesigner.createNonEventButton('lockBuilder')
		this.gameState.currentEventQueue.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateAlternativeCostButtonsEnabled())
		this.gameState.currentClientState.pipe(takeUntil(this.destroy$)).subscribe((state) => this._hasAlternativeCost = PlayableCard.getAlternativePayActiveCodeList(state).length > 0)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	public cardBuilderButtonClicked(button: EventCardBuilderButton): void {
		this.cardBuilderListButtonClicked.emit(button)
		this.updateAlternativeCostButtonsEnabled()
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
	getAlernativeCostButtonUsed(): NonEventButtonNames[]{
		return (this.event as EventCardBuilder).getAlternativeCostUsed()
	}
}
