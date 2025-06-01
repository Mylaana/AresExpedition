import { GlobalParameterNameEnum } from "../../enum/global.enum";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { AdvancedRessourceType } from "../../types/global.type";
import { EventFactory } from "../designers/event factory/event-factory";
import { GlobalInfo } from "../global/global-info.service";

export type HookType =  'ON_TAG_GAINED' | 'ON_PRODUCTION_GAINED' | 'ON_CARD_PLAYED' | 'ON_PARAMETER_INCREASED'
| 'ON_RESSOURCE_ADDED_TO_CARD' | 'ON_CARD_ACTIVATED' | 'ON_FOREST_GAINED'
interface TriggerInput {
	playedCard: PlayableCardModel,
	increasedParameter: GlobalParameterNameEnum
	increasedParameterValue: number,
	tagList: number[]
	ressourceAdded: AdvancedRessourceType
	ressourceAddedValue: number
	receivingCard: PlayableCardModel,
	forestGained: number
}

// Referencing HookType-relevantTriggerList
const COST_MOD: string[] = []

// Handlers
//ON_PLAYED_CARD
	//Antigravity Technology
	function handleTrigger_6(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [EventFactory.simple.addRessource([{name: 'plant', valueStock: 2},{name: 'heat', valueStock: 2}])]
	}

//ON_PARAMETER_INCREASED
	//Arctic Alagae
	function handleTrigger_8(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.ocean){return []}
		return [EventFactory.simple.addRessource({name:'plant', valueStock:4})]
	}
	//Fish
	function handleTrigger_30(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.ocean){return []}
		return [EventFactory.simple.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Herbivores
	function handleTrigger_33(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter===GlobalParameterNameEnum.infrastructure){return []}
		return [EventFactory.simple.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Livestock
	function handleTrigger_39(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.temperature){return []}
		return [EventFactory.simple.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Physics Complex
	function handleTrigger_46(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.temperature){return []}
		return [EventFactory.simple.addRessourceToCardId({name:"science", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Pets
	function handleTrigger_F07(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.infrastructure){return []}
		return [EventFactory.simple.addRessourceToCardId({name:"animal", valueStock:input.increasedParameterValue}, trigger)]
	}
	//Zetasel
	function handleTrigger_CP06(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.increasedParameter!=GlobalParameterNameEnum.ocean){return []}
		return [EventFactory.simple.addRessource([{name:'megacredit', valueStock:2},{name:'plant', valueStock:2}])]
	}

//ON_TAG_GAINED
	//Decomposers
	function handleTrigger_19(trigger: string, input: TriggerInput): EventBaseModel[] {
		let triggerred: number = 0
		let result: EventBaseModel[] = []
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('plant','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('animal','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('microbe','tag')))
		for(let i=0; i<triggerred; i++){
			result.push(EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock:1}, trigger))
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
			result.push(EventFactory.simple.addRessourceToCardId({name:'animal', valueStock:1}, trigger))
		}
		return result
	}
	//Energy Subsidies
	function handleTrigger_25(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('power','tag'))!=true){return []}
		return [EventFactory.simple.draw(1)]
	}
	//Interplanetary Conference
	function handleTrigger_37(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.cardCode===trigger){return []} //Excluding self
		//triggers for each tag in the played card
		let draw = 0
		for(let tag of input.tagList){
			if(tag === GlobalInfo.getIdFromType('earth','tag') || tag === GlobalInfo.getIdFromType('jovian','tag')){
				draw += 1
			}
		}
		if(draw===0){return []}
		return [EventFactory.simple.draw(draw)]
	}
	//Olympus Conference
	function handleTrigger_44(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('science','tag'))===false){return []}
		return [EventFactory.simple.draw(1)]
	}
	//Optimal Aerobraking
	function handleTrigger_45(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('event','tag'))===false){return []}
		return [EventFactory.simple.addRessource([{name: 'plant', valueStock: 2},{name: 'heat', valueStock: 2}])]
	}
	//Recycled Detritus
	function handleTrigger_48(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('event','tag'))===false){return []}
		return [EventFactory.simple.draw(2)]
	}
	//Bacterial Aggregate
	function handleTrigger_P19_OnTagGained(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))===false){return []}
		return [EventFactory.simple.addRessourceToCardId({name:'microbe', valueStock: 1}, trigger)]
	}
	//Saturn Systems
	function handleTrigger_C8(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.playedCard.cardCode===trigger){return []} //Excluding self
		if(input.tagList.includes(GlobalInfo.getIdFromType('jovian','tag'))===false){return []}
		return [EventFactory.simple.addTR(1)]
	}
	//Arklight
	function handleTrigger_CP01(trigger: string, input: TriggerInput): EventBaseModel[] {
		let triggerred: number = 0
		let result: EventBaseModel[] = []
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('plant','tag')))
		triggerred += Number(input.tagList.includes(GlobalInfo.getIdFromType('animal','tag')))
		for(let i=0; i<triggerred; i++){
			result.push(EventFactory.simple.addRessourceToCardId({name:'animal', valueStock:1}, trigger))
		}
		return result
	}
	//Point Luna
	function handleTrigger_CF1(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.tagList.includes(GlobalInfo.getIdFromType('earth','tag'))===false){return []}
		return [EventFactory.simple.draw(1)]
	}
//ON_RESSOURCE_ADDED_TO_CARD
	//Filter Feeders
	function handleTrigger_P04(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.ressourceAdded!='microbe'){return []}
		return [EventFactory.simple.addRessourceToCardId({name:"animal", valueStock:1}, trigger)]
	}
	//Bacterial Aggregate
	function handleTrigger_P19_OnRessourceAdded(trigger: string, input: TriggerInput): EventBaseModel[] {
		if(input.ressourceAdded!='microbe'|| input.ressourceAddedValue<1){return []}

		let stock = input.receivingCard.getStockValue('microbe')
		let result: EventBaseModel[] = []
		if(stock>=5){
			result.push(EventFactory.simple.deactivateTrigger(trigger))
		}

		let limit = input.receivingCard.getCardTriggerLimit()
		if(limit===undefined){return []}

		let addValue = Math.min(input.ressourceAddedValue, limit?.limit - limit.value)
		if(addValue<=0){return[]}

		result.push(EventFactory.simple.increaseResearchScanKeep({keep:0, scan:addValue}))
		input.receivingCard.triggerLimit.value += addValue
		return result
	}
//ON_CARD_ACTIVATED
	//Assembly Lines
	function handleTrigger_10(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [EventFactory.simple.addRessource({name:"megacredit", valueStock:1})]
	}

//ON_FOREST_GAINED
	//Small Animals
	function handleTrigger_53(trigger: string, input: TriggerInput): EventBaseModel[] {
		return [EventFactory.simple.addRessourceToCardId({name:"animal", valueStock:input.forestGained}, trigger)]
	}

// Main Dispatch
const HANDLERS_BY_HOOK: Record<HookType, Record<string, (triggerCode: string, input: TriggerInput) => EventBaseModel[]>> = {
	ON_CARD_PLAYED: {
		'6': handleTrigger_6
	},
	ON_PARAMETER_INCREASED: {
		'8': handleTrigger_8,
		'30': handleTrigger_30,
		'33': handleTrigger_33,
		'39': handleTrigger_39,
		'46': handleTrigger_46,
		'F07': handleTrigger_F07,
		'CP06': handleTrigger_CP06
	},
	ON_TAG_GAINED: {
		'19': handleTrigger_19,
		'24': handleTrigger_24,
		'25': handleTrigger_25,
		'37': handleTrigger_37,
		'44': handleTrigger_44,
		'45': handleTrigger_45,
		'48': handleTrigger_48,
		'C8': handleTrigger_C8,
		'CP01': handleTrigger_CP01,
		'CF1': handleTrigger_CF1,
		'P19': handleTrigger_P19_OnTagGained
	},
	ON_RESSOURCE_ADDED_TO_CARD: {
		'P04': handleTrigger_P04,
		'P19': handleTrigger_P19_OnRessourceAdded
	},
	ON_CARD_ACTIVATED: {
		'10': handleTrigger_10
	},
	ON_FOREST_GAINED: {
		'53': handleTrigger_53
	},
	ON_PRODUCTION_GAINED: {

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
		forestGained: input.forestGained??0
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
				events.push(...handler(trig,  fullInput));
			}
		}
		return events;
	}
}
export const CostModCalulator = {
	getCostMod(activeTriggers: string[], projectCard: PlayableCardModel): number {
		const relevantTriggers = activeTriggers.filter(trigger => COST_MOD.includes(trigger))
		let totalMod: number = 0
		for(let trigger of relevantTriggers){
			totalMod += calculateCostModFromTrigger(trigger, projectCard)
		}
		return totalMod
	},
}
function calculateCostModFromTrigger(trigger: string,  card?: PlayableCardModel): number {
	let costMod: number = 0
	let tagList = card?.tagsId??[]
	switch(trigger){
		//Earth Catapult
		case('23'):{
			costMod += 2
			break
		}
		//Energy Subsidies
		case('25'):{
			if(tagList.includes(GlobalInfo.getIdFromType('power','tag'))===false){break}
			costMod += 4
			break
		}
		//Interplanetary Conference
		case('37'):{
			if(tagList.includes(GlobalInfo.getIdFromType('earth','tag'))){costMod += 3}
			if(tagList.includes(GlobalInfo.getIdFromType('jovian','tag'))){costMod += 3}
			break
		}
		//Media Group
		case('42'):{
			if(tagList.includes(GlobalInfo.getIdFromType('event','tag'))){costMod += 5}
			break
		}
		//Research Outpost
		case('51'):{
			costMod += 1
			break
		}
		//CreditCor
		case('C1'):{
			if(!card){break}
			if(card.costInitial>=20){costMod += 4}
			break
		}
		//Interplanetary Cinematics
		case('C4'):{
			if(tagList.includes(GlobalInfo.getIdFromType('event','tag'))){costMod += 2}
			break
		}
		//Teractor
		case('C9'):{
			if(tagList.includes(GlobalInfo.getIdFromType('earth','tag'))){costMod += 3}
			break
		}
		//Thorgate
		case('C11'):{
			if(tagList.includes(GlobalInfo.getIdFromType('power','tag'))){costMod += 3}
			break
		}
	}
	return costMod
}
