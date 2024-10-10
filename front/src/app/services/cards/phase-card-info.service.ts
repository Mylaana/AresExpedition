import { Injectable } from "@angular/core";
import { PhaseCardType } from "../../types/phase-card.type";
import { PhaseCardGroupModel, PhaseCardModel, PhaseCardHolderModel } from "../../models/cards/phase-card.model";
import jsonData from '../../../assets/data/phase-cards_data.json'

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
			newPhaseCard.phaseType = cardData.type as PhaseCardType
			newPhaseCard.baseDescription = cardData.baseDescription[language]
			newPhaseCard.bonusDescription = cardData.bonusDescription[language]
			newPhaseCard.phaseCardSelected = cardData.cardLevel===0 //first card starts as true
			newPhaseCard.phaseCardUpgraded = cardData.cardLevel===0 //first card starts as true

			phaseCards.push(newPhaseCard)
		}
		return phaseCards
	}
	getPhaseCardFromIds(phaseIndex: number, cardLevel: number): PhaseCardModel{
		for(let card of this.phaseCards){
			if(card.phaseId===phaseIndex && card.cardLevel===cardLevel){
				return card
			}
		}
		console.log(`ERROR: phase card not found: phaseIndex=${phaseIndex} & cardLevel=${cardLevel}`)
		return new PhaseCardModel
	}
	getPhaseCardFromPhaseIndex(phaseIndex: number): PhaseCardModel[]{
		let phaseCards: PhaseCardModel[] = []
		for(let card of this.phaseCards){
			if(card.phaseId===phaseIndex){
				phaseCards.push(card)
			}
		}
		return phaseCards
	}
	getNewPhaseGroup(phaseIndex: number, phaseCardNumberPerPhase: number): PhaseCardGroupModel {
		let phaseGroup = new PhaseCardGroupModel

		for(let i=0; i<phaseCardNumberPerPhase; i++){
			phaseGroup.phaseCards.push(this.getPhaseCardFromIds(phaseIndex, i))
		}

		return phaseGroup
	}
	getNewPhaseHolderModel(phaseNumber:number, phaseCardNumberPerPhase: number): PhaseCardHolderModel {
		let newHolder = new PhaseCardHolderModel

		//create phaseGroups
		for(let i=0; i<phaseNumber; i++){
			newHolder.phaseGroups.push(this.getNewPhaseGroup(i, phaseCardNumberPerPhase))
		}
		return newHolder
	}
}
