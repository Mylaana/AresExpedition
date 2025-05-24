import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import jsonData from '../../../assets/data/cards_data.json'
import { CardType, PrerequisiteTresholdType, SummaryType, PrerequisiteType } from "../../types/project-card.type";
import { AdvancedRessourceType } from "../../types/global.type";
import { Utils } from "../../utils/utils";
import { PlayableCardEffect, PlayableCardInterface } from "../../interfaces/card.interface";

const language = 'en'

const stockableMap = new Map<string, AdvancedRessourceType>(
    [
        ['microbe', 'microbe'],
        ['animal', 'animal'],
        ['science', 'science']
    ]
)

@Injectable({
    providedIn: 'root'
})
export class ProjectCardInfoService {
	private projectCardInfo: PlayableCardInterface[] = this.loadJson()

	getCardById(cardId:number): PlayableCardModel | undefined {
		let card = this.projectCardInfo.find(x => x.id === cardId)
		if(!card){return}
        return PlayableCardModel.fromInterface(card)
    }

    getProjectCardIdList(): number[] {
        let cardList: number[] = []
        for(let card of this.projectCardInfo){
            cardList.push(card.id)
        }
        return cardList
    }

	getAllProjectCard(): PlayableCardModel[]{
		let result: PlayableCardModel[] = []
		for(let card of this.projectCardInfo){
			let cardModel = PlayableCardModel.fromInterface(card)
			if(cardModel){
				result.push(cardModel)
			}
		}
		return result
	}
    getProjectCardList(cardIdList: number[]): PlayableCardModel[] {
        let resultProjectCardList: PlayableCardModel[] = [];
        cardIdList.forEach(element => {
            let card = this.getCardById(Utils.jsonCopy(element))
            if(card!=undefined){
                resultProjectCardList.push(card)
            }
        });
        return resultProjectCardList;
    }
    public static getProjectCardIdListFromModel(cards: PlayableCardModel[]): number[] {
        let idList: number[] = []
        for(let card of cards){
            idList.push(card.id)
        }
        return idList
    }
    private loadJson(): PlayableCardInterface[] {

        this.projectCardInfo = []
        let cardList: PlayableCardModel[] = []

        for(let jsonCard of jsonData){
            let card: PlayableCardInterface = {
				id: jsonCard.id,
				cardCode: jsonCard.card_code,
				origin: jsonCard.origin,
				costInitial: jsonCard.cost,
				tagsId: this.convertTagList(jsonCard.tagsId),
				cardType: this.convertCardType(jsonCard.cardType),
				vpNumber: jsonCard.vpNumber,
				prerequisiteTresholdType: this.convertPrerequisiteTresholdType(jsonCard.prerequisiteTresholdType),
				prerequisiteType: this.convertPrerequisiteType(jsonCard.prerequisiteType),
				prerequisiteTresholdValue: Number(jsonCard.prerequisiteTresholdValue),
				phaseUp: jsonCard.phaseUp,
				phaseDown: jsonCard.phaseDown,

				title: jsonCard.title[language],
				vpText: jsonCard.vpText[language],
				effects: this.loadEffects(jsonCard),// this.loadEffects(jsonCard.effects),
				playedText: jsonCard.playedText[language],
				prerequisiteText: jsonCard.prerequisiteText[language],
				prerequisiteSummaryText: jsonCard.prerequisiteSummaryText[language],
				stockable: this.convertStockable(jsonCard.stockable),
				startingMegacredits: jsonCard.startingMegacredits,
				status: jsonCard.status
			}
			let cardModel = PlayableCardModel.fromInterface(card)
			if(card.stockable){
				for(let stock of card.stockable){
					cardModel.setInitialStock(stock)
				}
			}
            cardList.push(cardModel)
        }
        return cardList
    }
    private convertTagList(inputList: any[]): number[] {
        let tags = []
        for(let tag of inputList){
            tags.push(Number(tag))
        }
        return tags
    }
    private convertStockable(inputList: string[]): AdvancedRessourceType[] {
        let result: AdvancedRessourceType[] = []
        for(let input of inputList){
            let ressource = stockableMap.get(input)
            if(!ressource){continue}
            result.push(ressource)
        }
        return result
    }
    private convertSummaryType(input: string): SummaryType {
        switch(input){
            case('action'):{
                return 'action'
            }
            case('trigger'):{
                return 'trigger'
            }
            case('production'):{
                return 'production'
            }
            case('greyProduction'):{
                return 'greyProduction'
            }
			case('mixedProduction'):{
                return 'mixedProduction'
            }
            default:{
                return undefined
            }
        }
    }
    private convertCardType(input: string): CardType {
        switch(input){
            case('redProject'):{
                return 'redProject'
            }
            case('greenProject'):{
                return 'greenProject'
            }
            case('blueProject'):{
                return 'blueProject'
            }
			case('corporation'):{
                return 'corporation'
            }
            default:{
                return undefined
            }
        }
    }
    private convertPrerequisiteTresholdType(input: string): PrerequisiteTresholdType {
        switch(input){
            case('min'):{
                return 'min'
            }
            case('max'):{
                return 'max'
            }
            default:{
                return undefined
            }
        }
    }
    private convertPrerequisiteType(input: string): PrerequisiteType {
        switch(input){
            case('tag'):{
                return 'tag'
            }
            case('oxygen'):{
                return 'oxygen'
            }
            case('infrastructure'):{
                return 'infrastructure'
            }
            case('ocean'):{
                return 'ocean'
            }
            case('heat'):{
                return 'heat'
            }
            case('tr'):{
                return 'tr'
            }
            default:{
                return undefined
            }
        }
    }
	private loadEffects(input: any){
		let effects: PlayableCardEffect[] = []

		effects.push({
			effectText: input['effectText'][language],
			effectSummaryText: input['effectSummaryText'][language],
			effectSummaryType: this.convertSummaryType(input['effectSummaryType'])
		})
		if(input['effectSummaryType2']){
			effects.push({
				effectText: input['effectText2'][language],
				effectSummaryText: input['effectSummaryText2'][language],
				effectSummaryType: this.convertSummaryType(input['effectSummaryType2'])
			})
		}
		return effects
	}
}
