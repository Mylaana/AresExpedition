import { DeckQueryOptionsEnum, GlobalParameterNameEnum, ProjectFilterNameEnum } from "../../enum/global.enum"
import { CardSelector, AdvancedRessourceStock, GlobalParameterValue, RessourceStock, ScanKeep, DrawDiscard } from "../../interfaces/global.interface"
import { PlayableCardModel } from "../../models/cards/project-card.model"
import { EventBaseModel, EventCardSelector, EventCardSelectorRessource, EventCardActivator, CardBuilder, EventCardBuilder, EventTargetCard, EventGeneric, EventDeckQuery, EventWaiter, EventPhase, EventScanKeepCardSelector } from "../../models/core-game/event.model"
import { EventCardSelectorSubType, EventCardActivatorSubType, EventCardBuilderSubType, EventTargetCardSubType, EventGenericSubType, EventDeckQuerySubType, EventWaiterSubType, EventPhaseSubType } from "../../types/event.type"
import { CardBuilderOptionType } from "../../types/global.type"
import { BuilderType } from "../../types/phase-card.type"
import { Logger } from "../../utils/utils"
import { ButtonDesigner } from "../button-designer.service"

type CardSelectorOptions = Partial<CardSelector>

interface CreateEventOptionsSelector {
    cardSelector?: CardSelectorOptions
    title?: string
    waiterId?:number,
	scanKeepOptions?: DeckQueryOptionsEnum
}
interface CreateEventOptionsTargetCard {
    advancedRessource?: AdvancedRessourceStock
}
interface CreateEventOptionsGeneric {
    increaseParameter?: GlobalParameterValue
    baseRessource?: RessourceStock | RessourceStock[]
    scanKeep?: ScanKeep
    card?: PlayableCardModel
    drawEventResult?:number[]
    waiterId?:number
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeNumber?: number
	addForestPoint?: number
	oceanQueryNumber?: number
	production?: RessourceStock | RessourceStock[]
	increaseTr?: number
}
interface CreateEventOptionsDeckQuery {
    drawDiscard?: Partial<DrawDiscard>
    scanKeep?: Partial<ScanKeep>,
	isCardProduction?: boolean,
	scanKeepOptions?: DeckQueryOptionsEnum
}

function draw(drawNumber: number): EventBaseModel {
	return EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw:drawNumber,discard:0}})
}
function discard(discardNumber: number): EventCardSelector {
	return EventFactory.createCardSelector("discardCards", {cardSelector: {selectionQuantity: discardNumber}})
}
function upgradePhaseCard(phaseCardUpgradeCount: number, phaseCardList?: number[]): EventBaseModel {
	return EventFactory.createGeneric('upgradePhaseCards', {phaseCardUpgradeList:phaseCardList, phaseCardUpgradeNumber:phaseCardUpgradeCount})
}
function increaseGlobalParameter(parameterName: GlobalParameterNameEnum, steps:number): EventBaseModel {
	return EventFactory.createGeneric('increaseGlobalParameter', {increaseParameter:{name:parameterName,steps: steps}})
}
function addRessource(gain: RessourceStock | RessourceStock[]): EventBaseModel {
	return EventFactory.createGeneric('addRessourceToPlayer', {baseRessource:gain})
}
function addRessourceToCardId(gain: AdvancedRessourceStock, cardId: string): EventBaseModel {
	return EventFactory.createTargetCard('addRessourceToCardId', cardId, {advancedRessource:gain})
}
function increaseResearchScanKeep(scanKeep: ScanKeep): EventBaseModel {
	return EventFactory.createGeneric('increaseResearchScanKeep', {scanKeep:scanKeep})
}
function addRessourceToSelectedCard(ressource: AdvancedRessourceStock, cardSelectionQuantity:number=1): EventBaseModel {
	return EventFactory.createCardSelectorRessource(ressource, {cardSelector:{selectionQuantity:cardSelectionQuantity}})
}
function deactivateTrigger(triggerId: string): EventBaseModel {
	return EventFactory.createTargetCard('deactivateTrigger', triggerId)
}
function addProduction(gain: RessourceStock | RessourceStock[]): EventBaseModel {
	return EventFactory.createGeneric('addProduction', {baseRessource:gain})
}
function addTR(quantity: number): EventBaseModel {
	return EventFactory.createGeneric('addTr', {increaseTr: quantity})
}
function addForestAndOxygen(quantity: number): EventBaseModel {
	return EventFactory.createGeneric('addForestPointAndOxygen', {addForestPoint:quantity})
}
function scanKeep(scanKeep: ScanKeep, options?: DeckQueryOptionsEnum): EventBaseModel {
	return EventFactory.createDeckQueryEvent('scanKeepQuery',{
		scanKeep:{scan: scanKeep.scan, keep: scanKeep.keep},
		scanKeepOptions: options
	})
}

const SimpleEvent = {
	draw,
	discard,
	upgradePhaseCard,
	increaseGlobalParameter,
	addRessource,
	addRessourceToCardId,
	addRessourceToSelectedCard,
	increaseResearchScanKeep,
	deactivateTrigger,
	scanKeep,
	addProduction,
	addTR,
	addForestAndOxygen
}

function generateCardSelector(args?: CardSelectorOptions): CardSelector {
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
function createCardSelector(subType:EventCardSelectorSubType, args?: CreateEventOptionsSelector): EventCardSelector {
    let event = new EventCardSelector
    event.cardSelector = generateCardSelector(args?.cardSelector)
    event.subType = subType

    switch(subType){
        case('discardCards'):{
            event.title = args?.title? args.title: `Select ${args?.cardSelector?.selectionQuantity? args.cardSelector.selectionQuantity:0} card(s) to discard.`
            event.cardSelector.cardInitialState = args?.cardSelector?.cardInitialState?  args.cardSelector.cardInitialState:{selectable: true, ignoreCost: true}
            event.lockSellButton = true
            event.lockRollbackButton = true
            break
        }
        case('selectCardForcedSell'):{
            event.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
            event.cardSelector.selectionQuantityTreshold = 'min'
            event.lockSellButton = true
            event.lockRollbackButton = true
            break
        }
        case('selectCardOptionalSell'):{
            event.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
            event.cardSelector.selectionQuantityTreshold = 'min'
            event.cardSelector.selectionQuantity = 1
            event.title = 'Select any number of cards to sell'
            break
        }
        case('researchPhaseResult'):
			event.title = `Select ${event.cardSelector.selectionQuantity} cards to draw`
            event.cardSelector.cardInitialState = {selectable:true, ignoreCost: true}
            event.cardSelector.selectionQuantityTreshold = 'equal'
            event.refreshSelectorOnSwitch = false
            event.waiterId = args?.waiterId
			break
        case('selectStartingHand'):{
            event.title = 'Discard any card number to draw that many new cards.'
            event.cardSelector.cardInitialState = {selectable:true, ignoreCost: true}
            event.cardSelector.selectionQuantityTreshold = 'min'
            event.cardSelector.selectionQuantity = 0
            event.refreshSelectorOnSwitch = true
            break
        }
        case('selectCorporation'):{
            event.title = 'Select your Corporation'
            event.cardSelector.cardInitialState = {selectable:true, ignoreCost: true}
            event.cardSelector.selectionQuantityTreshold = 'equal'
            event.cardSelector.selectionQuantity = 1
            event.refreshSelectorOnSwitch = false
            break
        }
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
    }
    event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)

    return event
}
function createScanKeepResult(cardList: PlayableCardModel[], keep: number, options?: DeckQueryOptionsEnum, waiter?: number): EventBaseModel {
	switch(options){
		case(DeckQueryOptionsEnum.greenCardGivesMegacreditOtherDraw):{
			let event = new EventScanKeepCardSelector
            event.title = `Gain 1MC if card is green or draw card if Red/Blue.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = keep
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.options = options
			event.waiterId = waiter
			return event
		}
		case(DeckQueryOptionsEnum.keepEvent):{
			let event = new EventScanKeepCardSelector
            event.title = `Select a card with Event tag.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = keep
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.options = options
			event.cardSelector.filter = {type: ProjectFilterNameEnum.hasTagEvent}
			event.waiterId = waiter
			event.cardSelector.stateFromParent = {selectable: true, ignoreCost: true}
			return event
		}
		case(DeckQueryOptionsEnum.keepGreen):{
			let event = new EventScanKeepCardSelector
            event.title = `Select a green card.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = keep
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.options = options
			event.cardSelector.filter = {type: ProjectFilterNameEnum.greenProject}
			event.waiterId = waiter
			event.cardSelector.stateFromParent = {selectable: true, ignoreCost: true}
			return event
		}
		case(DeckQueryOptionsEnum.keepScienceOrPlant):{
			let event = new EventScanKeepCardSelector
            event.title = `Select a card with a Plant or Science tag.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = 1
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.options = options
			event.cardSelector.filter = {type: ProjectFilterNameEnum.hasTagPlantOrScience}
			event.waiterId = waiter
			event.cardSelector.stateFromParent = {selectable: true, ignoreCost: true}
			return event
		}
		default:{
			console.error('UNHANDLED SCANKEEP OPTION')
			return new EventCardSelector
		}
	}
}
function createCardSelectorRessource(ressource:AdvancedRessourceStock, args?: CreateEventOptionsSelector): EventCardSelectorRessource {
    let event = new EventCardSelectorRessource
    event.cardSelector = generateCardSelector(args?.cardSelector)

    event.subType = 'addRessourceToSelectedCard'
    event.advancedRessource = {name:ressource.name, valueStock:ressource.valueStock}
    event.title = args?.title? args.title: `Select a card to add ${event.advancedRessource?.valueStock} ${event.advancedRessource?.name}(s).`
    event.cardSelector.filter =  {type:ProjectFilterNameEnum.stockable, stockableType:event.advancedRessource?.name}
    event.cardSelector.cardInitialState = {selectable: true, ignoreCost:true}
    event.cardSelector.selectionQuantityTreshold = 'equal'
    event.cardSelector.selectionQuantity = 1
    event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
    event.refreshSelectorOnSwitch = false

    return event
}
function createCardActivator(subType: EventCardActivatorSubType, args?: CreateEventOptionsSelector): EventCardActivator {
    let event = new EventCardActivator
    event.cardSelector = generateCardSelector(args?.cardSelector)
    event.subType = subType
    event.cardSelector.filter = {type: ProjectFilterNameEnum.action}
    event.cardSelector.cardInitialState = {activable: true, selectable: false, buildable: false, ignoreCost:true}
    event.title = 'Activate cards'
    event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)

    return event
}
function generateCardBuilder(builderId:number, option?:CardBuilderOptionType): CardBuilder {
    let builder = new CardBuilder
    builder.addButtons(ButtonDesigner.createEventCardBuilderButton(builderId, option))
    option?builder.setOption(option):null
    return builder
}
function createCardBuilder(subType:EventCardBuilderSubType, builderType: BuilderType): EventCardBuilder {
    let event = new EventCardBuilder
    event.cardSelector = generateCardSelector()
    event.cardSelector.cardInitialState = {selectable: false, buildable: true}
    event.subType = subType
    event.cardBuilder = []
    event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)

    let buildDiscountValue = 0
    switch(builderType){
        case('developmentAbilityOnly'):{
            event.cardBuilder.push(generateCardBuilder(0))
            break
        }
        case('development_base'):{
            buildDiscountValue = 3
            event.cardBuilder.push(generateCardBuilder(0))
            break
        }
        case('development_6mc'):{
            buildDiscountValue = 6
            event.cardBuilder.push(generateCardBuilder(0))
            break
        }
        case('development_second_card'):{
            buildDiscountValue = 3
            for(let i=0; i<=1; i++){
                event.cardBuilder.push(generateCardBuilder(i))
            }
            break
        }

        case('constructionAbilityOnly'):{
            event.cardBuilder.push(generateCardBuilder(0))
            break
        }
        case('construction_base'):{
            event.cardBuilder.push(generateCardBuilder(0))
            event.cardBuilder.push(generateCardBuilder(1,'drawCard'))
            break
        }
        case('construction_6mc'):{
            event.cardBuilder.push(generateCardBuilder(0))
            event.cardBuilder.push(generateCardBuilder(1,'gain6MC'))
            break
        }
        case('construction_draw_card'):{
            for(let i=0; i<=1; i++){event.cardBuilder.push(generateCardBuilder(i))}
            break
        }
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event builder type: ',event)}
    }

    switch(subType){
        case('developmentPhaseBuilder'):{
            event.title = 'Play Green cards :'
            event.cardSelector.filter = {type: ProjectFilterNameEnum.greenProject}
            break
        }
        case('constructionPhaseBuilder'):{
            event.title = 'Play Blue or Red cards'
            event.cardSelector.filter = {type: ProjectFilterNameEnum.blueOrRedProject}
            break
        }
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
    }

    event.buildDiscountValue = buildDiscountValue
    event.buildDiscountUsed = false

    return event
}
function createTargetCard(subType:EventTargetCardSubType, targetCardId:string, args?: CreateEventOptionsTargetCard): EventTargetCard {
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
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
    }
    event.button = ButtonDesigner.createEventMainButton(event.subType)
    return event
}
function createGeneric(subType:EventGenericSubType, args?: CreateEventOptionsGeneric): EventGeneric {
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
        case('addProduction'):{
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
            event.cardIdToBuild = args?.card
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
            event.lockRollbackButton = true
            event.lockSellButton = true
            event.lockValidateButton = true
            break
        }
        case('addForestPointAndOxygen'):{
            event.addForestPoint = args?.addForestPoint
            break
        }
        case('oceanQuery'):{
            event.gainOceanNumber = args?.oceanQueryNumber
            break
        }
        case('addTr'):{
            event.increaseTr = args?.increaseTr
            break
        }
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',subType, args)}
    }
    event.button = ButtonDesigner.createEventMainButton(event.subType)
    return event
}
function createDeckQueryEvent(subType:EventDeckQuerySubType, args?: CreateEventOptionsDeckQuery ) : EventDeckQuery {
    let event = new EventDeckQuery

    event.subType = subType
    switch(subType){
        case('scanKeepQuery'):{
            event.scanKeep = args?.scanKeep
			event.options = args?.scanKeepOptions
            break
        }
        case('drawQuery'):{
            event.drawDiscard = args?.drawDiscard
            event.isCardProduction = args?.isCardProduction
            break
        }
        case('researchPhaseQuery'):{
            event.scanKeep = args?.scanKeep
            break
        }
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
    }
    return event
}
function createWaiter(subType:EventWaiterSubType, waiterId: number) : EventWaiter {
    let event = new EventWaiter

    event.subType = subType
    switch(subType){
        case('deckWaiter'):{
            event.autoFinalize = false
            event.waiterId = waiterId
            event.lockSellButton = true
            event.lockRollbackButton = true
            event.lockValidateButton = true
            break
        }
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',event)}
    }
    return event
}
function createPhase(subType:EventPhaseSubType): EventPhase {
    let event = new EventPhase

    event.subType = subType
    switch(subType){
        case('productionPhase'):{
            event.autoFinalize = false
            event.productionApplied = false
            break
        }
        case('actionPhase'):{break}
        case('developmentPhase'):{break}
        case('constructionPhase'):{break}
        case('researchPhase'):{break}
        default:{Logger.logText('EVENT DESIGNER ERROR: Unmapped event creation: ',subType)}
    }
    event.button = ButtonDesigner.createEventMainButton(event.subType)
    return event
}
export const EventFactory = {
	simple: SimpleEvent,

    createCardSelector,
    createCardSelectorRessource,
    createCardActivator,
    createCardBuilder,
    createTargetCard,
    createGeneric,
    createDeckQueryEvent,
    createWaiter,
    createPhase,
	createScanKeepResult
}

export const __testOnly__ = {
	generateCardSelector,
	generateCardBuilder
}
