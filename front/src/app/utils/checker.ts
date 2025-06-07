import { GlobalParameterNameEnum, GlobalParameterColorEnum } from "../enum/global.enum"
import { AdvancedRessourceStock } from "../interfaces/global.interface"
import { PlayerStateModel } from "../models/player-info/player-state.model"
import { RessourceType, MinMaxEqualType, TagType } from "../types/global.type"
import { Utils } from "./utils"

const minIndex = 0
const maxIndex = 5
const parameterColorIndexOffset : Map<number, GlobalParameterColorEnum> = new Map([
	[0, GlobalParameterColorEnum.purple],
	[1, GlobalParameterColorEnum.purple],
	[2, GlobalParameterColorEnum.red],
	[3, GlobalParameterColorEnum.yellow],
	[4, GlobalParameterColorEnum.white],
	[5, GlobalParameterColorEnum.white],
])
const parameterColorIndex : Map<GlobalParameterColorEnum, number> = new Map([
	[GlobalParameterColorEnum.purple, 1],
	[GlobalParameterColorEnum.red, 2],
	[GlobalParameterColorEnum.yellow, 3],
	[GlobalParameterColorEnum.white, 4],
])

function isRessourceOk(ressource: RessourceType, quantity: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
    let check = clientState.getRessourceInfoFromType(ressource)
    if(!check){return false}
    return Utils.getValueVsTreshold({treshold:treshold, tresholdValue:quantity, value:check.valueStock})
}
function isTagOk(tagType: TagType, requiredTagNumber: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
    let tags = clientState.getTags()
    for(let tag of tags){
        if(tag.name!=tagType){continue}
        return Utils.getValueVsTreshold({treshold: treshold, tresholdValue: requiredTagNumber, value: tag.valueCount})
    }
    return false
}
function isGlobalParameterOk(parameter: Extract<GlobalParameterNameEnum, GlobalParameterNameEnum.infrastructure | GlobalParameterNameEnum.oxygen | GlobalParameterNameEnum.temperature>, color: GlobalParameterColorEnum, treshold: MinMaxEqualType, clientState: PlayerStateModel, offset?: number): boolean {
	let currentIndex = parameterColorIndex.get(clientState.getGlobalParameterColorAtPhaseBeginning(parameter))
	let colorToTestIndex: number | undefined = parameterColorIndex.get(color)
	if(!colorToTestIndex || !currentIndex){return false}

	if(!offset){
		offset = 0//clientState.getPrerequisiteOffset(parameter)
	}

	switch(treshold){
		case("equal"):{
			return currentIndex >= (colorToTestIndex - offset) && currentIndex <= (colorToTestIndex + offset)
		}
		case('min'):{
			return currentIndex >= (colorToTestIndex - offset)
		}
		case('max'):{
			return currentIndex <= (colorToTestIndex + offset)
		}
	}
}
function isOceanOk(oceanFlippedNumber: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
    let currentOcean = clientState.getOceanFlippedNumberAtPhaseBeginning()
    return Utils.getValueVsTreshold({treshold:treshold, tresholdValue:oceanFlippedNumber, value:currentOcean})
}
function isTrOk(tr: number, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
    return Utils.getValueVsTreshold({treshold:treshold, tresholdValue:tr, value: clientState.getTR()})
}
function isMinimumStockOnPlayedCardOk(stock: AdvancedRessourceStock[], clientState: PlayerStateModel): boolean {
    return false
}
function isHandCurrentSizeOk(size: number, treshold: MinMaxEqualType, clientstate: PlayerStateModel): boolean {
    return Utils.getValueVsTreshold({treshold: treshold, tresholdValue: size, value: clientstate.getHandCurrentSize()})
}
export const Checker = {
    isRessourceOk,
    isTagOk,
    isGlobalParameterOk,
    isOceanOk,
    isTrOk,
	isMinimumStockOnPlayedCardOk,
    isHandCurrentSizeOk
}
