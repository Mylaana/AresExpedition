import { DiscardOptionsEnum, EffectPortalEnum, GlobalParameterNameEnum } from "../enum/global.enum";
import { EventFactory } from "./event/event-factory";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { EventBaseModel } from "../models/core-game/event.model";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { AdvancedRessourceType } from "../types/global.type";
import { GlobalInfo } from "../services/global/global-info.service";
import { RessourceStock } from "../interfaces/global.interface";

export type HookType =  'ON_TAG_GAINED' | 'ON_PRODUCTION_INCREASED' | 'ON_CARD_PLAYED' | 'ON_PARAMETER_INCREASED'
| 'ON_RESSOURCE_ADDED_TO_CARD' | 'ON_CARD_ACTIVATED' | 'ON_FOREST_GAINED' | 'ON_TRIGGER_RESOLUTION' | 'ON_UPGRADED_PHASE_SELECTED'
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
	productionIncreased: RessourceStock
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
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
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
		console.log('fire !', input.isParameterMaxedOutAtBeginningOfPhase)
		return [S.addRessource({name:'plant', valueStock:2})]
	}
	//Cargo Ships
	function handleTrigger_F04(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.infrastructure){return []}
		if(input.isParameterMaxedOutAtBeginningOfPhase){return [S.deactivateTrigger(trigger)]}
		return [S.effectPortal(EffectPortalEnum.cargoShips)]
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
	//Decomposers
	function handleTrigger_19(trigger: string, input: TriggerInput, clientState?: PlayerStateModel): EventBaseModel[] {
		let triggerred: number = 0
		let result: EventBaseModel[] = []
		let card = clientState?.getProjectPlayedModelFromId('19')
		if(!card){return []}
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('plant','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('animal','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('microbe','tag')))
		for(let i=0; i<triggerred; i++){
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
		let triggerred: number = 0
		let result: EventBaseModel[] = []
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('plant','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('animal','tag')))
		for(let i=0; i<triggerred; i++){
			result.push(S.addRessourceToCardId({name:'animal', valueStock:1}, trigger))
		}
		return result
	}
	//Energy Subsidies
	function handleTrigger_25(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('power','tag'))!=true){return []}
		return [S.draw(1)]
	}
	//Interplanetary Conference
	function handleTrigger_37(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.cardCode===trigger){return []} //Excluding self
		for(let tag of input.tagList){
			if(tag === GlobalInfo.getIdFromType('earth','tag') || tag === GlobalInfo.getIdFromType('jovian','tag')){
				return [S.draw(1)]
			}
		}
		return []
	}
	//Mars University
	function handleTrigger_40(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('science','tag'))===false){return []}
		return [S.discardOptions(1, 'max', DiscardOptionsEnum.marsUniversity)]
	}
	//Olympus Conference
	function handleTrigger_44(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('science','tag'))===false){return []}
		return [S.draw(1)]
	}
	//Optimal Aerobraking
	function handleTrigger_45(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('event','tag'))===false){return []}
		return [S.addRessource([{name: 'plant', valueStock: 2},{name: 'heat', valueStock: 2}])]
	}
	//Recycled Detritus
	function handleTrigger_48(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('event','tag'))===false){return []}
		return [S.draw(2)]
	}
	//Viral Enhancers
	function handleTrigger_61(trigger: string, input: TriggerInput, clientState?: PlayerStateModel): EventBaseModel[] {
		if(!clientState){return []}
		let triggerred: number = 0
		let result: EventBaseModel[] = []
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('plant','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('microbe','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('animal','tag')))
		if(triggerred===0){return []}
		console.log('stockable cards: ',clientState.getPlayedListWithStockableTypes(['animal', 'microbe']).length)
		if(clientState.getPlayedListWithStockableTypes(['animal', 'microbe']).length===0){
			result.push(S.addRessource({name:'plant', valueStock:triggerred}))
		} else {
			for(let i=0; i<triggerred; i++){
				result.push(S.effectPortal(EffectPortalEnum.viralEnhancer))
			}
		}

		return result
	}
	//Apollo Industriees
	function handleTrigger_D01(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('science','tag'))===false){return []}
		return [S.draw(1)]
	}
	//Sultira
	function handleTrigger_D04(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('power','tag'))===false){return []}
		return [S.addRessource({name:'heat', valueStock:2})]
	}
	//Impact Analysis
	function handleTrigger_D08(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('event','tag'))===false){return []}
		return [S.draw(1)]
	}
	//Bacterial Aggregate
	function handleTrigger_P19_OnTagGained(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))===false){return []}
		console.log('bacterial triggerred on tag gained')
		return [S.addRessourceToCardId({name:'microbe', valueStock: 1}, trigger)]
	}
	//Saturn Systems
	function handleTrigger_216(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.cardCode===trigger){return []} //Excluding self
		if(input.tagList.includes(GlobalInfo.getIdFromType('jovian','tag'))===false){return []}
		return [S.addTR(1)]
	}
	//Arklight
	function handleTrigger_P12(trigger: string, input: TriggerInput): EventBaseModel[] {
		let triggerred: number = 0
		let result: EventBaseModel[] = []
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('plant','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('animal','tag')))
		if(triggerred>0){
			result.push(S.addRessourceToCardId({name:'animal', valueStock:triggerred}, trigger))
		}
		return result
	}
	//Point Luna
	function handleTrigger_CF1(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))===false){return []}
		return [S.draw(1)]
	}
	//Solar Logistics
	function handleTrigger_FM2(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('event','tag'))===false || input.tagList.includes(GlobalInfo.getIdFromType('space','tag'))===false){return []}
		return [S.draw(1)]
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
		return [S.addRessource({name:"megacredit", valueStock:1})]
	}
	//Meat Industry
	function handleTrigger_FM4(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.ressourceAdded!='animal'){return []}
		return [S.addRessource({name:"megacredit", valueStock:1})]
	}


//ON_CARD_ACTIVATED
	//Assembly Lines
	function handleTrigger_10(trigger: string, input: TriggerInput): EventBaseModel[] {
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
		console.log('mars univ resolv')
		let card: PlayableCardModel = input.discardedCard
		let draw = 1
		if(card.hasTag('plant') || card.hasTag('science')){draw ++}
		console.log('univ:', draw)
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

// Main Dispatch
const HANDLERS_BY_HOOK: Record<HookType, Record<string, (triggerCode: string, input: TriggerInput, clientState?: PlayerStateModel) => EventBaseModel[]>> = {
	ON_CARD_PLAYED: {
		'6': handleTrigger_6,
		'P16': handleTrigger_P16
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
		'19': handleTrigger_19,
		'24': handleTrigger_24,
		'25': handleTrigger_25,
		'37': handleTrigger_37,
		'40': handleTrigger_40,
		'44': handleTrigger_44,
		'45': handleTrigger_45,
		'48': handleTrigger_48,
		'61': handleTrigger_61,
		'216': handleTrigger_216,
		'D01': handleTrigger_D01,
		'D04': handleTrigger_D04,
		'D08': handleTrigger_D08,
		'P12': handleTrigger_P12,
		'P19': handleTrigger_P19_OnTagGained,
		'CF1': handleTrigger_CF1,
		'FM2': handleTrigger_FM2,
	},
	ON_RESSOURCE_ADDED_TO_CARD: {
		'P04': handleTrigger_P04,
		'P19': handleTrigger_P19_OnRessourceAdded,
		'FM3': handleTrigger_FM3,
		'FM4': handleTrigger_FM4
	},
	ON_CARD_ACTIVATED: {
		'10': handleTrigger_10
	},
	ON_FOREST_GAINED: {
		'53': handleTrigger_53
	},
	ON_PRODUCTION_INCREASED: {
		'214': handleTrigger_214
	},
	ON_TRIGGER_RESOLUTION: {
		'40': handleTrigger_40_resolution,
	},
	ON_UPGRADED_PHASE_SELECTED: {
		'D05': handleTrigger_D05,
		'P31': handleTrigger_P31,
	},
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
		isParameterMaxedOutAtBeginningOfPhase: input.isParameterMaxedOutAtBeginningOfPhase??true
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
