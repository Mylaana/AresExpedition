import { GlobalParameterNameEnum, GlobalParameterColorEnum } from "../enum/global.enum"
import { AdvancedRessourceStock } from "../interfaces/global.interface"
import { PlayerStateModel } from "../models/player-info/player-state.model"
import { RessourceType, MinMaxEqualType, TagType } from "../types/global.type"
import { Utils } from "./utils"

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
function isGlobalParameterOk(parameter: Extract<GlobalParameterNameEnum, GlobalParameterNameEnum.infrastructure | GlobalParameterNameEnum.oxygen | GlobalParameterNameEnum.temperature>, color: GlobalParameterColorEnum, treshold: MinMaxEqualType, clientState: PlayerStateModel): boolean {
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
