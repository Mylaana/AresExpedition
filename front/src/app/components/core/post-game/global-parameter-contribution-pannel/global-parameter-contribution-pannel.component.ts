import { Component, Input, OnInit } from '@angular/core';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { GlobalParameterNameEnum } from '../../../../enum/global.enum';
import { GameState } from '../../../../services/core-game/game-state.service';
import { CommonModule } from '@angular/common';
import { PlayerNameComponent } from '../../../player-info/player-name/player-name.component';
import { GameActiveContentService } from '../../../../services/core-game/game-active-content.service';

@Component({
  selector: 'app-global-parameter-contribution-pannel',
  imports: [
	CommonModule,
	PlayerNameComponent
  ],
  templateUrl: './global-parameter-contribution-pannel.component.html',
  styleUrl: './global-parameter-contribution-pannel.component.scss'
})
export class GlobalParameterContributionPannelComponent implements OnInit{
	@Input() groupState!: PlayerStateModel[]
	_parameterList: GlobalParameterNameEnum[] = [GlobalParameterNameEnum.ocean, GlobalParameterNameEnum.temperature, GlobalParameterNameEnum.oxygen]

	constructor(
		private gameStateService: GameState,
		private gameContentService: GameActiveContentService
	){}
	ngOnInit(): void {
		if(this.gameContentService.isContentActive('expansionFoundations')){this._parameterList.push(GlobalParameterNameEnum.infrastructure)}
	}
	getValue(playerIndex: number, columnIndex: number): string {
		return ''
	}
	getColumnName(): string[] {
		let result: string[] = ['']
		return result.concat(this._parameterList)
	}
	getParameterContribution(player: PlayerStateModel, parameterNameString: string): number {
		if(!parameterNameString){return 0}
		return player.getGlobalParameterContribution().get(parameterNameString as GlobalParameterNameEnum)??0
	}
	hasRightBorder(columnName: string): boolean{
		let names = this.getColumnName()
		return(columnName===names[names.length-1])
	}
}
