import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { ApiPlayer } from '../../../../interfaces/websocket.interface';
import { myUUID } from '../../../../types/global.type';
import { InterfaceTitleKey } from '../../../../types/text.type';
import { GameTextService } from '../../../../services/core-game/game-text.service';

@Component({
    selector: 'app-new-game-links',
    imports: [
        CommonModule,
        HexedBackgroundComponent
    ],
    templateUrl: './new-game-links.component.html',
    styleUrl: './new-game-links.component.scss'
})
export class NewGameLinksComponent {
	players: ApiPlayer[] = [];
	options: any
	gameId!: myUUID
	readonly rootUrl = window.location.origin;

	constructor(
		private route: ActivatedRoute,
		private gameTextService: GameTextService
	){
		this.route.queryParams.subscribe(params => {
			this.players = params['players'] ? JSON.parse(params['players']) : [];
			this.options = params['options'] ? JSON.parse(params['options']) : [];
			this.gameId = params['gameId'] ? JSON.parse(params['gameId']) : [];
			const rootUrl = window.location.origin;
		});
	}

	getTitle(key: InterfaceTitleKey): string {
		return this.gameTextService.getInterfaceTitle(key)
	}
}
