import { Component, EventEmitter, Output } from '@angular/core';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn, fadeInFadeOut } from '../../../../animations/animations';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { ROUTE_NEWGAMELINKS } from '../../../../global/global-const';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { ButtonDesigner } from '../../../../factory/button-designer.service';
import { PlayerCreationPannelComponent } from '../../../create-game/player-creation-pannel/player-creation-pannel.component';
import { PlayerNumberComponent } from '../../../create-game/player-number/player-number.component';
import { CreatePlayer } from '../../../../interfaces/global.interface';
import { CommonModule } from '@angular/common';
import { ApiMessage, ApiPlayer } from '../../../../interfaces/websocket.interface';
import { Utils } from '../../../../utils/utils';
import { CreateGameOptionsComponent } from '../../../create-game/create-game-options/create-game-options.component';
import { CreateGameOptionService } from '../../../../services/core-game/create-game.service';

@Component({
    selector: 'app-new-game',
    imports: [
        CommonModule,
        HexedBackgroundComponent,
        NonEventButtonComponent,
        PlayerCreationPannelComponent,
        PlayerNumberComponent,
		CreateGameOptionsComponent
    ],
    templateUrl: './create-game.component.html',
    styleUrl: './create-game.component.scss',
    animations: [fadeIn, fadeInFadeOut]
})
export class CreateGameComponent {
	@Output() gameCreated = new EventEmitter<any>()
	private playerList: CreatePlayer[] = []
	_createGame: NonEventButton = ButtonDesigner.createNonEventButton('routeCreateNewGameValidation')
	_playerNumber: number = 2
	_errorMessage: string | null = null

	constructor(
		private apiService: ApiService,
		private router: Router,
		private createGameOptionService: CreateGameOptionService
	) {}

	displayError(message: string){
		this._errorMessage = message
		setTimeout(() => {
			this._errorMessage = null
		}, 3000);
	}

	createGame() {
		if(this._playerNumber != this.playerList.length){
			this.displayError('Each player must have a valid name and a color selected.')
			return
		}
		const postPlayerList: ApiPlayer[] = this.createPostPlayerList()
		//const gameConfig = {players:  JSON.stringify(postPlayerList)};
		const gameConfig: ApiMessage = {
			gameId: Utils.newUUID(),
			players:  postPlayerList,
			options: this.createGameOptionService.getGameOptions()
		};
		console.log('post gameconfig:',gameConfig)
		this.apiService.createGame(gameConfig).subscribe({
			next: (response) => {
				console.log('response:', response)
				this.router.navigate([ROUTE_NEWGAMELINKS], {
					queryParams: {
						gameId: JSON.stringify(response.gameId),
						players: JSON.stringify(response.players),
						options: JSON.stringify(response.options)??null
					}
				});
			},
			error: (error) => {
				if(error['status']===500){
					this.displayError('Cannot create game, server is offline')
					return
				}

				this.displayError('Error during game creation, see console for full error.')
				console.error(error)
			}
		});
	}
	onPlayerNumberSelected(playerNumber: number): void {
		this._playerNumber = playerNumber
	}
	onPlayerListUpdate(playerList: CreatePlayer[]): void {
		this.playerList = playerList
	}

	createPostPlayerList(): ApiPlayer[] {
		let list: ApiPlayer[] = []
		for(let player of this.playerList){
			let postPlayer: ApiPlayer = {
				id: Utils.newUUID(),
				name: player.name,
				color: player.color??undefined
			}
			list.push(postPlayer)
		}
		return list
	}

}

