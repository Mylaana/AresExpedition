import { Injectable } from "@angular/core";
import { EventCardSelector, EventCardSelectorRessource, EventGeneric, EventTargetCard } from "../../models/core-game/event.model";
import { EventCardSelectorSubType, EventDrawSubType, EventGenericSubType, EventTargetCardSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, EventValue } from "../../interfaces/global.interface";
import { EventDraw } from "../../models/core-game/event.model";

interface CreateEventOptions {
    cardSelector?: CardSelector

    title?: string
    value?: EventValue
    cardId?: number
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeNumber?: number
}

@Injectable({
    providedIn: 'root'
})
export class EventDesigner{
    private static generateCardSelector(args?: CreateEventOptions): CardSelector {
        let selector: CardSelector
        if(args?.cardSelector){
            selector = args.cardSelector
        } else {
            selector = {
                selectFrom: args?.cardSelector?.selectFrom? args.cardSelector.selectFrom:[],
                selectedIdList:  args?.cardSelector?.selectedIdList? args.cardSelector.selectedIdList:[],
                selectionQuantity: args?.cardSelector?.selectionQuantity? args.cardSelector.selectionQuantity:0
            }
        }
        return selector
    }
    public static createCardSelector(subType:EventCardSelectorSubType, args?: CreateEventOptions): EventCardSelector {
        let event = new EventCardSelector
        event.cardSelector = this.generateCardSelector(args)

        switch(subType){
            case('discardCards'):{
                event.title = args?.title? args.title: `Select ${args?.cardSelector?.selectionQuantity? args.cardSelector.selectionQuantity:0} card(s) to discard.`
                event.cardSelector.cardInitialState = args?.cardSelector?.cardInitialState?  args.cardSelector.cardInitialState:{selectable: true, ignoreCost: true}
                break
            }
            default:{
                event.title = 'no title provided'
            }
        }
        return event
    }
    public static createCardSelectorRessource(ressource:AdvancedRessourceStock, args?: CreateEventOptions): EventCardSelectorRessource {
        let event = new EventCardSelectorRessource
        event.cardSelector = this.generateCardSelector(args)

        event.subType = 'addRessourceToSelectedCard'
        event.value = {advancedRessource:{name:ressource.name, valueStock:ressource.valueStock}}
        event.title = args?.title? args.title: `Select a card to add ${event.value.advancedRessource?.valueStock} ${event.value.advancedRessource?.name}(s).`
        event.cardSelector.filter =  {type:'stockable', value:event.value.advancedRessource?.name}
        event.cardSelector.cardInitialState
        return event
    }
    public static createTargetCard(subType:EventTargetCardSubType, targetCardId:number ,args?: CreateEventOptions): EventTargetCard {
        let event = new EventTargetCard

        event.targetCardId = targetCardId

        switch(subType){
            case('addRessourceToCardId'):{
                event.value = {advancedRessource: args?.value?.advancedRessource}
                break
            }
        }
        return event
    }
    public static createGeneric(subType:EventGenericSubType, args?: CreateEventOptions): EventGeneric {
        let event = new EventGeneric

        switch(subType){
            case('increaseGlobalParameter'):{
                event.value.increaseParameter = args?.value?.increaseParameter
                break
            }
            case('upgradePhase'):{
                event.title = 'Select a phase card to upgrade'
                event.autoFinalize = false
                break
            }
            case('addRessourceToPlayer'):{
                event.value.baseRessource = args?.value?.baseRessource
                break
            }

            case('increaseResearchScanKeep'):{
                event.value.scanKeep = args?.value?.scanKeep
                break
            }
            case('endOfPhase'):
            case('planification'):
            case('production'):
            case('research'):
            {break}
        }
        return event
    }
    public static createDrawEvent(subType:EventDrawSubType, args?: CreateEventOptions ) : EventDraw {
        let event = new EventDraw
        event.title = `Select ${args?.value?.scanKeep?.keep} cards to draw.`
        
        switch(subType){
            case('scanKeepQuery'):{
                event.value = {scanKeep:args?.value?.scanKeep}
                break
            }
            case('drawQuery'):{
                event.value = {drawDiscard:args?.value?.drawDiscard}
                break
            }

        }
        return event
    }
}