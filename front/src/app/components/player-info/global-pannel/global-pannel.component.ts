import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PlayerPhase } from '../../../interfaces/global.interface';
import { NonSelectablePhaseEnum } from '../../../enum/phase.enum';
import { GameContentName, myUUID, SettingPlayerPannelSize } from '../../../types/global.type';
import { VpComponent } from '../../tools/vp/vp.component';
import { GameOption } from '../../../services/core-game/create-game.service';
import { PlayerNameComponent } from '../player-name/player-name.component';
import { GameActiveContentService } from '../../../services/core-game/game-active-content.service';

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
export class GlobalPannelComponent {
	@Input() playerId!: myUUID;
	@Input() playerState!: PlayerStateModel
	@Input() playerIsReady!: boolean
	@Input() playerPhase!: PlayerPhase
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Input() gameOver!: boolean
	@Input() pannelSize!: SettingPlayerPannelSize

	constructor(
		private gameContentService: GameActiveContentService
	){}
	isContentActive(name: GameContentName): boolean {
		return this.gameContentService.isContentActive(name)
	}
}
