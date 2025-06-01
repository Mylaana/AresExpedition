import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { ProjectFilter, RessourceStock } from "../../interfaces/global.interface";
import { AdvancedRessourceStock } from "../../interfaces/global.interface";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { GlobalParameterNameEnum } from "../../enum/global.enum";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { ActivationOption } from "../../types/project-card.type";
import { EventFactory } from "../../factory/event factory/event-factory";


@Injectable({
    providedIn: 'root'
})
export class ProjectCardActivatedEffectService {
	constructor(){}
	/**
	 *
	 * @param card
	 * @returns Event List

	* Events should be filled to the list according to their order of execution.
	 */
	static getActivateCardEvent(card: PlayableCardModel, clientState: PlayerStateModel, activationOption:  ActivationOption): EventBaseModel[] | undefined{
		let result: EventBaseModel[] = []
		switch(card.cardCode){
			//AI Central
			case('4'):{
				result.push(EventFactory.simple.draw(2))
				break
			}
			//Artificial Jungle
			case('9'):{
				result.push(EventFactory.simple.addRessource({name: "plant", valueStock: -1}))
				result.push(EventFactory.simple.draw(1))
				break
			}
			//Birds
			case('12'):{
				result.push(EventFactory.simple.addRessourceToCardId({name: "animal", valueStock: 1}, card.cardCode))
				break
			}
			//Caretaker Contract
			case('14'):{
				result.push(EventFactory.simple.addRessource({name: "heat", valueStock: -8}))
				result.push(EventFactory.simple.addTR(1))
				break
			}
			//Circuit Board Factory
			case('15'):{
				result.push(EventFactory.simple.draw(1))
				break
			}
			//Circuit Board Factory
			case('16'):{
				let ressources: RessourceStock[] = [{name:'megacredit', valueStock:2}]
				if(clientState.getPhaseSelected()===SelectablePhaseEnum.action){
					ressources.push({name:'plant', valueStock:1})
				}
				result.push(EventFactory.simple.addRessource(ressources))
				break
			}
			//Conserved Biomes
			case('18'):{
				switch(activationOption){
					case(1):{
						result.push(EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:1}))
						break
					}
					case(2):{
						result.push(EventFactory.simple.addRessourceToSelectedCard({name:'animal', valueStock:1}))
						break
					}
				}
				break
			}
			//Decomposing Fungus
			case('20'):{
				//add new event type removing any ressource on card
				result.push(EventFactory.simple.addRessource({name: "plant", valueStock: 3}))
				break
			}
			//Development Center
			case('22'):{
				result.push(EventFactory.simple.addRessource({name: "heat", valueStock: -2}))
				result.push(EventFactory.simple.draw(1))
				break
			}
			//Conserved Biomes
			case('27'):{
				switch(activationOption){
					case(1):{
						result.push(EventFactory.simple.addRessource({name:'plant', valueStock:1}))
						break
					}
					case(2):{
						result.push(EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:1}))
						break
					}
				}
				break
			}
			//Farmers Market
			case('28'):{
				result.push(EventFactory.simple.addRessource([
					{name: "megacredit", valueStock: -1},
					{name: "plant", valueStock: 2}
				]))
				break
			}
			//Farming Co-ops
			case('29'):{
				result.push(EventFactory.simple.discard(1))
				result.push(EventFactory.simple.addRessource({name: "plant", valueStock: 3}))
				break
			}
			//GHG Producing Bacteria
			case('31'):{
				switch(activationOption){
					case(1):{
						result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:1},card.cardCode))
						break
					}
					case(2):{
						result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:-2},card.cardCode))
						result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.temperature, 1))
						break
					}
				}
				break
			}
			//Hydro-Electric Energy
			case('34'):{
				let value = 2
				if(clientState.getPhaseSelected()===SelectablePhaseEnum.action){
					value++
				}
				result.push(EventFactory.simple.addRessource([
					{name:'megacredit', valueStock:-1},
					{name:'heat', valueStock:value}
				]))
				break
			}
			//Ironworks
			case('38'):{
				result.push(EventFactory.simple.addRessource({name: "heat", valueStock: -4}))
				result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1))
				break
			}
			//Matter Manufacturing
			case('41'):{
				result.push(EventFactory.simple.addRessource({name: "megacredit", valueStock: -1}))
				result.push(EventFactory.simple.draw(1))
				break
			}
			//Nitrite Reducing Bacteria
			case('43'):{
				switch(activationOption){
					case(1):{
						result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:1},card.cardCode))
						break
					}
					case(2):{
						result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:-3},card.cardCode))
						result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.ocean, 1))
						break
					}
				}
				break
			}
			//Regolith Eaters
			case('50'):{
				switch(activationOption){
					case(1):{
						result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:1},card.cardCode))
						break
					}
					case(2):{
						result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:-2},card.cardCode))
						result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1))
						break
					}
				}
				break
			}
			//Steelworks
			case('56'):{
				result.push(EventFactory.simple.addRessource([
					{name: "heat", valueStock: -6},
					{name: "megacredit", valueStock: 2}
				]))
				result.push(EventFactory.simple.increaseGlobalParameter(GlobalParameterNameEnum.oxygen, 1))
				break
			}
			//Symbiotic Fungus
			case('57'):{
				result.push(EventFactory.simple.addRessourceToSelectedCard({name:'microbe', valueStock:1}))
				break
			}
			//Tardigrades
			case('58'):{
				result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:1}, card.cardCode))
				break
			}
			//Think Tank
			case('59'):{
				result.push(EventFactory.simple.draw(1))
				break
			}
			//Matter Generator
			case('P06'):{
				result.push(EventFactory.simple.discard(1))
				result.push(EventFactory.simple.addRessource({name:'megacredit', valueStock:6}))
				break
			}
			default:{
				return undefined
			}
		}
		return result
	}

	static isActivationCostPayable(card: PlayableCardModel, clientState: PlayerStateModel, activationOption:  ActivationOption = 1): boolean {
		switch(card.cardCode){
			//AI Central
			case('4'):{break}
			//Artificial Jungle
			case('9'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'plant', valueStock: 1})){return false}
				break
			}
			//Birds
			case('12'):{break}
			//Caretaker Contract
			case('14'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'heat', valueStock: 8})){return false}
				break
			}
			//Circuit Board Factory
			case('15'):{break}
			//Community Gardens
			case('16'):{break}
			//Conserved Biomes
			case('18'):{break}
			//Decomposing Fungus
			case('20'):{
				return false
				if(!this.checkCardsWithRessourcesStock(clientState, [{name:'animal', valueStock:1}, {name:'microbe', valueStock:1}], 'any')){return false}
				break
			}
			//Development Center
			case('22'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'heat', valueStock: 2})){return false}
				break
			}
			//Extreme-Cold Fungus
			case('27'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						if(clientState.hasProjectPlayedOfFilterType({type:'stockable', stockableType:'microbe'})){return true}
					}
				}
				break
			}
			//Farmers Market
			case('28'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'megacredit', valueStock: 1})){return false}
				break
			}
			//Farming Co-ops
			case('29'):{
				if(!this.checkPlayerHasCardsInHand(clientState, 1)){return false}
				break
			}
			//GHG Producing Bacteria
			case('31'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						for(let s of clientState.getProjectPlayedStock(card.cardCode)){
							if(s.name==='microbe'){
								return s.valueStock>=2
							}
						}
						return false
					}
				}
			}
			//Hydro-Electric Energy
			case('34'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'megacredit', valueStock: 1})){return false}
				break
			}
			//Ironworks
			case('38'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'heat', valueStock: 4})){return false}
				break
			}
			//Matter Manufacturing
			case('41'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'megacredit', valueStock: 1})){return false}
				break
			}
			//Nitrite Reducing Bacteria
			case('43'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						for(let s of clientState.getProjectPlayedStock(card.cardCode)){
							if(s.name==='microbe'){
								return s.valueStock>=3
							}
						}
						return false
					}
				}
			}
			//Regolith Eaters
			case('50'):{
				switch(activationOption){
					case(1):{return true}
					case(2):{
						for(let s of clientState.getProjectPlayedStock(card.cardCode)){
							if(s.name==='microbe'){
								return s.valueStock>=2
							}
						}
						return false
					}
				}
			}
			//Steelworks
			case('56'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'heat', valueStock: 6})){return false}
				break
			}
			//Symbiotic Fungus
			case('57'):{break}
			//Tardigrades
			case('58'):{break}
			//Steelworks
			case('59'):{
				if(!this.checkPlayerHasBaseRessourceStock(clientState, {name: 'megacredit', valueStock: 2})){return false}
				break
			}
			//Matter Generator
			case('P06'):{
				if(!this.checkPlayerHasCardsInHand(clientState, 1)){return false}
				break
			}
			default:{
				return false
			}
		}
		return true
	}
	public static getActivationOption(card: PlayableCardModel): ActivationOption[]{
		const doubleActivationCards: string[] = [
			'18', //Conserved Biome
			'27', //Extreme-Cold Fungus
			'31', //GHG Producing Bacteria
			'43', //Nitrite Reducing Bacteria
			'50', //Regolith Eaters
		]
		if(doubleActivationCards.includes(card.cardCode)){return [1,2]}
		return [1]
	}
	public static getActivationCaption(card: PlayableCardModel, option: ActivationOption): string | undefined {
		switch(card.cardCode){
			//Conserved Biome
			case('18'):{
				switch(option){
					case(1):{return '$ressource_microbe$*'}
					case(2):{return '$ressource_animal$*'}
				}
			}
			//Extreme-Cold Fungus
			case('27'):{
				switch(option){
					case(1):{return '$ressource_plant$'}
					case(2):{return '$ressource_microbe$*'}
				}
			}
			//GHG Producing Bacteria
			case('31'):{
				switch(option){
					case(1):{return '$ressource_microbe$'}
					case(2):{return '-2$ressource_microbe$:$other_temperature$'}
				}
			}
			//Nitrite Reducing Bacteria
			case('43'):{
				switch(option){
					case(1):{return '$ressource_microbe$'}
					case(2):{return '-3$ressource_microbe$:$other_ocean$'}
				}
			}
			//Regolith Eaters
			case('50'):{
				switch(option){
					case(1):{return '$ressource_microbe$'}
					case(2):{return '-2$ressource_microbe$:$other_oxygen$'}
				}
			}
			default:{
				return
			}
		}
		return
	}
	private static checkPlayerHasBaseRessourceStock(state: PlayerStateModel, ressource: RessourceStock): boolean {
		return (state.getRessourceInfoFromType(ressource.name)?.valueStock??0) >= ressource.valueStock
	}
	private static checkCardsWithRessourcesStock(state: PlayerStateModel, ressource: AdvancedRessourceStock | AdvancedRessourceStock[], anyOrAll: 'any' | 'all'): boolean {
		let ressources: AdvancedRessourceStock[] = []
		let hasStock : number = 0
		if(Array.isArray(ressource)){
			ressources = ressource
		} else {
			ressources = [ressource]
		}

		for(let r of ressources){
			let filter: ProjectFilter = {type: 'stockable', stockableType: r.name}
			hasStock += Math.min(state.getProjectPlayedModelList(filter).length, 1)
		}

		switch(anyOrAll){
			case('all'):{return hasStock === ressources.length}
			case('any'):{return hasStock >= 1}
		}
	}
	private static checkPlayerHasCardsInHand(state: PlayerStateModel, cardsInHandNumber: number): boolean {
		return state.getHandCurrentSize()>=1
	}
}
