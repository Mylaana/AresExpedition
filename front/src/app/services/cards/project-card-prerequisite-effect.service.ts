import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { MinMaxEqualTreshold, RessourceStock } from "../../interfaces/global.interface";
import { MinMaxEqualType, TagType } from "../../types/global.type";
import { Utils } from "../../utils/utils";
import { GlobalParameterColorEnum, GlobalParameterNameEnum } from "../../enum/global.enum";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardPrerequisiteEffectService {
	constructor(){}
	static isPrerequisiteOk(card: PlayableCardModel, clientState: PlayerStateModel): boolean {
		switch(card.cardCode){
			//AI Central
			case('4'):{
				return this.isTagNumberOk('science', 5, clientState, 'min')
			}
			//Physics Complex
			case('46'):{
				return this.isTagNumberOk('science', 4, clientState, 'min')
			}
			//Aerated Magma
			case('105'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Airborne Radiation
			case('106'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Algae
			case('107'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Archaebacteria
			case('108'):{
				console.log('archaebacteria')
				return this.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.purple, 'max', clientState)
			}
			default:{
				return true
			}
		}
	}
	private static isRessourcesNumberOk(ressource: RessourceStock, clientState: PlayerStateModel, treshold: MinMaxEqualTreshold): boolean {
		return false
	}
	private static isTagNumberOk(tagType: TagType, requiredTagNumber: number, clientState: PlayerStateModel, treshold: MinMaxEqualType): boolean {
		let tags = clientState.getTags()
		for(let tag of tags){
			if(tag.name!=tagType){continue}
			return Utils.getValueVsTreshold({treshold: treshold, tresholdValue: requiredTagNumber, value: tag.valueCount})
		}
		return false
	}
	private static isGlobalParameterOk(parameter: GlobalParameterNameEnum, color: GlobalParameterColorEnum, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
		const colorList: GlobalParameterColorEnum[] = [GlobalParameterColorEnum.purple, GlobalParameterColorEnum.red, GlobalParameterColorEnum.yellow, GlobalParameterColorEnum.white]
		let currentColor = clientState.getGlobalParameterColorAtPhaseBeginning(parameter)
		if(treshold==="equal"){
			return color===currentColor
		}
		let authorizedColor: GlobalParameterColorEnum[] = []
		let addToList: boolean
		switch(treshold){
			case('min'):{
				//starts false then goes true
				addToList = false
				break
			}
			case('max'):{
				//starts true then goes false
				addToList = true
				break
			}
		}
		for(let c of colorList){
			if(color===c&&treshold==='min'){addToList=addToList===false}
			if(addToList){
				authorizedColor.push(c)
			}
			if(color===c&&treshold==='max'){addToList=addToList===false}
		}
		console.log(authorizedColor)
		return authorizedColor.includes(currentColor)
	}
	private static isOceanOk(oceanFlippedNumber: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
		let currentOcean = clientState.getOceanFlippedNumberAtPhaseBeginning()
		return Utils.getValueVsTreshold({treshold:treshold, tresholdValue:oceanFlippedNumber, value:currentOcean})
	}
}
