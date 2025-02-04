import { Injectable } from "@angular/core";
import { PhaseCardType } from "../../types/phase-card.type";
import { PhaseCardGroupModel, PhaseCardModel } from "../../models/cards/phase-card.model";
import jsonData from '../../../assets/data/phase-cards_data.json'
import { SelectablePhaseEnum } from "../../enum/phase.enum";

const language = 'en'

@Injectable({
    providedIn: 'root'
})
export class PhaseCardInfoService {
	phaseCards: PhaseCardModel[] = this.loadJson()

	loadJson(): PhaseCardModel[] {
		let phaseCards: PhaseCardModel[] = []
		for(let cardData of jsonData){
			let newPhaseCard = new PhaseCardModel

			newPhaseCard.phaseId = cardData.phaseId
			newPhaseCard.cardLevel = cardData.cardLevel
			newPhaseCard.phaseGroup = this.convertPhaseGroupType(cardData.phaseGroupType)
			newPhaseCard.phaseType = cardData.phaseType as PhaseCardType
			newPhaseCard.baseDescription = cardData.baseDescription[language]
			newPhaseCard.bonusDescription = cardData.bonusDescription[language]
			newPhaseCard.phaseCardUpgraded = cardData.cardLevel===0 //first card starts as true

			phaseCards.push(newPhaseCard)
		}
		return phaseCards
	}
	private convertPhaseGroupType(groupType: string): SelectablePhaseEnum {
		switch(groupType){
			case("development"):{return SelectablePhaseEnum.development}
			case("construction"):{return SelectablePhaseEnum.construction}
			case("action"):{return SelectablePhaseEnum.action}
			case("production"):{return SelectablePhaseEnum.production}
			case("research"):{return SelectablePhaseEnum.research}
			default:{return SelectablePhaseEnum.undefined}
		}
	}
	getPhaseCardFromIds(phaseIndex: number, cardLevel: number): PhaseCardModel {
		for(let card of this.phaseCards){
			if(card.phaseId===phaseIndex && card.cardLevel===cardLevel){
				return card
			}
		}
		console.log(`ERROR: phase card not found: phaseIndex=${phaseIndex} & cardLevel=${cardLevel}`)
		return new PhaseCardModel
	}
	getPhaseCardFromPhaseIndex(phaseIndex: number): PhaseCardModel[] {
		let phaseCards: PhaseCardModel[] = []
		for(let card of this.phaseCards){
			if(card.phaseId===phaseIndex){
				phaseCards.push(card)
			}
		}
		return phaseCards
	}
	getNewPhaseGroup(phaseGroupType: SelectablePhaseEnum): PhaseCardGroupModel {
		let phaseGroup = new PhaseCardGroupModel

		//cards
		for(let card of this.phaseCards){
			if(card.phaseGroup===phaseGroupType){
				phaseGroup.phaseCards.push(card)
			}
		}

		phaseGroup.phaseIndex = phaseGroup.phaseCards[0].phaseId
		phaseGroup.phaseGroup = phaseGroupType

		return phaseGroup
	}
}
