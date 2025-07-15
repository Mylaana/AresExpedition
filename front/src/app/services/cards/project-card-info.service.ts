import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import jsonData from '../../../assets/data/cards_data.json'
import { CardType, PrerequisiteTresholdType, SummaryType, PrerequisiteType } from "../../types/project-card.type";
import { AdvancedRessourceType } from "../../types/global.type";
import { Utils } from "../../utils/utils";
import { PlayableCardEffect, PlayableCardInterface } from "../../interfaces/card.interface";

const language = 'fr'

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

	getCardById(code:string): PlayableCardModel | undefined {
		let card = this.projectCardInfo.find(x => x.cardCode === code)
		if(!card){return}
        return PlayableCardModel.fromInterface(card)
    }

    getProjectCardIdList(): string[] {
        let cardList: string[] = []
        for(let card of this.projectCardInfo){
            cardList.push(card.cardCode)
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
    getProjectCardList(cardIdList: string[]): PlayableCardModel[] {
        let resultProjectCardList: PlayableCardModel[] = [];
        cardIdList.forEach(element => {
            let card = this.getCardById(Utils.jsonCopy(element))
            if(card!=undefined){
                resultProjectCardList.push(card)
            }
        });
        return resultProjectCardList;
    }
    public static getProjectCardIdListFromModel(cards: PlayableCardModel[]): string[] {
        let idList: string[] = []
        for(let card of cards){
            idList.push(card.cardCode)
        }
        return idList
    }
    private loadJson(): PlayableCardInterface[] {
        this.projectCardInfo = []
        let cardList: PlayableCardModel[] = []

        for(let jsonCard of jsonData){
            let card: PlayableCardInterface = {
				cardCode: jsonCard.card_code,
				origin: jsonCard.origin,
				costInitial: jsonCard.cost ?? 0,
				tagsId: this.convertTagList(jsonCard.tagsId ?? []),
				cardType: this.convertCardType(jsonCard.cardType),
				title: this.getLanguageOrFallback(jsonCard.title, language),
				effects: this.loadEffects(jsonCard),
				stockable: this.convertStockable(jsonCard.stockable??[]),
				status: jsonCard.status,
				scalingVp: Boolean(Number(jsonCard.vpScaling)),

			}
			if (jsonCard.vpNumber!='') {card.vpNumber = jsonCard.vpNumber}
			if (jsonCard.phaseUp) {card.phaseUp = jsonCard.phaseUp}
			if (jsonCard.phaseDown) {card.phaseDown = jsonCard.phaseDown}
			if (jsonCard.vpText) {card.vpText = this.getLanguageOrFallback(jsonCard.vpText, language)}
			if (jsonCard.playedText) {card.playedText = this.getLanguageOrFallback(jsonCard.playedText, language)}
			if (jsonCard.prerequisiteText) {card.prerequisiteText = this.getLanguageOrFallback(jsonCard.prerequisiteText, language)}
			if (jsonCard.prerequisiteSummaryText) {card.prerequisiteSummaryText = this.getLanguageOrFallback(jsonCard.prerequisiteSummaryText, language)}
			if (jsonCard.startingMegacredits) {card.startingMegacredits = jsonCard.startingMegacredits}
			if (jsonCard.effectSummaryOption) {card.effectSummaryOption = jsonCard.effectSummaryOption}
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
	getLanguageOrFallback<T extends Record<string, string>>(obj: T | undefined, lang: string, fallbackLang: string = 'en'): string {
		if (!obj) return '[Missing]'
		if(obj[lang]===''){
			return obj['en']
		}
		return obj[lang]
	}
	private loadEffects(input: any){
		let effects: PlayableCardEffect[] = []
		let actionText: string[] = []
		if(input['effectActionTextOption1']){
			actionText.push(this.getLanguageOrFallback(input['effectActionTextOption1'], language))
		}
		if(input['effectActionTextOption2']){
			actionText.push(this.getLanguageOrFallback(input['effectActionTextOption2'], language))
		}
		if(!input['effectText']){return []}
		effects.push({
			effectText: this.getLanguageOrFallback(input['effectText'],language),
			effectSummaryText: this.getLanguageOrFallback(input['effectSummaryText'], language),
			effectSummaryType: this.convertSummaryType(input['effectSummaryType']),
			effectAction: actionText
		})
		if(input['effectSummaryType2']){
			let actionText: string[] = []
			if(input['effectActionText2Option1']){
				actionText.push(this.getLanguageOrFallback(input['effectActionText2Option1'], language))
			}
			if(input['effectActionText2Option2']){
				actionText.push(this.getLanguageOrFallback(input['effectActionText2Option2'], language))
			}
			effects.push({
				effectText: this.getLanguageOrFallback(input['effectText2'], language),
				effectSummaryText: this.getLanguageOrFallback(input['effectSummaryText2'], language),
				effectSummaryType: this.convertSummaryType(input['effectSummaryType2']),
				effectAction: actionText
			})
		}
		return effects
	}
}
