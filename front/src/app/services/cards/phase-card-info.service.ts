import { Injectable } from "@angular/core";
import { PhaseCardType } from "../../types/phase-card.type";
import { PhaseCardGroupModel, PhaseCardModel } from "../../models/cards/phase-card.model";
import jsonData from '../../../assets/data/phase-cards_data.json'
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { Utils } from "../../utils/utils";

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
			newPhaseCard.phaseGroup = Utils.toSelectablePhase(cardData.phaseGroupType)
			newPhaseCard.phaseType = cardData.phaseType as PhaseCardType
			newPhaseCard.baseDescription = cardData.baseDescription[language]
			newPhaseCard.bonusDescription = cardData.bonusDescription[language]
			newPhaseCard.phaseCardUpgraded = false
			newPhaseCard.title = this.getTitle(cardData.phaseId, cardData.cardLevel)
			phaseCards.push(newPhaseCard)
		}
		return phaseCards
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
				let newCard = new PhaseCardModel
				newCard.phaseId = card.phaseId
				newCard.cardLevel = card.cardLevel
				newCard.phaseGroup = card.phaseGroup
				newCard.phaseType = card.phaseType
				newCard.baseDescription = card.baseDescription
				newCard.bonusDescription = card.bonusDescription
				newCard.phaseCardUpgraded = Utils.jsonCopy(card.phaseCardUpgraded)
				newCard.title = card.title
				phaseGroup.phaseCards.push(newCard)
			}
		}

		phaseGroup.phaseIndex = phaseGroup.phaseCards[0].phaseId
		phaseGroup.phaseGroup = phaseGroupType

		return phaseGroup
	}
	private getTitle(phaseId: number, cardLevel: number): string {
		let title: string =''
		switch(phaseId){
			case(0):{
				title = 'I'
				break
			}
			case(1):{
				title = 'II'
				break
			}
			case(2):{
				title = 'III'
				break
			}
			case(3):{
				title = 'IV'
				break
			}
			case(4):{
				title = 'V'
				break
			}
		}
		switch(cardLevel){
			case(0):{
				title += ''
				break
			}
			case(1):{
				title += ' - B'
				break
			}
			case(2):{
				title += ' - C'
				break
			}
		}
		return title
	}
}
