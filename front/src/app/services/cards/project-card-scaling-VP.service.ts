import { Injectable } from "@angular/core";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { CardScalingVP } from "../../interfaces/card.interface";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { ProjectFilterNameEnum } from "../../enum/global.enum";

@Injectable({
	providedIn: 'root'
})
export class ProjectCardScalingVPService {
	scaledVpList: CardScalingVP[]= []

	private readonly vpCalculators: Record<string, (card: PlayableCardModel, state: PlayerStateModel) => number> = {
		"12": (card) => card.getStockValue('animal'), //Birds
		"18": (_, state) => Math.floor(state.getForest() / 2),
		"24": (card) => Math.floor(card.getStockValue('animal') / 2), //Ecological zone
		"30": (card) => card.getStockValue('animal'), //Fish
		"33": (card) => Math.floor(card.getStockValue('animal') / 2), //Herbivore
		//Interplanetary Relations
		"35": (_, state) => {
			const valid = state.getProjectPlayedModelList()
				.filter(c => c.cardType !== 'corporation').length;
			return Math.floor(valid / 4);
		},
		"39": (card) => card.getStockValue('animal'), //Livestock
		"46": (card) => Math.floor(card.getStockValue('science') / 2), //Physics complex
		"53": (card) => Math.floor(card.getStockValue('animal') / 2), //Small Animals
		"58": (card) => Math.floor(card.getStockValue('microbe') / 3), //Tardigrades
		"59": (_, state) => Math.floor(state.getProjectPlayedIdList({ type: ProjectFilterNameEnum.blueProject }).length / 3), //Think Tank
		"63": (_, state) => state.getTagsOfType('jovian'), //Water Import from Europa
		"146": (_, state) => Math.floor(state.getTagsOfType('earth') / 2), //Immigration Shuttles
		"153": (_, state) => state.getTagsOfType('jovian'), //Io Mining Industries
		"F07": (card) => Math.floor(card.getStockValue('animal') / 2), //Pets
		"P04": (card) => Math.floor(card.getStockValue('animal') / 3), //Filter Feeders
		"P12": (card) => Math.floor(card.getStockValue('animal') / 2), //Arklight
		"P12B": (card) => Math.floor(card.getStockValue('animal') / 2), //Arklight B
		"P25": (card) => card.getStockValue('animal'), //Zoo
		"FM11": (card) => card.getStockValue('science'), //Arkship
		"FM13": (_, state) => state.getTagsOfType('jovian'), //Ganymede Colony
		"FM15": (card) => Math.floor(card.getStockValue('microbe')/2), //Ants
		"FM27": (card) => card.getStockValue('science'), //Jovian Lanterns
		"M11": (_, state) => state.getMine(), //Luna Mining Hub
		"M13": (_, state) => state.getTagsOfType('moon'), //Luna Senate
		"M14": (_, state) => state.getHabitat(), //Luna Train Station
		"M27": (_, state) => state.getHabitat(), //Luna Ecumenapolis
		"M28": (_, state) => Math.floor(state.getTagsOfType('moon') /2), //Grand Luna academy
		"M81": (card) => card.getStockValue('science'), //Moon Minerals Tradecenter
		"M84": (_, state) => state.getTagsOfType('moon'), //Copernicus Tower
		"M85": (card) => Math.floor(card.getStockValue('microbe') / 2), //Darkside Incubation Plant
		"M87": (card) => card.getStockValue('science'), //Luna Archives
		"M89": (card) => Math.floor(card.getStockValue('microbe') / 3), //Rust Eating Bacteria
		"M90": (card) => Math.floor(card.getStockValue('animal') / 2), //Pets Acclimatization
		"M91": (_, state) => Math.floor(state.getMine() /2), //3d printing mine facility
		"M124": (_, state) => state.getTagsOfType('jovian')+state.getTagsOfType('moon'), //Jupiter Embassy

		"MC1": (_, state) => Math.floor(state.getTagsOfType('moon') / 2), //Crescent research association
		"MC4": (_, state) => state.getHabitat() //Grand Luna Capital Group
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
