import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/player-hand/project-card.model";
import jsonData from '../../../assets/data/cards_data.json'
import { json } from "stream/consumers";
import { CardType, PrerequisiteTresholdType, SummaryType, PrerequisiteType } from "../../types/project-card.type";

const language = 'en'

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

    getCardNumber(){
        return this.projectCardInfo.length
    }
    loadJson(): ProjectCardModel[] {
        let card = new ProjectCardModel
        this.projectCardInfo = []
        let cardList: ProjectCardModel[] = []

        for(let jsonCard of jsonData){
            
            card.id = jsonCard.id
            card.cardCode = jsonCard.card_code
            card.origin = jsonCard.origin
            card.cost = jsonCard.cost
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

            cardList.push(JSON.parse(JSON.stringify(card)))
        }
        return cardList
    }
    convertTagList(input: any[]): number[] {
        let tags = []
        for(let tag of input){
            tags.push(Number(tag))
        }
        return tags
    }
    convertSummaryType(input: string): SummaryType {
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
    convertCardType(input: string): CardType {
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
    convertPrerequisiteTresholdType(input: string): PrerequisiteTresholdType {
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
    convertPrerequisiteType(input: string): PrerequisiteType {
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

/**
         {
            id: 0,
            cost: 8,
            costMod: -3,
            title: 'Laboratories',
            tagsId: [2],
            cardSummaryType: "production",
            cardType: "greenProject",
            descriptionEffect: "During the production phase, draw a card for every 3 $tag-science$ you have, including this.",
            descriptionSummary: "$ressource-card$/3$tag-science$"
        },

            {
                id: 2,
                cost: 27,
                title: 'Processed Metals',
                tagsId: [1, 3],
                cardSummaryType: "greyProduction",
                cardType: "greenProject",
                vpNumber: '1',
                descriptionPlayed: "Draw a card for each $tag-power$ you have, including this.",
                descriptionEffect: "When you play a $tag-space$, you pay 6MC less for it.",
                descriptionSummary: "$ressource-titanium$ $ressource-titanium$"
            },
            {
                id: 3,
                cost: 0,
                title: 'Synthetic Catastrophe',
                tagsId: [9],
                cardType: "redProject",
                descriptionPlayed: "You may return another red card you have in play to your hand."
            },
            {
                id: 4,
                cost: 13,
                title: 'Matter Generator',
                tagsId: [0, 3],
                cardSummaryType: "action",
                cardType: "blueProject",
                descriptionPlayed: "Draw two cards.",
                descriptionEffect: "Discard a card in hand to gain 6MC.",
                descriptionSummary: "$ressource-card$ $other-redarrow$ $ressource-megacreditvoid-6$"
            },
            {
                id: 5,
                cost: 8,
                title: 'Self-Replicating Bacteria',
                tagsId: [8],
                cardSummaryType: "action",
                cardType: "blueProject",
                descriptionEffect: "Add a microbe to this card, or remove 5 microbes from this card to play a card from your hand. You pay 25 MC less for it.",
                descriptionSummary: "$other-redarrow$ $ressource-microbe$ $skipline$ -5$ressource-microbe$ $other-redarrow$$ressource-card$ $ressource-megacreditvoid-25$"
            }
 */