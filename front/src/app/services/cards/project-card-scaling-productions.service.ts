import { Injectable } from "@angular/core";
import { RessourceType } from "../../types/global.type";
import { TagInfo } from "../../interfaces/global.interface";
import { TagType } from "../../types/global.type";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardScalingProductionsService {
	public static getScalingProduction(ressource: RessourceType, playedCardList: number[], tagState:TagInfo[]): number{
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
				//Lightning Harvest
				if(playedCardList.includes(156)){
					scalingProductions += this.getCardScalingProduction(156, tagState)
				}
				//Medical lab
				if(playedCardList.includes(160)){
					scalingProductions += this.getCardScalingProduction(160, tagState)
				}
				break
			}
			case('heat'):{
				//Atospheric Insulators
				if(playedCardList.includes(113)){
					scalingProductions += this.getCardScalingProduction(113, tagState)
				}
				//Satellite Farms
				if(playedCardList.includes(180)){
					scalingProductions += this.getCardScalingProduction(180, tagState)
				}
				break
			}
			case('plant'):{
				//Insects
				if(playedCardList.includes(152)){
					scalingProductions += this.getCardScalingProduction(152, tagState)
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
	public static getCardScalingProduction(cardId:number, tagState:TagInfo[]):number{
		let scalingProduction: number = 0
		switch(cardId){
			//Cartel
			case(113):{
				scalingProduction = this.getPlayedTagNumber('earth', tagState)
				break
			}
			//Cartel
			case(123):{
				scalingProduction = this.getPlayedTagNumber('earth', tagState)
				break
			}
			//Insects
			case(152):{
				scalingProduction = this.getPlayedTagNumber('plant', tagState)
				break
			}
			//Lightning Harvest
			case(156):{
				scalingProduction = this.getPlayedTagNumber('science', tagState)
				break
			}
			//Medical Lab
			case(160):{
				scalingProduction = this.getPlayedTagNumber('building', tagState)
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
	public static getPlayedTagNumber(tagType: TagType, tagState:TagInfo[]):number{
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
