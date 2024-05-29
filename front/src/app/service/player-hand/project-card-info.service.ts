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
        },
        {
            id: 1,
            cost: 9,
            title: 'Filter Feeders',
            tagsId: [7],
            cardSummaryType: "trigger",
            cardType: "blueProject",
            vp: '*',
            conditionTresholdType: "min",
            conditionType: "ocean",
            conditionTresholdValue: 2
        },
        {
            id: 2,
            cost: 27,
            title: 'Processed Metals',
            tagsId: [1, 3],
            cardSummaryType: "greyProduction",
            cardType: "greenProject",
            vp: '1'
        },
        {
            id: 3,
            cost: 0,
            title: 'Synthetic Catastrophe',
            tagsId: [9],
            cardType: "redProject",
        },
        {
            id: 4,
            cost: 13,
            title: 'Matter Generator',
            tagsId: [0, 3],
            cardSummaryType: "action",
            cardType: "blueProject",
        }
    ]
    dummyGetCardList(): ProjectCardModel[] {
        return this.projectCardInfo;
    }
}