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
				if(playedCardList.includes(123)){
					scalingProductions += this.getCardScalingProduction(123, tagState)
				}
				//Satellites
				if(playedCardList.includes(181)){
					scalingProductions += this.getCardScalingProduction(181, tagState)
				}
				break
			}
			case('heat'):{
				//Satellite Farms
				if(playedCardList.includes(180)){
					scalingProductions += this.getCardScalingProduction(180, tagState)
				}
				break
			}
			case('card'):{
				//Laboratories
				if(playedCardList.includes(213)){
					scalingProductions += this.getCardScalingProduction(213, tagState)
				}
			}
		}
		return scalingProductions
	}
	getCardScalingProduction(cardId:number, tagState:TagState[]):number{
		let scalingProduction: number = 0
		switch(cardId){
			//Cartel
			case(123):{
				scalingProduction = this.getPlayedTagNumber('earth', tagState)
				break
			}
			//Satellite Farms
			case(180):{
				scalingProduction = this.getPlayedTagNumber('space', tagState)
				break
			}
			//Satellites
			case(181):{
				scalingProduction = this.getPlayedTagNumber('space', tagState)
				break
			}
			//Laboratories
			case(213):{
				scalingProduction = Math.floor(this.getPlayedTagNumber('science', tagState) / 3)
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
