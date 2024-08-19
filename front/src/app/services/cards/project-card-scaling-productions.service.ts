import { Injectable } from "@angular/core";
import { RessourceType } from "../../types/global.type";
import { TagState } from "../../interfaces/global.interface";
import { TagType } from "../../types/global.type";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardScalingProductionsService {
	getScalingProduction(ressource: RessourceType, playedCardList: number[], tagState:TagState[]): number{
		let scalingProductions = 0
		switch(ressource){
			case('megacredit'):{
				//Cartel
				if(123 in playedCardList){
					scalingProductions += this.getCardScalingProduction(123, tagState)
				}
			}
		}
		return scalingProductions
	}
	getCardScalingProduction(cardId:number, tagState:TagState[]):number{
		let scalingProduction: number = 0
		switch(cardId){
			case(123):{
				scalingProduction = this.getPlayedTagNumber('earth', tagState)
				break
			}
		}

		return scalingProduction
	}
	getPlayedTagNumber(tagType: TagType, tagState:TagState[]):number{
		let tagNumber: number = 0
		for(let tags of tagState){
			if(tags.name===tagType){
				tagNumber = tags.valueCount
				break
			}
		}
		return tagNumber
	}
}
