import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { MinMaxEqualTreshold, RessourceStock } from "../../interfaces/global.interface";
import { MinMaxEqualType, RessourceType, TagType } from "../../types/global.type";
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
				return this.isTagNumberOk('science', 5, 'min', clientState)
			}
			//Physics Complex
			case('46'):{
				return this.isTagNumberOk('science', 4, 'min', clientState)
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
				return this.isOceanOk(5, 'min', clientState)
			}
			//Archaebacteria
			case('108'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.purple, 'max', clientState)
			}
			//Beam from a Thorium Asteroid
			case('116'):{
				return this.isTagNumberOk('jovian', 1, 'min', clientState)
			}
			//Biomass Combustors
			case('117'):{
				return this.isRessourcesNumberOk('plant', 2, 'min', clientState)
			}
			//Building Industries
			case('120'):{
				return this.isRessourcesNumberOk('heat', 4, 'min', clientState)
			}
			//Bushes
			case('121'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Designed Microorganisms
			case('127'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'max', clientState)
			}
			//Dust Quarry
			case('129'):{
				return this.isOceanOk(3, 'max', clientState)
			}
			//Energy Storage
			case('131'):{
				return this.isTrOk(7, 'min', clientState)
			}
			//Eos Chasma National Park
			case('132'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Farming
			case('133'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.white, 'min', clientState)
			}
			//Food factory
			case('134'):{
				return this.isRessourcesNumberOk('plant', 2, 'min', clientState)
			}
			//Fuel factory
			case('135'):{
				return this.isRessourcesNumberOk('heat', 3, 'min', clientState)
			}
			//Fuel Generators
			case('136'):{
				return this.isTrOk(1, 'min', clientState)
			}
			//Fusion Power
			case('137'):{
				return this.isTagNumberOk('power', 2, 'min', clientState)
			}
			//Gene Repair
			case('139'):{
				return this.isTagNumberOk('science', 3, 'min', clientState)
			}
			//Grass
			case('142'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.temperature, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Great Dam
			case('143'):{
				return this.isOceanOk(2, 'min', clientState)
			}
			//Kelp Farming
			case('154'):{
				return this.isOceanOk(6, 'min', clientState)
			}
			//Low-Atmo Shields
			case('157'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			//Lunar Beam
			case('158'):{
				return this.isTrOk(1, 'min', clientState)
			}
			//Mass Converter
			case('159'):{
				return this.isTagNumberOk('science', 4, 'min', clientState)
			}
			//Methane from Titan
			case('161'):{
				return this.isGlobalParameterOk(GlobalParameterNameEnum.oxygen, GlobalParameterColorEnum.red, 'min', clientState)
			}
			default:{
				return true
			}
		}
	}
	private static isRessourcesNumberOk(ressource: RessourceType, quantity: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
		let check = clientState.getRessourceInfoFromType(ressource)
		if(!check){return false}
		return Utils.getValueVsTreshold({treshold:treshold, tresholdValue:2, value:check.valueStock})
	}
	private static isTagNumberOk(tagType: TagType, requiredTagNumber: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
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
		return authorizedColor.includes(currentColor)
	}
	private static isOceanOk(oceanFlippedNumber: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
		let currentOcean = clientState.getOceanFlippedNumberAtPhaseBeginning()
		return Utils.getValueVsTreshold({treshold:treshold, tresholdValue:oceanFlippedNumber, value:currentOcean})
	}
	private static isTrOk(tr: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
		return Utils.getValueVsTreshold({treshold:treshold, tresholdValue:tr, value: clientState.getTR()})
	}
}
