import { Injectable } from "@angular/core";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { CardScalingVP } from "../../interfaces/card.interface";
import { SCALING_VP } from "../../maps/playable-card-vp-maps";

@Injectable()
export class ProjectCardScalingVPServicepouet {
	scaledVpList: CardScalingVP[]= []

	updateCardScalingVPList(clientState: PlayerStateModel) {
		const result: CardScalingVP[] = [];

		for (const card of clientState.getProjectPlayedModelList()) {
			const calculator = SCALING_VP[card.cardCode];
			if (!calculator) continue;

			const vp = calculator(card, clientState);
			result.push({ cardCode: card.cardCode, vp });
		}

		this.scaledVpList = result
	}
	getCardScaledVp(cardCode: string): number {
		let result = this.scaledVpList.filter((code) => code.cardCode===cardCode)
		if(result.length>0){return result[0].vp}
		return 0
	}
	getTotalScalingVP(): number {
		return this.scaledVpList.reduce((sum, entry) => sum + entry.vp, 0);
	}
}
