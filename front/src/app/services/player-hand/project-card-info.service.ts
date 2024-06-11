import { Injectable } from "@angular/core";
import { ProjectCardModel } from "../../models/player-hand/project-card.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardInfoService {
    projectCardInfo: ProjectCardModel[] = [
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
            id: 1,
            cost: 9,
            title: 'Filter Feeders',
            tagsId: [7],
            cardSummaryType: "trigger",
            cardType: "blueProject",
            vpNumber: '*',
            prerequisiteTresholdType: "min",
            prerequisiteType: "ocean",
            prerequisiteTresholdValue: 2,
            descriptionPrerequisite: "Requires 2 ocean tiles to be flipped.",
            descriptionPrerequisiteSummary: "2$other-ocean$",
            descriptionVp: "*=1VP per 3 animals on this card.",
            descriptionEffect: "When you add any number of microbes to ANOTHER* card, add an animal to this card.",
            descriptionSummary: "$ressource-microbe$*/$ressource-animal"
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
    ]
    dummyGetCardList(): ProjectCardModel[] {
        return this.projectCardInfo;
    }
}