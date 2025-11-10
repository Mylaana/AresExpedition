import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CardBuilderListComponent } from '../../cards/card-builder-list/card-builder-list.component';
import { EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn } from '../../../animations/animations';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { NonEventButton } from '../../../models/core-game/button.model';
import { Subject, takeUntil } from 'rxjs';
import { GameParamService } from '../../../services/core-game/game-param.service';
import { SettingCardSize } from '../../../types/global.type';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';

@Component({
  selector: 'app-phase-builder',
  imports: [
	CommonModule,
	CardBuilderListComponent,
	PlayableCardListComponent,
	HexedBackgroundComponent
	],
  templateUrl: './phase-builder.component.html',
  styleUrl: './phase-builder.component.scss',
  animations: [fadeIn]
})
export class PhaseBuilderComponent{
	@Input() event!: EventBaseModel
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Output() cardBuilderButtonClicked = new EventEmitter<any>()
	@Output() updateSelectedCardList = new EventEmitter<any>()
	@ViewChild('cardListSelector') cardListSelector!: PlayableCardListComponent

	_cardSize!: SettingCardSize

	private destroy$ = new Subject<void>

	constructor(
		private gameParam: GameParamService,
		private gameState: GameStateFacadeService
	){}

	ngOnInit(): void {
		this.gameParam.currentCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	public onEventCardBuilderListButtonClicked(output: any){
		this.cardBuilderButtonClicked.emit(output)
		this.cardListSelector.updateDiscount(this.event as EventCardBuilder)
		this.cardListSelector.updateCardList()
	}
	public onUpdateSelectedCardList(output: any){
		this.updateSelectedCardList.emit(output)
		this.cardListSelector.updateCardList()
	}
	public onAlternativePayButtonClicked(button: NonEventButton){
		this.cardListSelector.updateDiscount(this.event as EventCardBuilder)
	}
}
