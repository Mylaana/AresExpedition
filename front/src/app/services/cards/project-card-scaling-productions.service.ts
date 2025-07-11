import { Injectable } from "@angular/core";
import { RessourceType } from "../../types/global.type";
import { TagInfo } from "../../interfaces/global.interface";
import { TagType } from "../../types/global.type";

@Injectable({
    providedIn: 'root'
})
export class ProjectCardScalingProductionsService {
	public static getScalingProduction(ressource: RessourceType, playedCardList: string[], tagState:TagInfo[]): number{
		let scalingProductions = 0
		switch(ressource){
			case('megacredit'):{
				//Cartel
				if(playedCardList.includes('123')){
					scalingProductions += this.getCardScalingProduction('123', tagState)
				}

				//Lightning Harvest
				if(playedCardList.includes('156')){
					scalingProductions += this.getCardScalingProduction('156', tagState)
				}
				//Medical lab
				if(playedCardList.includes('160')){
					scalingProductions += this.getCardScalingProduction('160', tagState)
				}
				//Miranda Resort
				if(playedCardList.includes('165')){
					scalingProductions += this.getCardScalingProduction('165', tagState)
				}
				//Miranda Resort
				if(playedCardList.includes('174')){
					scalingProductions += this.getCardScalingProduction('174', tagState)
				}
				//Satellites
				if(playedCardList.includes('181')){
					scalingProductions += this.getCardScalingProduction('181', tagState)
				}
				//Venture Capitalism
				if(playedCardList.includes('203')){
					scalingProductions += this.getCardScalingProduction('203', tagState)
				}
				//Diverse Habitats
				if(playedCardList.includes('P03')){
					scalingProductions += this.getCardScalingProduction('P03', tagState)
				}
				break
			}
			case('heat'):{
				//Atospheric Insulators
				if(playedCardList.includes('113')){
					scalingProductions += this.getCardScalingProduction('113', tagState)
				}
				//Satellite Farms
				if(playedCardList.includes('180')){
					scalingProductions += this.getCardScalingProduction('180', tagState)
				}
				//Windmills
				if(playedCardList.includes('206')){
					scalingProductions += this.getCardScalingProduction('206', tagState)
				}
				break
			}
			case('plant'):{
				//Insects
				if(playedCardList.includes('152')){
					scalingProductions += this.getCardScalingProduction('152', tagState)
				}
				//Worms
				if(playedCardList.includes('207')){
					scalingProductions += this.getCardScalingProduction('207', tagState)
				}
				break
			}
			case('card'):{
				//Laboratories
				if(playedCardList.includes('P05')){
					scalingProductions += this.getCardScalingProduction('P05', tagState)
				}
			}
		}
		return scalingProductions
	}
	public static getCardScalingProduction(cardCode:string, tagState:TagInfo[]):number{
		let scalingProduction: number = 0
		switch(cardCode){
			//Atmospheric Insulators
			case('113'):{
				scalingProduction = this.getPlayedTagNumber('earth', tagState)
				break
			}
			//Cartel
			case('123'):{
				scalingProduction = this.getPlayedTagNumber('earth', tagState)
				break
			}
			//Insects
			case('152'):{
				scalingProduction = this.getPlayedTagNumber('plant', tagState)
				break
			}
			//Lightning Harvest
			case('156'):{
				scalingProduction = this.getPlayedTagNumber('science', tagState)
				break
			}
			//Medical Lab
			case('160'):{
				scalingProduction = Math.floor(this.getPlayedTagNumber('building', tagState) / 2)
				break
			}
			//Miranda Resort
			case('165'):{
				scalingProduction = this.getPlayedTagNumber('earth', tagState)
				break
			}
			//Miranda Resort
			case('174'):{
				scalingProduction = this.getPlayedTagNumber('power', tagState)
				break
			}
			//Satellite Farms
			case('180'):{
				scalingProduction = this.getPlayedTagNumber('space', tagState)
				break
			}
			//Satellites
			case('181'):{
				scalingProduction = this.getPlayedTagNumber('space', tagState)
				break
			}
			//Venture Capitalism
			case('203'):{
				scalingProduction = this.getPlayedTagNumber('event', tagState)
				break
			}
			//Laboratories
			case('P05'):{
				scalingProduction = Math.floor(this.getPlayedTagNumber('science', tagState) / 3)
				break
			}
			//Windmills
			case('206'):{
				scalingProduction = this.getPlayedTagNumber('power', tagState)
				break
			}
			//Worms
			case('207'):{
				scalingProduction = this.getPlayedTagNumber('microbe', tagState)
				break
			}
			/*
			//Zeppelins
			case('213'):{
				//scalingProduction = this.getPlayedTagNumber('science', tagState))
				break
			}*/
			//Diverse Habitats
			case('P03'):{
				scalingProduction = this.getPlayedTagNumber('animal', tagState)
				scalingProduction += this.getPlayedTagNumber('plant', tagState)
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
