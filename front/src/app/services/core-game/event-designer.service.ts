import { Injectable } from "@angular/core";
import { EventCardSelector, EventCardSelectorPlayZone, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventTargetCard, PlayableCardZone } from "../../models/core-game/event.model";
import { EventCardSelectorPlayZoneSubType, EventCardSelectorSubType, EventDeckQuerySubType, EventGenericSubType, EventTargetCardSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, EventValue } from "../../interfaces/global.interface";
import { ButtonDesigner } from "./button-designer.service";
import { ProjectCardModel } from "../../models/cards/project-card.model";
import { MinMaxEqualType } from "../../types/global.type";
import { ProjectFilter } from "../../interfaces/global.interface";
import { CardState } from "../../models/cards/card-cost.model";

interface CardSelectorOptions {
    selectFrom?: ProjectCardModel[];
    selectedList?: ProjectCardModel[];
    selectionQuantity?: number;
    selectionQuantityTreshold?: MinMaxEqualType;
    filter?: ProjectFilter;
    cardInitialState?: CardState;
	stateFromParent?: CardState;
}

interface CreateEventOptions {
    cardSelector?: CardSelectorOptions

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

        selector ={
            selectFrom: args?.cardSelector?.selectFrom? args.cardSelector.selectFrom:[],
            selectedList:  args?.cardSelector?.selectedList? args.cardSelector.selectedList:[],
            selectionQuantity: args?.cardSelector?.selectionQuantity? args.cardSelector.selectionQuantity:0,
            selectionQuantityTreshold: args?.cardSelector?.selectionQuantityTreshold? args.cardSelector.selectionQuantityTreshold:'equal',
            cardInitialState: args?.cardSelector?.cardInitialState? args.cardSelector.cardInitialState:undefined,
            filter: args?.cardSelector?.filter? args.cardSelector.filter:undefined,
            stateFromParent: args?.cardSelector?.filter? args.cardSelector.stateFromParent:undefined
        }

        return selector
    }
    public static createCardSelector(subType:EventCardSelectorSubType, args?: CreateEventOptions): EventCardSelector {
        let event = new EventCardSelector
        event.cardSelector = this.generateCardSelector(args)
        event.subType = subType

        switch(subType){
            case('discardCards'):{
                event.title = args?.title? args.title: `Select ${args?.cardSelector?.selectionQuantity? args.cardSelector.selectionQuantity:0} card(s) to discard.`
                event.cardSelector.cardInitialState = args?.cardSelector?.cardInitialState?  args.cardSelector.cardInitialState:{selectable: true, ignoreCost: true}
                event.locksEventpile = true
                break
            }
            case('selectCardForcedSell'):{
                event.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                break
            }
            case('selectCardOptionalSell'):{
                event.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                break
            }
            case('actionPhase'):{
                event.cardSelector.filter = {type: 'action'}
                event.cardSelector.cardInitialState = {activable: true, selectable: false, playable: false, ignoreCost:true}
                event.title = 'Activate cards :'
                break
            }
            case('researchPhaseResult'):
            case('scanKeepResult'):{
                event.title = `Select ${event.cardSelector.selectionQuantity} cards to draw`
                event.cardSelector.cardInitialState = {selectable:true, ignoreCost: true}
                event.cardSelector.selectionQuantityTreshold = 'equal'
                break
            }
        }
        event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
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
        event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)

        return event
    }
    public static createCardSelectorPlayZone(subType:EventCardSelectorPlayZoneSubType): EventCardSelectorPlayZone {
        let event = new EventCardSelectorPlayZone
        event.cardSelector = this.generateCardSelector()
        event.cardSelector.cardInitialState = {selectable: false, playable: true}
        event.subType = subType
        event.playCardZone = []
        event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
        

        switch(subType){
            case('developmentPhase'):{
                event.title = 'Play Green cards :'
                event.cardSelector.filter = {type:'development'}
                break
            }
            case('constructionPhase'):{
                event.title = 'Play Blue/Red cards :'
                event.cardSelector.filter = {type:'construction'}
                break
            }
        }

        //add playable card zones
        for(let i=0; i<=1; i++){
            let playableCardZone: PlayableCardZone = new PlayableCardZone()
            playableCardZone.addButtons(ButtonDesigner.createEventSecondaryButton(subType, {zoneId:i}))
            event.playCardZone.push(playableCardZone)
        }
        return event
    }

    public static createTargetCard(subType:EventTargetCardSubType, targetCardId:number ,args?: CreateEventOptions): EventTargetCard {
        let event = new EventTargetCard

        event.targetCardId = targetCardId
        event.subType = subType

        switch(subType){
            case('addRessourceToCardId'):{
                event.value = {advancedRessource: args?.value?.advancedRessource}
                break
            }
        }
        event.button = ButtonDesigner.createEventMainButton(event.subType)
        return event
    }
    public static createGeneric(subType:EventGenericSubType, args?: CreateEventOptions): EventGeneric {
        let event = new EventGeneric

        event.subType = subType
        switch(subType){
            case('increaseGlobalParameter'):{
                event.value.increaseParameter = args?.value?.increaseParameter
                break
            }
            case('upgradePhaseCards'):{
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
            case('planificationPhase'):{
                event.autoFinalize = false
                break
            }
            case('buildCard'):{
                event.value = {cardBuildId:args?.cardId}
                break
            }
            case('endOfPhase'):
            case('productionPhase'):
            {break}
        }
        event.button = ButtonDesigner.createEventMainButton(event.subType)
        return event
    }
    public static createDeckQueryEvent(subType:EventDeckQuerySubType, args?: CreateEventOptions ) : EventDeckQuery {
        let event = new EventDeckQuery
        
        event.subType = subType
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
    /**
    public static createDeckResultEvent(subType:EventDeckResultSubType, args?: CreateEventOptions ) : EventDeckResult {
        let event = new EventDeckResult
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
    */
}