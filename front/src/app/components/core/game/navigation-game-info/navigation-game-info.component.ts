import { Component, OnInit } from '@angular/core';
import { GameStateFacadeService } from '../../../../services/game-state/game-state-facade.service';

@Component({
  selector: 'app-navigation-game-info',
  imports: [],
  templateUrl: './navigation-game-info.component.html',
  styleUrl: './navigation-game-info.component.scss'
})
export class NavigationGameInfoComponent implements OnInit{
	_deckSize!: number
	_round!: number
	_discardSize!: number

	constructor(private gameStateService: GameStateFacadeService){}

	ngOnInit(): void {
		this.gameStateService.currentDeck.subscribe(deck => this._deckSize = deck)
		this.gameStateService.currentRound.subscribe(round => this._round = round)
		this.gameStateService.currentDiscard.subscribe(discard => this._discardSize = discard)
	}
}
