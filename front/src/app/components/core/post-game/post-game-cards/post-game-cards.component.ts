import { Component, Input, OnInit } from '@angular/core';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-post-game-cards',
	imports: [CommonModule],
	templateUrl: './post-game-cards.component.html',
	styleUrl: './post-game-cards.component.scss'
})
export class PostGameCardsComponent implements OnInit{
  	@Input() groupState!: PlayerStateModel[]
	ngOnInit(): void {

	}
	getSeen(state: PlayerStateModel): number {
		return state.getStatState().getCardSeen()
	}
}
