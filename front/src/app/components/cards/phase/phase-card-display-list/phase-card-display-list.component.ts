import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PhaseCardComponent } from '../phase-card/phase-card.component';
import { PhaseCardModel } from '../../../../models/cards/phase-card.model';
import { GameStateFacadeService } from '../../../../services/game-state/game-state-facade.service';
import { GameParamService } from '../../../../services/core-game/game-param.service';
import { SettingCardSize } from '../../../../types/global.type';

@Component({
  selector: 'app-phase-card-display-list',
  imports: [
	CommonModule,
	PhaseCardComponent
  ],
  templateUrl: './phase-card-display-list.component.html',
  styleUrl: './phase-card-display-list.component.scss'
})
export class PhaseCardDisplayListComponent implements OnInit{
	@Input() phaseCardList!: PhaseCardModel[]

	_cardSize!: SettingCardSize

	constructor(
		private gameStateService: GameStateFacadeService,
		private gameParam: GameParamService
	){}

	ngOnInit(): void {
		this.gameParam.currentCardSize.subscribe(size => this._cardSize = size)
	}
}
