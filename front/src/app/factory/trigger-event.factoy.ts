import { DiscardOptionsEnum, EffectPortalEnum, GlobalParameterNameEnum } from "../enum/global.enum";
import { EventFactory } from "./event/event-factory";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { AdvancedRessourceType, RessourceType, TagType } from "../types/global.type";
import { GlobalInfo } from "../services/global/global-info.service";
import { MoonTile, RessourceStock } from "../interfaces/global.interface";
import { Utils } from "../utils/utils";
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../enum/phase.enum";
import { Checker } from "../utils/checker";

export type HookType =  'ON_TAG_GAINED' | 'ON_PRODUCTION_INCREASED' | 'ON_CARD_PLAYED' | 'ON_PARAMETER_INCREASED'
| 'ON_RESSOURCE_ADDED_TO_CARD' | 'ON_CARD_ACTIVATED' | 'ON_FOREST_GAINED' | 'ON_TRIGGER_RESOLUTION' | 'ON_UPGRADED_PHASE_SELECTED'
| 'ON_MILESTONE_CLAIMED' | 'ON_PHASE_ACTIVATED' | 'ON_MOON_TILE_GAINED'
interface TriggerInput {
	playedCard: PlayableCardModel,
	increasedParameter: GlobalParameterNameEnum
	increasedParameterValue: number,
	isParameterMaxedOutAtBeginningOfPhase: boolean
	tagList: number[]
	ressourceAdded: AdvancedRessourceType
	ressourceAddedValue: number
	receivingCard: PlayableCardModel,
	forestGained: number,
	discardedCard: PlayableCardModel,
	productionIncreased: RessourceStock,
	activatedPhase: NonSelectablePhaseEnum
	clientSelectedPhase: SelectablePhaseEnum
	moonTiles: MoonTile[]
}
const S = EventFactory.simple

// Handlers
//ON_PLAYED_CARD
	//Antigravity Technology
	function handleTrigger_6(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [S.addRessource([{name: 'plant', valueStock: 2},{name: 'heat', valueStock: 2}])]
	}
	//Main-ni production
	function handleTrigger_P16(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.cardType!='greenProject'){return []}
		return [
			S.draw(1),
			S.discard(1)
		]
	}
	//Advertising
	function handleTrigger_FM23(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.costInitial<20){return []}
		return [
			S.addProduction({name:'megacredit', valueStock:1}),
		]
	}
	//Spinoff Department
	function handleTrigger_FM24(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.costInitial<20){return []}
		return [
			S.draw(1),
		]
	}
	//CLM
	function handleTrigger_CF3_ON_PLAYED_CARD(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [S.addRessourceToCardId({name:'science', valueStock:2}, trigger)]
	}

//ON_PARAMETER_INCREASED
	//Arctic Alagae
	function handleTrigger_8(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.ocean){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.addRessource({name:'plant', valueStock:4})]
	}
	//Fish
	function handleTrigger_30(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.ocean){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Herbivores
	function handleTrigger_33(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter===GlobalParameterNameEnum.infrastructure){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return []}
		return [S.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Livestock
	function handleTrigger_39(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.temperature){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Physics Complex
	function handleTrigger_46(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.temperature){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.addRessourceToCardId({name:"science", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Volcanic Soil
	function handleTrigger_D13(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.temperature){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.addRessource({name:'plant', valueStock:2})]
	}
	//Cargo Ships
	function handleTrigger_F04(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.infrastructure){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		let events: EventBaseModel[] = []
		for(let i=0; i<input.increasedParameterValue; i++){
			events.push(S.effectPortal(EffectPortalEnum.cargoShips))
		}
		return events
	}
	//Pets
	function handleTrigger_F07(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.infrastructure){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Zetasel
	function handleTrigger_P17(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.ocean){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.addRessource([{name:'megacredit', valueStock:2},{name:'plant', valueStock:2}])]
	}

//ON_TAG_GAINED
	//Anaerobic Mircroorganisms
	function handleTrigger_5(trigger: string, input: TriggerInput, clientState?: PlayerStateModel): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, ['plant', 'animal', 'microbe'])
		if(quantity===0){return []}
		return [S.addRessourceToCardId({name:'microbe', valueStock:quantity}, trigger)]
	}
	//Decomposers
	function handleTrigger_19(trigger: string, input: TriggerInput, clientState?: PlayerStateModel): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, ['plant', 'animal', 'microbe'])
		if(quantity===0){return []}

		let result: EventBaseModel[] = []
		let card = clientState?.getProjectPlayedModelFromId('19')
		if(!card){return []}

		for(let i=0; i<quantity; i++){
			if(card.getStockValue('microbe')<=0 && i===0){
				result.push(S.addRessourceToCardId({name:'microbe', valueStock:1}, trigger))
			} else{
				result.push(S.effectPortal(EffectPortalEnum.decomposers))
			}
		}
		return result
	}
	//Ecological Zone
	function handleTrigger_24(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, ['plant', 'animal', 'microbe'])
		if(quantity===0){return []}

		let result: EventBaseModel[] = []
		for(let i=0; i<quantity; i++){
			result.push(S.addRessourceToCardId({name:'animal', valueStock:1}, trigger))
		}
		return result
	}
	//Energy Subsidies
	function handleTrigger_25(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'power')
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}
	//Interplanetary Conference
	function handleTrigger_37(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.cardCode===trigger){return []} //Excluding self
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, ['earth', 'jovian'])
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}
	//Mars University
	function handleTrigger_40(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'science')
		if(quantity===0){return []}
		let events: EventBaseModel[] = []
		for(let i=0; i<quantity; i++){
			events.push(S.discardOptions(1, 'max', DiscardOptionsEnum.marsUniversity))
		}
		return events
	}
	//Olympus Conference
	function handleTrigger_44(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'science')
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}
	//Optimal Aerobraking
	function handleTrigger_45(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(Utils.toTagId('event'))===false){return []}
		return [S.addRessource([{name: 'plant', valueStock: 2},{name: 'heat', valueStock: 2}])]
	}
	//Recycled Detritus
	function handleTrigger_48(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(Utils.toTagId('event'))===false){return []}
		return [S.draw(2)]
	}
	//Viral Enhancers
	function handleTrigger_61(trigger: string, input: TriggerInput, clientState?: PlayerStateModel): EventBaseModel[] {
		if(!clientState){return []}
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, ['animal', 'plant', 'microbe'])
		if(quantity===0){return []}
		let result: EventBaseModel[] = []

		if(clientState.getPlayedListWithStockableTypes(['animal', 'microbe']).length===0){
			result.push(S.addRessource({name:'plant', valueStock:quantity}))
		} else {
			for(let i=0; i<quantity; i++){
				result.push(S.effectPortal(EffectPortalEnum.viralEnhancer))
			}
		}

		return result
	}
	//Apollo Industriees
	function handleTrigger_D01(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'science')
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}
	//Sultira
	function handleTrigger_D04(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'power')
		if(quantity===0){return []}
		return [S.addRessource({name:'heat', valueStock:quantity*2})]
	}
	//Impact Analysis
	function handleTrigger_D08(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(Utils.toTagId('event'))===false){return []}
		return [S.draw(1)]
	}
	//Bacterial Aggregate
	function handleTrigger_P19_OnTagGained(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'earth')
		if(quantity===0){return []}
		return [S.addRessourceToCardId({name:'microbe', valueStock: quantity}, trigger)]
	}
	//Saturn Systems
	function handleTrigger_216(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.cardCode===trigger){return []} //Excluding self
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'jovian')
		if(quantity===0){return []}
		return [S.addTR(quantity)]
	}
	//Arklight
	function handleTrigger_P12(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, ['plant', 'animal'])
		if(quantity===0){return []}
		return [S.addRessourceToCardId({name:'animal', valueStock:quantity}, trigger)]
	}
	//Point Luna
	function handleTrigger_CF1(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'earth')
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}
	//Recyclon
	function handleTrigger_CF7(trigger: string, input: TriggerInput, clientState?: PlayerStateModel): EventBaseModel[] {
		if(input.tagList.includes(Utils.toTagId('building'))===false){return []}
		let triggerred: number = 0
		let result: EventBaseModel[] = []
		let card = clientState?.getProjectPlayedModelFromId(trigger)
		if(!card){return []}
		let stock = card.getStockValue('microbe')
		triggerred += input.tagList.filter((el) => el===Utils.toTagId('building')).length
		for(let i=0; i<triggerred; i++){
			if(stock<=0){
				result.push(S.addRessourceToCardId({name:'microbe', valueStock:1}, trigger))
				stock +=1
			} else{
				result.push(S.addRessourceToCardId({name:'microbe', valueStock:-1}, trigger))
				result.push(S.addProduction({name:'plant', valueStock:1}))
				stock -= 1
			}
		}
		return result
	}
	//Solar Logistics
	function handleTrigger_FM2(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(Utils.toTagId('event'))===false || input.tagList.includes(Utils.toTagId('space'))===false){return []}
		return [S.draw(2)]
	}
	//Meat Industry
	function handleTrigger_FM4(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, ['plant', 'animal'])
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}
	//Space Relay
	function handleTrigger_FM14(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'jovian')
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}
	//Earth Embassy
	function handleTrigger_M121(trigger: string, input: TriggerInput): EventBaseModel[] {
		let quantity = Utils.countTagsOfTypeInIdList(input.tagList, 'moon')
		if(quantity===0){return []}
		return [S.draw(quantity)]
	}

//ON_RESSOURCE_ADDED_TO_CARD
	//Filter Feeders
	function handleTrigger_P04(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.ressourceAdded!='microbe'){return []}
		return [S.addRessourceToCardId({name:"animal", valueStock:1}, trigger)]
	}
	//Bacterial Aggregate
	function handleTrigger_P19_OnRessourceAdded(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.receivingCard.cardCode!=trigger){return []}
		if(input.ressourceAdded!='microbe'|| input.ressourceAddedValue<1){return []}

		let stock = input.receivingCard.getStockValue('microbe')
		let stockBefore = stock - input.ressourceAddedValue
		let result: EventBaseModel[] = []
		if(stock>=5){
			result.push(S.deactivateTrigger(trigger))
		}

		let limit = 5

		let addValue = Math.min(input.ressourceAddedValue, limit - stockBefore)
		if(addValue<=0){return[]}

		result.push(S.increaseResearchScanKeep({keep:0, scan:addValue}))
		return result
	}
	//Topsoil contract
	function handleTrigger_FM3(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.ressourceAdded!='microbe'){return []}
		return [S.addRessource({name:"megacredit", valueStock:input.ressourceAddedValue*2})]
	}


//ON_CARD_ACTIVATED
	//Assembly Lines
	function handleTrigger_10(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [S.addRessource({name:"megacredit", valueStock:1})]
	}
	//Hyperion systems v2
	function handleTrigger_D03B(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [S.addRessource({name:"megacredit", valueStock:1})]
	}

//ON_FOREST_GAINED
	//Small Animals
	function handleTrigger_53(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [S.addRessourceToCardId({name:"animal", valueStock:input.forestGained}, trigger)]
	}

//ON_TRIGGER_RESOLUTION
	//Mars University
	function handleTrigger_40_resolution(trigger: string, input: TriggerInput): EventBaseModel[] {
		let card: PlayableCardModel = input.discardedCard
		let draw = 1
		if(card.hasTag('plant') || card.hasTag('science')){draw ++}
		return [S.draw(draw)]
	}

//ON_UPGRADED_PHASE_SELECTED
	//Communication Streamlining
	function handleTrigger_D05(trigger: string, input: TriggerInput):EventBaseModel[]{
		return [S.addRessource({name:'megacredit', valueStock:1})]
	}

//ON_PRODUCTION_INCREASED
	//Mining Guild
	function handleTrigger_214(trigger: string, input: TriggerInput):EventBaseModel[]{
		if(input.productionIncreased.name!='steel' || input.productionIncreased.valueStock<=0){return []}
		return [S.addTR(input.productionIncreased.valueStock)]
	}
	//Nebu Labs
	function handleTrigger_P31(trigger: string, input: TriggerInput):EventBaseModel[]{
		return [S.addRessource({name:'megacredit', valueStock:2})]
	}

//ON_MILESTONE_CLAIMED
	//Zoo
	function handleTrigger_P25(trigger: string, input: TriggerInput):EventBaseModel[]{
		return [S.addRessourceToCardId({name:'animal', valueStock:1}, trigger)]
	}
//ON_PHASE_ACTIVATED
	//Pu$hnik
	function handleTrigger_CF2(trigger: string, input: TriggerInput, clientState?: PlayerStateModel): EventBaseModel[] {
		if(input.activatedPhase.toString()===input.clientSelectedPhase.toString()){return []}
		switch(input.activatedPhase){
			case(NonSelectablePhaseEnum.development):case(NonSelectablePhaseEnum.construction):{
				return [EventFactory.simple.addRessource({name:'megacredit', valueStock:2})]
			}
			case(NonSelectablePhaseEnum.action):{
				let result = [EventFactory.simple.addRessource([{name:'plant', valueStock:1},{name:'heat', valueStock:1}])]
				if(clientState && Checker.hasCardWithStockType(['animal','microbe','science'], clientState)){
					result.push(EventFactory.simple.effectPortal(EffectPortalEnum.pushnikAction))
				}
				return result
			}
			case(NonSelectablePhaseEnum.production):{
				return [EventFactory.simple.effectPortal(EffectPortalEnum.pushnikProduction, true)]
			}
			case(NonSelectablePhaseEnum.research):{
				return [EventFactory.simple.draw(1)]
			}
		}
		return []
	}

//ON MOON TILE GAIN
	//Luna Mining Federation
	function handleTrigger_MC2(trigger: string, input: TriggerInput, clientstate?: PlayerStateModel): EventBaseModel[]{
		let tile = input.moonTiles.filter(tiles => tiles.name==='mine')
		if(tile.length===0){return []}
		let quantity = tile[0].quantity
		return [
			EventFactory.simple.addTR(quantity),
			EventFactory.simple.addProduction({name: 'titanium', valueStock: quantity})
		]
	}
	//Grand Luna Capital Group
	function handleTrigger_MC4(trigger: string, input: TriggerInput, clientstate?: PlayerStateModel): EventBaseModel[]{
		let tile = input.moonTiles.filter(tiles => tiles.name==='habitat')
		if(tile.length===0){return []}
		let quantity = tile[0].quantity
		return [
			EventFactory.simple.draw(quantity),
		]
	}

// Main Dispatch
const HANDLERS_BY_HOOK: Record<HookType, Record<string, (triggerCode: string, input: TriggerInput, clientState?: PlayerStateModel) => EventBaseModel[]>> = {
	ON_CARD_PLAYED: {
		'6': handleTrigger_6,
		'P16': handleTrigger_P16,
		'FM23': handleTrigger_FM23,
		'FM24': handleTrigger_FM24,
		'CF3': handleTrigger_CF3_ON_PLAYED_CARD
	},
	ON_PARAMETER_INCREASED: {
		'8': handleTrigger_8,
		'30': handleTrigger_30,
		'33': handleTrigger_33,
		'39': handleTrigger_39,
		'46': handleTrigger_46,
		'D13': handleTrigger_D13,
		'F04': handleTrigger_F04,
		'F07': handleTrigger_F07,
		'P17': handleTrigger_P17
	},
	ON_TAG_GAINED: {
		'5': handleTrigger_5,
		'19': handleTrigger_19,
		'24': handleTrigger_24,
		'25': handleTrigger_25,
		'37': handleTrigger_37,
		'40': handleTrigger_40,
		'44': handleTrigger_44,
		'45': handleTrigger_45,
		'48': handleTrigger_48,
		'48B': handleTrigger_48,
		'61': handleTrigger_61,
		'216': handleTrigger_216,
		'D01': handleTrigger_D01,
		'D04': handleTrigger_D04,
		'D08': handleTrigger_D08,
		'P12': handleTrigger_P12,
		'P12B': handleTrigger_P12,
		'P19': handleTrigger_P19_OnTagGained,
		'CF1': handleTrigger_CF1,
		'CF7': handleTrigger_CF7,
		'FM2': handleTrigger_FM2,
		'FM4': handleTrigger_FM4,
		'FM14': handleTrigger_FM14,
		'M121': handleTrigger_M121,
	},
	ON_RESSOURCE_ADDED_TO_CARD: {
		'P04': handleTrigger_P04,
		'P19': handleTrigger_P19_OnRessourceAdded,
		'FM3': handleTrigger_FM3,
	},
	ON_CARD_ACTIVATED: {
		'10': handleTrigger_10,
		'D03B': handleTrigger_D03B
	},
	ON_FOREST_GAINED: {
		'53': handleTrigger_53
	},
	ON_PRODUCTION_INCREASED: {
		'214': handleTrigger_214,
		'214B': handleTrigger_214
	},
	ON_TRIGGER_RESOLUTION: {
		'40': handleTrigger_40_resolution,
	},
	ON_UPGRADED_PHASE_SELECTED: {
		'D05': handleTrigger_D05,
		'P31': handleTrigger_P31,
	},
	ON_MILESTONE_CLAIMED: {
		'P25': handleTrigger_P25,
	},
	ON_PHASE_ACTIVATED: {
		'CF2': handleTrigger_CF2,
	},
	ON_MOON_TILE_GAINED: {
		'MC2': handleTrigger_MC2,
		'MC4': handleTrigger_MC4
	}
};

function toFullTriggerInput(input: Partial<TriggerInput>): TriggerInput {
	return {
		playedCard: input.playedCard??new PlayableCardModel,
		increasedParameter: input.increasedParameter??GlobalParameterNameEnum.temperature,
		increasedParameterValue: input.increasedParameterValue??0,
		tagList: input.tagList??[],
		receivingCard: input.receivingCard??new PlayableCardModel,
		ressourceAdded: input.ressourceAdded??"science",
		ressourceAddedValue: input.ressourceAddedValue??0,
		forestGained: input.forestGained??0,
		discardedCard: input.discardedCard??new PlayableCardModel,
		productionIncreased: input.productionIncreased??{name:'megacredit', valueStock:0},
		isParameterMaxedOutAtBeginningOfPhase: input.isParameterMaxedOutAtBeginningOfPhase??true,
		activatedPhase: input.activatedPhase??NonSelectablePhaseEnum.undefined,
		clientSelectedPhase: input.clientSelectedPhase??SelectablePhaseEnum.undefined,
		moonTiles: input.moonTiles??[]
	}
}
export const TriggerEffectEventFactory = {
	getTriggerred(hook: HookType, activeTriggers: string[], clientState: PlayerStateModel, input: Partial<TriggerInput>): EventBaseModel[] {
		const handlers = HANDLERS_BY_HOOK[hook] ?? {};
		const relevantTriggers = activeTriggers.filter(trigger => trigger in handlers);
		const events: EventBaseModel[] = [];
		const fullInput = toFullTriggerInput(input)

		for (const trig of relevantTriggers) {
			const handler = handlers[trig];
			if (handler) {
				events.push(...handler(trig,  fullInput, clientState));
			}
		}
		return events;
	}
}
