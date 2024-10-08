import { Injectable } from "@angular/core";
import { DrawEvent, EventCardSelector, EventCardSelectorPlayZone, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventTargetCard, EventWaiter, PlayableCardZone } from "../../models/core-game/event.model";
import { EventCardSelectorPlayZoneSubType, EventCardSelectorSubType, EventDeckQuerySubType, EventGenericSubType, EventTargetCardSubType, EventUnionSubTypes, EventWaiterSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, DrawDiscard, GlobalParameterValue, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { ButtonDesigner } from "./button-designer.service";

type CardSelectorOptions = Partial<CardSelector>

interface CreateEventOptionsSelector {
    cardSelector?: CardSelectorOptions
    title?: string
    waiterId?:number
}
interface CreateEventOptionsTargetCard {
    advancedRessource?: AdvancedRessourceStock
}
interface CreateEventOptionsGeneric {
    increaseParameter?: GlobalParameterValue
    baseRessource?: RessourceStock | RessourceStock[]
    scanKeep?: ScanKeep
    cardId?: number
    drawEventResult?:number[]
    waiterId?:number
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeNumber?: number
}
interface CreateEventOptionsDeckQuery {
    drawDiscard?: Partial<DrawDiscard>
    scanKeep?: Partial<ScanKeep>,
}

@Injectable({
    providedIn: 'root'
})
export class EventDesigner{
    private static generateCardSelector(args?: CardSelectorOptions): CardSelector {
        let selector: CardSelector

        selector ={
            selectFrom: args?.selectFrom? args.selectFrom:[],
            selectedList:  args?.selectedList? args.selectedList:[],
            selectionQuantity: args?.selectionQuantity? args.selectionQuantity:0,
            selectionQuantityTreshold: args?.selectionQuantityTreshold? args.selectionQuantityTreshold:'equal',
            cardInitialState: args?.cardInitialState? args.cardInitialState:undefined,
            filter: args?.filter? args.filter:undefined,
            stateFromParent: args?.filter? args.stateFromParent:undefined
        }

        return selector
    }
    public static createCardSelector(subType:EventCardSelectorSubType, args?: CreateEventOptionsSelector): EventCardSelector {
        let event = new EventCardSelector
        event.cardSelector = this.generateCardSelector(args?.cardSelector)
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
                event.cardSelector.selectionQuantityTreshold = 'min'
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
                event.refreshSelectorOnSwitch = false
                event.waiterId = args?.waiterId
                break
            }
            default:{console.log('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
        }
        event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
        return event
    }
    public static createCardSelectorRessource(ressource:AdvancedRessourceStock, args?: CreateEventOptionsSelector): EventCardSelectorRessource {
        let event = new EventCardSelectorRessource
        event.cardSelector = this.generateCardSelector(args?.cardSelector)

        event.subType = 'addRessourceToSelectedCard'
        event.advancedRessource = {name:ressource.name, valueStock:ressource.valueStock}
        event.title = args?.title? args.title: `Select a card to add ${event.advancedRessource?.valueStock} ${event.advancedRessource?.name}(s).`
        event.cardSelector.filter =  {type:'stockable', value:event.advancedRessource?.name}
        event.cardSelector.cardInitialState = {selectable: true, ignoreCost:true}
        event.cardSelector.selectionQuantityTreshold = 'equal'
        event.cardSelector.selectionQuantity = 1
        event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
        event.refreshSelectorOnSwitch = false

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
            default:{console.log('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
        }

        //add playable card zones
        for(let i=0; i<=1; i++){
            let playableCardZone: PlayableCardZone = new PlayableCardZone()
            playableCardZone.addButtons(ButtonDesigner.createEventSecondaryButton(subType, {zoneId:i}))
            event.playCardZone.push(playableCardZone)
        }
        return event
    }
    public static createTargetCard(subType:EventTargetCardSubType, targetCardId:number ,args?: CreateEventOptionsTargetCard): EventTargetCard {
        let event = new EventTargetCard

        event.targetCardId = targetCardId
        event.subType = subType

        switch(subType){
            case('addRessourceToCardId'):{
                event.advancedRessource = args?.advancedRessource
                break
            }
            case('deactivateTrigger'):{
                break
            }
            default:{console.log('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
        }
        event.button = ButtonDesigner.createEventMainButton(event.subType)
        return event
    }
    public static createGeneric(subType:EventGenericSubType, args?: CreateEventOptionsGeneric): EventGeneric {
        let event = new EventGeneric

        event.subType = subType
        switch(subType){
            case('increaseGlobalParameter'):{
                event.increaseParameter = args?.increaseParameter
                break
            }
            case('upgradePhaseCards'):{
                event.title = 'Select a phase card to upgrade'
                event.autoFinalize = false
                event.phaseCardUpgradeList = args?.phaseCardUpgradeList
                event.phaseCardUpgradeQuantity = args?.phaseCardUpgradeNumber
                break
            }
            case('addRessourceToPlayer'):{
                event.baseRessource = args?.baseRessource
                break
            }
            case('increaseResearchScanKeep'):{
                event.increaseResearchScanKeep = args?.scanKeep
                break
            }
            case('planificationPhase'):{
                event.autoFinalize = false
                break
            }
            case('buildCard'):{
                event.cardIdToBuild = args?.cardId
                break
            }
            case('productionPhase'):{
                event.autoFinalize = false
                break
            }
            case('endOfPhase'):{break}
            case('drawResult'):{
                //event.value = {waiterId:1} = args?.waiterId? args.waiterId:-1
                //event.value .drawResultList = args?.drawResult
                event.drawResultList = args?.drawEventResult
                event.waiterId = args?.waiterId
                break
            }
            default:{console.log('EVENT DESIGNER ERROR: Unmapped event creation: ',subType, args)}
        }
        event.button = ButtonDesigner.createEventMainButton(event.subType)
        return event
    }
    public static createDeckQueryEvent(subType:EventDeckQuerySubType, args?: CreateEventOptionsDeckQuery ) : EventDeckQuery {
        let event = new EventDeckQuery
        
        event.subType = subType
        switch(subType){
            case('scanKeepQuery'):{
                event.scanKeep = args?.scanKeep
                break
            }
            case('drawQuery'):{
                event.drawDiscard = args?.drawDiscard
                break
            }
            case('researchPhaseQuery'):{
                event.scanKeep = args?.scanKeep
                break
            }
            default:{console.log('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
        }
        return event
    }
    public static createWaiter(subType:EventWaiterSubType, waiterId: number) : EventWaiter {
        let event = new EventWaiter
        
        event.subType = subType
        switch(subType){
            case('deckWaiter'):{
                event.autoFinalize = false
                event.locksEventpile = true
                event.waiterId = waiterId
                break
            }
            default:{console.log('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
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
@Injectable({
    providedIn: 'root'
})
export class DrawEventDesigner {
    public static createDrawEvent(resolveType:EventUnionSubTypes, drawCardNumber:number, waiterId:number): DrawEvent {
        let event = new DrawEvent
        event.drawCardNumber= drawCardNumber,
        event.resolveEventSubType = resolveType
        event.waiterId = waiterId
        return event
    }
    public static createScanKeepEvent(resolveType:EventUnionSubTypes, scanKeep:ScanKeep ,waiterId:number): DrawEvent {
        let event = new DrawEvent
        event.drawCardNumber = scanKeep.scan
        event.resolveEventSubType = resolveType
        event.waiterId = waiterId
        event.keepCardNumber = scanKeep.keep
        return event
    }
}