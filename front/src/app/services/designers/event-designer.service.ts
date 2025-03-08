import { Injectable } from "@angular/core";
import { EventCardSelector, EventCardBuilder, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventTargetCard, EventWaiter, CardBuilder, EventPhase } from "../../models/core-game/event.model";
import { EventCardBuilderSubType, EventCardSelectorSubType, EventDeckQuerySubType, EventGenericSubType, EventPhaseSubType, EventTargetCardSubType, EventWaiterSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, DrawDiscard, GlobalParameterValue, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { ButtonDesigner } from "./button-designer.service";
import { BuilderType} from "../../types/phase-card.type";
import { CardBuilderOptionType } from "../../types/global.type";
import { Utils } from "../../utils/utils";

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
				event.cardSelector.selectionQuantityTreshold = 'min'
				event.cardSelector.selectionQuantity = 1
				event.title = 'Select any number of cards to sell'
                break
            }
            case('actionPhase'):{
                event.cardSelector.filter = {type: 'action'}
                event.cardSelector.cardInitialState = {activable: true, selectable: false, buildable: false, ignoreCost:true}
                event.title = 'Activate cards'
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
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
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
    private static generateCardBuilder(builderId:number, option?:CardBuilderOptionType): CardBuilder {
        let builder = new CardBuilder
        builder.addButtons(ButtonDesigner.createEventCardBuilderButton(builderId, option))
        //builder.setId(builderId)
        option?builder.setOption(option):null
        return builder
    }
    public static createCardBuilder(subType:EventCardBuilderSubType, builderType: BuilderType): EventCardBuilder {
        let event = new EventCardBuilder
        event.cardSelector = this.generateCardSelector()
        event.cardSelector.cardInitialState = {selectable: false, buildable: true}
        event.subType = subType
        event.cardBuilder = []
        event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)

		let buildDiscountValue = 0
		switch(builderType){
            case('developmentAbilityOnly'):{
                event.cardBuilder.push(this.generateCardBuilder(0))
                break
            }
			case('development_base'):{
                buildDiscountValue = 3
                event.cardBuilder.push(this.generateCardBuilder(0))
                break
            }
			case('development_6mc'):{
                buildDiscountValue = 6
                event.cardBuilder.push(this.generateCardBuilder(0))
                break
            }
			case('development_second_card'):{
                buildDiscountValue = 3
                for(let i=0; i<=1; i++){event.cardBuilder.push(this.generateCardBuilder(i))}
                break
            }

            case('constructionAbilityOnly'):{
                event.cardBuilder.push(this.generateCardBuilder(0))
                break
            }
            case('construction_base'):{
                event.cardBuilder.push(this.generateCardBuilder(0))
                event.cardBuilder.push(this.generateCardBuilder(1,'drawCard'))
                break
            }
			case('construction_6mc'):{
                event.cardBuilder.push(this.generateCardBuilder(0))
                event.cardBuilder.push(this.generateCardBuilder(1,'gain6MC'))
                break
            }
			case('construction_draw_card'):{
                for(let i=0; i<=1; i++){event.cardBuilder.push(this.generateCardBuilder(i))}
                break
            }
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event builder type: ',event)}
		}

        switch(subType){
            case('developmentPhaseBuilder'):{
                event.title = 'Play Green cards :'
                event.cardSelector.filter = {type:'development'}
                break
            }
            case('constructionPhaseBuilder'):{
                event.title = 'Play Blue or Red cards'
                event.cardSelector.filter = {type:'construction'}
                break
            }
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
        }

        event.buildDiscountValue = buildDiscountValue
        event.buildDiscountUsed = false

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
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
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
				event.title = 'Select a phase card:'
                break
            }
            case('buildCard'):{
                event.cardIdToBuild = args?.cardId
                break
            }
            case('endOfPhase'):{break}
            case('drawResult'):{
                event.drawResultList = args?.drawEventResult
                event.waiterId = args?.waiterId
                break
            }
            case('waitingGroupReady'):{
                event.autoFinalize = false
                break
            }
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',subType, args)}
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
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
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
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
        }
        return event
    }
    public static createPhase(subType:EventPhaseSubType): EventPhase {
        let event = new EventPhase

        event.subType = subType
        switch(subType){
            case('productionPhase'):{
                event.autoFinalize = false
                break
            }
            case('developmentPhase'):{break}
            case('constructionPhase'):{break}
            case('researchPhase'):{break}
            default:{Utils.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',subType)}
        }
        event.button = ButtonDesigner.createEventMainButton(event.subType)
        return event
    }
}
