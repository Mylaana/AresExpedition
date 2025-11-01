import { Component, OnInit } from '@angular/core';
import { GameState } from '../../../../services/core-game/game-state.service';

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

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.gameStateService.currentDeck.subscribe(deck => this._deckSize = deck)
		this.gameStateService.currentRound.subscribe(round => this._round = round)
		this.gameStateService.currentDiscard.subscribe(discard => this._discardSize = discard)
	}
}
