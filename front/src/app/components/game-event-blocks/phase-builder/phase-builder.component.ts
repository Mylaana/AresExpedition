import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CardBuilderListComponent } from '../../cards/card-builder-list/card-builder-list.component';
import { EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn } from '../../../animations/animations';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { NonEventButton } from '../../../models/core-game/button.model';

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
