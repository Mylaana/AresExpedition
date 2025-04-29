import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardBuilderListComponent } from '../../cards/card-builder-list/card-builder-list.component';
import { EventBaseModel } from '../../../models/core-game/event.model';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { HexedBackgroundComponent } from '../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn } from '../../../animations/animations';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';

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
export class PhaseBuilderComponent {
	@Input() event!: EventBaseModel
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Output() cardBuilderButtonClicked = new EventEmitter<any>()
	@Output() updateSelectedCardList = new EventEmitter<any>()

	public onEventCardBuilderListButtonClicked(output: any){
		this.cardBuilderButtonClicked.emit(output)
	}
	public onUpdateSelectedCardList(output: any){
		this.updateSelectedCardList.emit(output)
	}
}
