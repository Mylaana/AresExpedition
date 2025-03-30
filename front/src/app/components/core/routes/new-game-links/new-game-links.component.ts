import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValidatedCreatePlayer } from '../../../../interfaces/global.interface';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';

@Component({
  selector: 'app-new-game-links',
  standalone: true,
  imports: [
	CommonModule,
	HexedBackgroundComponent
],
  templateUrl: './new-game-links.component.html',
  styleUrl: './new-game-links.component.scss'
})
export class NewGameLinksComponent {
	players: ValidatedCreatePlayer[] = [];
	options: any
	gameId: any
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
