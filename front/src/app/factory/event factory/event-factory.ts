import { BuilderOption, DeckQueryOptionsEnum, DiscardOptionsEnum, GlobalParameterNameEnum, ProjectFilterNameEnum } from "../../enum/global.enum"
import { CardSelector, AdvancedRessourceStock, GlobalParameterValue, RessourceStock, ScanKeep, DrawDiscard } from "../../interfaces/global.interface"
import { PlayableCardModel } from "../../models/cards/project-card.model"
import { EventBaseModel, EventCardSelector, EventCardSelectorRessource, EventCardActivator, CardBuilder, EventCardBuilder, EventTargetCard, EventGeneric, EventDeckQuery, EventWaiter, EventPhase, EventComplexCardSelector, EventTagSelector } from "../../models/core-game/event.model"
import { EventCardSelectorSubType, EventCardActivatorSubType, EventCardBuilderSubType, EventTargetCardSubType, EventGenericSubType, EventDeckQuerySubType, EventWaiterSubType, EventPhaseSubType, EventComplexCardSelectorSubType } from "../../types/event.type"
import { MinMaxEqualType, TagType } from "../../types/global.type"
import { BuilderType } from "../../types/phase-card.type"
import { Logger } from "../../utils/utils"
import { ButtonDesigner } from "../button-designer.service"

type CardSelectorOptions = Partial<CardSelector>

interface CreateEventOptionsSelector {
    cardSelector?: CardSelectorOptions
    title?: string
    waiterId?:number,
}
interface CreateEventOptionsSelectorComplex extends CreateEventOptionsSelector {
	scanKeepOptions?: DeckQueryOptionsEnum,
	discardOptions?: DiscardOptionsEnum
}
interface CreateEventOptionsTargetCard {
    advancedRessource?: AdvancedRessourceStock | AdvancedRessourceStock []
	addTagToCard?: TagType
}
interface CreateEventOptionsGeneric {
    increaseParameter?: GlobalParameterValue
    baseRessource?: RessourceStock | RessourceStock[]
    scanKeep?: ScanKeep
    card?: PlayableCardModel
    drawEventResult?:string[]
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
	console.log(drawNumber)
	return EventFactory.createDeckQueryEvent('drawQuery', {drawDiscard:{draw:drawNumber,discard:0}})
}
function discard(discardNumber: number): EventComplexCardSelector {
	return EventFactory.createCardSelectorComplex("discardCards", {cardSelector: {selectionQuantity: discardNumber}})
}
function discardOptions(discardNumber: number, treshold: MinMaxEqualType, discardOptions: DiscardOptionsEnum): EventComplexCardSelector {
	return EventFactory.createCardSelectorComplex("discardCards", {
		cardSelector: {
			selectionQuantity: discardNumber,
			selectionQuantityTreshold: treshold
		},
		discardOptions: discardOptions
	})
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
function scanKeep(scanKeep: ScanKeep, options: DeckQueryOptionsEnum): EventBaseModel {
	return EventFactory.createDeckQueryEvent('scanKeepQuery',{
		scanKeep:{scan: scanKeep.scan, keep: scanKeep.keep},
		scanKeepOptions: options
	})
}
function scanKeepResult(cardList: PlayableCardModel[], keep: number, option: DeckQueryOptionsEnum, waiterId?: number): EventComplexCardSelector {
	return createCardSelectorComplex(
		'scanKeepResult',
		{
			cardSelector:{
				selectFrom:cardList,
				selectionQuantity: keep,
				selectionQuantityTreshold: 'max'
			},
			scanKeepOptions: option,
			waiterId: waiterId
		}
	)
}
function specialBuilder(option: BuilderOption): EventCardBuilder {
	return EventFactory.createCardBuilder('specialBuilder', 'specialBuilder', option)
}
function selectTag(cardCode: string) : EventTagSelector {
	return EventFactory.createTagSelector(cardCode)
}
function addTagToCard(cardCode: string, tag: TagType): EventTargetCard {
	return EventFactory.createTargetCard('addTagToCardId', cardCode, {addTagToCard:tag})
}
const SimpleEvent = {
	draw,
	discard,
	discardOptions,
	upgradePhaseCard,
	increaseGlobalParameter,
	addRessource,
	addRessourceToCardId,
	addRessourceToSelectedCard,
	increaseResearchScanKeep,
	deactivateTrigger,
	scanKeep,
	scanKeepResult,
	addProduction,
	addTR,
	addForestAndOxygen,
	specialBuilder,
	selectTag,
	addTagToCard,
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
function createCardSelectorComplex(subType: EventComplexCardSelectorSubType, args?:CreateEventOptionsSelectorComplex): EventComplexCardSelector {
	switch(subType){
		case('discardCards'):{
			return createDiscardOptionsResult(args)
		}
		case('scanKeepResult'):{
			return createScanKeepResult(
				args?.cardSelector?.selectFrom??[],
				args?.cardSelector?.selectionQuantity??0,
				args?.scanKeepOptions,
				args?.waiterId
			 )
		}
	}
}
function createDiscardOptionsResult(args?: CreateEventOptionsSelectorComplex): EventComplexCardSelector {
	let event = new EventComplexCardSelector
	let title = ''
    event.cardSelector = generateCardSelector(args?.cardSelector)
    event.subType = 'discardCards'
	event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
	switch(event.cardSelector.selectionQuantityTreshold){
		case('equal'):{
			title = args?.title? args.title: `Select ${args?.cardSelector?.selectionQuantity??0} card(s) to discard.`
			break
		}
		case('min'):{
			title = args?.title? args.title: `Select at least ${args?.cardSelector?.selectionQuantity??0} card(s) to discard.`
			break
		}
		case('max'):{
			title = args?.title? args.title: `Select up to ${args?.cardSelector?.selectionQuantity??0} card(s) to discard.`
			event.button.startEnabled = true
			event.button.resetStartEnabled()
			break
		}
	}
	event.title = title
	event.cardSelector.cardInitialState = args?.cardSelector?.cardInitialState?  args.cardSelector.cardInitialState:{selectable: true, ignoreCost: true}
	event.lockSellButton = true
	event.lockRollbackButton = true
	if(args?.discardOptions){
		event.discardOptions = args.discardOptions
	}
	console.log(event, `Select ${args?.cardSelector?.selectionQuantity??0} card(s) to discard.`)

	return event
}
function createScanKeepResult(cardList: PlayableCardModel[], keep: number, options?: DeckQueryOptionsEnum, waiter?: number): EventComplexCardSelector {
	switch(options){
		case(DeckQueryOptionsEnum.brainstormingSession):{
			let event = new EventComplexCardSelector
            event.title = `Gain 1MC if card is green or draw card if Red/Blue.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = keep
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.scanKeepOptions = options
			event.waiterId = waiter
			return event
		}
		case(DeckQueryOptionsEnum.celestior):{
			let event = new EventComplexCardSelector
            event.title = `Select a card with Event tag.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = keep
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.scanKeepOptions = options
			event.cardSelector.filter = {type: ProjectFilterNameEnum.hasTagEvent}
			event.waiterId = waiter
			event.cardSelector.stateFromParent = {selectable: true, ignoreCost: true}
			return event
		}
		case(DeckQueryOptionsEnum.devTechs):{
			let event = new EventComplexCardSelector
            event.title = `Select a green card.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = keep
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.scanKeepOptions = options
			event.cardSelector.filter = {type: ProjectFilterNameEnum.greenProject}
			event.waiterId = waiter
			event.cardSelector.stateFromParent = {selectable: true, ignoreCost: true}
			return event
		}
		case(DeckQueryOptionsEnum.advancedScreeningTechnology):{
			let event = new EventComplexCardSelector
            event.title = `Select a card with a Plant or Science tag.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'max'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = 1
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = true
			event.scanKeepOptions = options
			event.cardSelector.filter = {type: ProjectFilterNameEnum.hasTagPlantOrScience}
			event.waiterId = waiter
			event.cardSelector.stateFromParent = {selectable: true, ignoreCost: true}
			return event
		}
		case(DeckQueryOptionsEnum.inventionContest):{
			let event = new EventComplexCardSelector
            event.title = `Select one card to keep.`
            event.refreshSelectorOnSwitch = false
            event.cardSelector.selectionQuantityTreshold = 'equal'
			event.cardSelector.selectFrom = cardList
			event.cardSelector.selectionQuantity = 1
			event.subType = 'scanKeepResult'
			event.button = ButtonDesigner.createEventSelectorMainButton(event.subType)
			event.button.startEnabled = false
			event.scanKeepOptions = options
			event.cardSelector.filter = {type: ProjectFilterNameEnum.hasTagPlantOrScience}
			event.waiterId = waiter
			event.cardSelector.stateFromParent = {selectable: true, ignoreCost: true}
			return event
		}
		default:{
			console.error('UNHANDLED SCANKEEP OPTION: ', options)
			return new EventComplexCardSelector
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
function generateCardBuilder(builderId:number, option?:BuilderOption): CardBuilder {
    let builder = new CardBuilder
    builder.addButtons(ButtonDesigner.createEventCardBuilderButton(builderId, option))
    option?builder.setOption(option):null
    return builder
}
function createCardBuilder(subType:EventCardBuilderSubType, builderType: BuilderType, builderOption?: BuilderOption): EventCardBuilder {
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
            event.cardBuilder.push(generateCardBuilder(1,BuilderOption.drawCard))
            break
        }
        case('construction_6mc'):{
            event.cardBuilder.push(generateCardBuilder(0))
            event.cardBuilder.push(generateCardBuilder(1,BuilderOption.gain6MC))
            break
        }
        case('construction_draw_card'):{
            for(let i=0; i<=1; i++){event.cardBuilder.push(generateCardBuilder(i))}
            break
        }
		case('specialBuilder'):{
			switch(builderOption){
				case(BuilderOption.workCrews):{
					let builder = generateCardBuilder(0)
					builder.setOption(builderOption)
					event.cardBuilder.push(builder)
					buildDiscountValue = 11
					event.cardSelector.filter = {type: ProjectFilterNameEnum.blueOrRedProject}

					event.title = 'Play an additional Blue or Red card with a 11MC discount'
					break
				}
				case(BuilderOption.assetLiquidation):{
					let builder = generateCardBuilder(0)
					builder.setOption(builderOption)
					event.cardBuilder.push(builder)
					event.cardSelector.filter = {type: ProjectFilterNameEnum.blueOrRedProject}

					event.title = 'Play an additional Blue or Red card.'
					break

				}
				case(BuilderOption.green9MCFree):{
					let builder = generateCardBuilder(0)
					builder.setOption(builderOption)
					event.cardBuilder.push(builder)
					buildDiscountValue = 100
					event.cardSelector.filter = {type: ProjectFilterNameEnum.green9MCFree}

					event.title = "Play a green card which value is 9MC or less without paying it's cost"
					break
				}
				case(BuilderOption.assortedEnterprises):{
					let builder = generateCardBuilder(0)
					builder.setOption(builderOption)
					event.cardBuilder.push(builder)
					buildDiscountValue = 2

					event.title = "Play an additional card of any color with a 2MC discount"
					break
				}
				case(BuilderOption.selfReplicatingBacteria):{
					let builder = generateCardBuilder(0)
					builder.setOption(builderOption)
					event.cardBuilder.push(builder)
					buildDiscountValue = 25

					event.title = "Play a card of any color with a 25MC discount"
					break
				}
				case(BuilderOption.maiNiProductions):{
					let builder = generateCardBuilder(0)
					builder.setOption(builderOption)
					event.cardBuilder.push(builder)
					buildDiscountValue = 100
					event.cardSelector.filter = {type: ProjectFilterNameEnum.maiNiProductions}

					event.title = "Play a card of any color which value is 12MC or less without paying it's cost"
					break
				}
			}
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
		case('specialBuilder'):{
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
		case('addTagToCardId'):{
			if(args?.addTagToCard){
				event.addTag = args?.addTagToCard
			}
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
			event.title = 'Production'
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
function createTagSelector(cardCode: string): EventTagSelector {
	let event = new EventTagSelector
	event.subType = 'tagSelector'
	event.targetCardId = cardCode
	event.button = ButtonDesigner.createEventMainButton(event.subType)
	event.title = 'Select a tag to add to this card.'

	return event
}
export const EventFactory = {
	simple: SimpleEvent,

    createCardSelector,
    createCardSelectorRessource,
	createCardSelectorComplex,
    createCardActivator,
    createCardBuilder,
    createTargetCard,
    createGeneric,
    createDeckQueryEvent,
    createWaiter,
    createPhase,
	createTagSelector
}

export const __testOnly__ = {
	generateCardSelector,
	generateCardBuilder
}
