import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { ApiPlayer } from '../../../../interfaces/websocket.interface';
import { myUUID } from '../../../../types/global.type';

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

	constructor(private route: ActivatedRoute) {
		this.route.queryParams.subscribe(params => {
			this.players = params['players'] ? JSON.parse(params['players']) : [];
			this.options = params['options'] ? JSON.parse(params['options']) : [];
			this.gameId = params['gameId'] ? JSON.parse(params['gameId']) : [];
			const rootUrl = window.location.origin;
		});
	}
}
