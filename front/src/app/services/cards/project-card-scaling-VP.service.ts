import { Injectable } from "@angular/core";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { CardScalingVP } from "../../interfaces/card.interface";
import { PlayableCardModel } from "../../models/cards/project-card.model";

@Injectable({
	providedIn: 'root'
})
export class ProjectCardScalingVPService {
	scaledVpList: CardScalingVP[]= []
	private readonly vpCalculators: Record<string, (card: PlayableCardModel, state: PlayerStateModel) => number> = {
		"12": (card) => card.getStockValue('animal'), // Birds
		"18": (_, state) => Math.floor(state.getForest() / 2),
		"30": (card) => card.getStockValue('animal'), // Fish
		"33": (card) => Math.floor(card.getStockValue('animal') / 2), // Herbivore
		"35": (_, state) => {
			const valid = state.getProjectPlayedModelList()
				.filter(c => c.cardType !== 'corporation').length;
			return Math.floor(valid / 4);
		},
		"39": (card) => card.getStockValue('animal'), // Livestock
		"46": (card) => Math.floor(card.getStockValue('science') / 2),
		"53": (card) => Math.floor(card.getStockValue('animal') / 2), // Small Animals
		"58": (card) => Math.floor(card.getStockValue('microbe') / 3),
		"59": (_, state) => Math.floor(state.getProjectPlayedIdList({ type: 'blueProject' }).length / 3),
		"63": (_, state) => state.getTagsOfType('jovian'),
		"153": (_, state) => state.getTagsOfType('jovian'),
		"F07": (card) => Math.floor(card.getStockValue('animal') / 2), // Pets
		"CP01": (card) => Math.floor(card.getStockValue('animal') / 2), // Arklight
	};

	updateCardScalingVPList(clientState: PlayerStateModel) {
		const result: CardScalingVP[] = [];

		for (const card of clientState.getProjectPlayedModelList()) {
			const calculator = this.vpCalculators[card.cardCode];
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
