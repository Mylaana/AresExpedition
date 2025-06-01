import { Injectable } from "@angular/core";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { RessourceStock } from "../../interfaces/global.interface";
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
}
