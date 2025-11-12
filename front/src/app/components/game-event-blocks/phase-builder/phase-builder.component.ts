import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CardBuilderListComponent } from '../../cards/card-builder-list/card-builder-list.component';
import { EventCardBuilder } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn } from '../../../animations/animations';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { NonEventButton } from '../../../models/core-game/button.model';
import { Subject, takeUntil } from 'rxjs';
import { GameParamService } from '../../../services/core-game/game-param.service';
import { SettingCardSize } from '../../../types/global.type';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { PlayableCardListWrapperComponent } from '../../cards/project/playable-card-list-selector-wrapper/playable-card-list-wrapper.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { ProjectListType } from '../../../types/project-card.type';
import { EventHandler } from '../../../models/core-game/handlers.model';
import { CardBuilderEventHandlerService } from '../../../services/core-game/card-builder-event-handler.service';

@Component({
  selector: 'app-phase-builder',
  imports: [
	CommonModule,
	CardBuilderListComponent,
	PlayableCardListWrapperComponent,
	HexedBackgroundComponent
	],
  templateUrl: './phase-builder.component.html',
  styleUrl: './phase-builder.component.scss',
  animations: [fadeIn]
})
export class PhaseBuilderComponent{
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Output() cardBuilderButtonClicked = new EventEmitter<any>()
	@Output() updateSelectedCardList = new EventEmitter<any>()
	@ViewChild('cardListSelector') cardListSelector!: PlayableCardListComponent

	_currentEvent!: EventCardBuilder | null
	_cardSize!: SettingCardSize

	private destroy$ = new Subject<void>

	constructor(
		private gameParam: GameParamService,
		private cardBuilderHandlerService: CardBuilderEventHandlerService
	){}

	ngOnInit(): void {
		this.gameParam.currentCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
		this._currentEvent = this.cardBuilderHandlerService._currentEvent

	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	public onEventCardBuilderListButtonClicked(output: any){
		this.cardListSelector.updateDiscount(this._currentEvent as EventCardBuilder)
		this.cardListSelector.updateCardList()
	}
	public onUpdateSelectedCardList(output: any){
		this.cardListSelector.updateCardList()
	}
	public onAlternativePayButtonClicked(button: NonEventButton){
		this.cardListSelector.updateDiscount(this._currentEvent as EventCardBuilder)
	}
	public onSelectionUpdate(input:  {selected: PlayableCardModel[], listType: ProjectListType}){
		if(input.selected.length===0){return}
		this.cardBuilderHandlerService.applySelection(input.selected[0])
	}
	isSelectionActive(): boolean {
		if(!this._currentEvent){return false}
		return this._currentEvent.getSelectionActive()
	}
}
