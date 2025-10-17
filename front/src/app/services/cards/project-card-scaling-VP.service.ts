import { Injectable } from "@angular/core";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";

@Injectable()
export class ProjectCardScalingVPService {
	private playerState!: PlayerStateModel
	private projectCard!: PlayableCardModel

	initialize(card: PlayableCardModel){
		this.projectCard = card
	}
	updatePlayerState(state: PlayerStateModel){
		this.playerState = state
		this.projectCard.vpNumber = this.playerState.getCardScaledVp(this.projectCard.cardCode).toString()
	}
}
