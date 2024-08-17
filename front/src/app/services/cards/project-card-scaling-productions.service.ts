import { Injectable } from "@angular/core";
import { RessourceType } from "../../types/global.type";
import { TagState } from "../../interfaces/global.interface";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardScalingProductionsService {
	getScalingProduction(ressource: RessourceType, playedCardList: number[], playedTagList:TagState[]): any{
		let scalingProductions = 0
		switch(ressource){
			case('megacredit'):{
				//Cartel
				//if()
			}
		}
		return scalingProductions
	}
	getCardScalingProduction(cardId:number, playedTagList:TagState[]):number{
		let scalingProduction: number = 0


		return 0
	}
}
