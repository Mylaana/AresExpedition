import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { myUUID, SettingInterfaceSize, SettingPlayerPannelSize } from '../../../types/global.type';
import { VpComponent } from '../../tools/vp/vp.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { GameOption } from '../../../services/core-game/create-game.service';
import { PlayerNameComponent } from '../player-name/player-name.component';
import { GameParamService } from '../../../services/core-game/game-param.service';

@Component({
	selector: 'app-global-pannel',
	imports: [
		CommonModule,
		VpComponent,
		PlayerNameComponent
	],
	templateUrl: './global-pannel.component.html',
	styleUrl: './global-pannel.component.scss'
})
export class GlobalPannelComponent implements OnInit{
	@Input() playerId!: myUUID;
	@Input() playerState!: PlayerStateModel
	@Input() playerIsReady!: boolean
	@Input() playerPhase!: PlayerPhase
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Input() gameOver!: boolean
	@Input() pannelSize!: SettingPlayerPannelSize

	private gameOptions!: GameOption

	constructor(
		private gameStateService: GameState,
	){}
	ngOnInit(): void {
		this.gameStateService.currentGameOptions.subscribe(options => this.gameOptions = options)
	}
	isDiscoveryActive(): boolean {
		if(!this.gameOptions){return false}
		return this.gameOptions.discovery
	}
}
