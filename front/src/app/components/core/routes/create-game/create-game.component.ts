import { Component } from '@angular/core';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn } from '../../../../animations/animations';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { ROUTE_NEWGAMELINKS } from '../../../../global/global-const';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { ButtonDesigner } from '../../../../services/designers/button-designer.service';


@Component({
  selector: 'app-new-game',
  standalone: true,
  imports: [
	HexedBackgroundComponent,
	NonEventButtonComponent
],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.scss',
  animations: [fadeIn]
})
export class CreateGameComponent {
	message: string | null = null;
	_createGame: NonEventButton = ButtonDesigner.createNonEventButton('routeCreateNewGameValidation')
	constructor(
		private apiService: ApiService,
		private router: Router,
	) {}

	createGame() {
	const gameConfig = { gameMode: 'standard', maxPlayers: 4 };

	this.apiService.createGame(gameConfig).subscribe({
		next: (response) => {
			this.message = response.message;
			this.router.navigate([ROUTE_NEWGAMELINKS]);
		},
		error: (error) => {
			console.error('Error during game creation', error);
			this.message = 'Error during game creation.';
		}
	});
	}
}

