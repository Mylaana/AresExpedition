import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/cards/project-card.model";
import jsonData from '../../../assets/data/cards_data.json'
import { CardType, PrerequisiteTresholdType, SummaryType, PrerequisiteType } from "../../types/project-card.type";
import { AdvancedRessourceType } from "../../types/global.type";

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
    projectCardInfo: ProjectCardModel[] = this.loadJson()

    getCardById(cardId:number): ProjectCardModel | undefined {
        return this.projectCardInfo.find(x => x.id === cardId)
    }

    getProjectCardIdList(): number[] {
        let cardList: number[] = []
        for(let card of this.projectCardInfo){
            cardList.push(card.id)
        }
        return cardList
    }

    getProjectCardList(cardIdList: number[]): ProjectCardModel[] {
        var resultProjectCardList: ProjectCardModel[] = [];
        cardIdList.forEach(element => {
            let card = this.getCardById(element)
            if(card!=undefined){
                resultProjectCardList.push(card)
            }
        });
        return resultProjectCardList;
    }

    private getCardNumber(){
        return this.projectCardInfo.length
    }
    private loadJson(): ProjectCardModel[] {

        this.projectCardInfo = []
        let cardList: ProjectCardModel[] = []

        for(let jsonCard of jsonData){
            let card = new ProjectCardModel

            card.id = jsonCard.id
            card.cardCode = jsonCard.card_code
            card.origin = jsonCard.origin
            card.costInitial = jsonCard.cost
            card.tagsId = this.convertTagList(jsonCard.tagsId)
            card.cardSummaryType = this.convertSummaryType(jsonCard.effectSummaryType)
            card.cardType = this.convertCardType(jsonCard.cardType)
            card.vpNumber = jsonCard.vpNumber
            card.prerequisiteTresholdType = this.convertPrerequisiteTresholdType(jsonCard.prerequisiteTresholdType)
            card.prerequisiteType = this.convertPrerequisiteType(jsonCard.prerequisiteType)
            card.prerequisiteTresholdValue = Number(jsonCard.prerequisiteTresholdValue)
            card.phaseUp = jsonCard.phaseUp
            card.phaseDown = jsonCard.phaseDown

            card.title = jsonCard.title[language]
            card.vpText = jsonCard.vpText[language]
            card.effectSummaryText = jsonCard.effectSummaryText[language]
            card.effectText = jsonCard.effectText[language]
            card.playedText = jsonCard.playedText[language]
            card.prerequisiteText = jsonCard.prerequisiteText[language]
            card.prerequisiteSummaryText = jsonCard.prerequisiteSummaryText[language]
            card.stockable = this.convertStockable(jsonCard.stockable)

            cardList.push(card)
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
}
