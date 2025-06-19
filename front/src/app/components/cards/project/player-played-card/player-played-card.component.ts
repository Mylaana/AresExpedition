import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PlayableCardListComponent } from '../playable-card-list/playable-card-list.component';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { HorizontalSeparatorComponent } from '../../../tools/layouts/horizontal-separator/horizontal-separator.component';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { ProjectFilterNameEnum } from '../../../../enum/global.enum';

@Component({
  selector: 'app-player-played-card',
  imports: [
	CommonModule,
	PlayableCardListComponent,
	HorizontalSeparatorComponent
  ],
  templateUrl: './player-played-card.component.html',
  styleUrl: './player-played-card.component.scss'
})
export class PlayerPlayedCardComponent{
	@Input() state!: PlayerStateModel
	@Input() isClient: boolean = false

	displayCards(listId: number): PlayableCardModel[]{
		switch(listId){
			case(0):{
				return this.state.getProjectPlayedModelList({type:ProjectFilterNameEnum.playedDisplayCorpsAndActivable})
			}
			case(1):{
				return this.state.getProjectPlayedModelList({type:ProjectFilterNameEnum.playedDisplayTriggers})
			}
			case(2):{
				return this.state.getProjectPlayedModelList({type: ProjectFilterNameEnum.playedDisplayRed})
			}
			case(3):{
				return this.state.getProjectPlayedModelList({type: ProjectFilterNameEnum.greenProject})
			}
			default:{return []}
		}
	}
}
