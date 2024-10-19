import { AdvancedRessourceStock, CardSelector } from "../../interfaces/global.interface"
import { EventCardBuilderButton, EventSecondaryButton } from "../../models/core-game/button.model"
import { CardBuilder, EventCardBuilder, EventCardSelector, EventCardSelectorRessource } from "../../models/core-game/event.model"
import { EventCardBuilderSubType, EventUnionSubTypes } from "../../types/event.type"
import { CardBuilderOptionType } from "../../types/global.type"
import { ButtonDesigner } from "./button-designer.service"
import { EventDesigner } from "./event-designer.service"


type CardSelectorOptions = Partial<CardSelector>

interface CreateEventOptionsSelector {
    cardSelector?: CardSelectorOptions
    title?: string
    waiterId?:number
}

describe('Service - Designers - Event', () => {
    describe('generateCardSelector', () => {
        describe('UNIT TEST', () => {
            it('should return default empty selector', () => {
                let emptySelector: CardSelector = {
                    selectFrom: [],
                    selectedList: [],
                    selectionQuantity: 0,
                    selectionQuantityTreshold: 'equal',
                    cardInitialState: undefined,
                    filter: undefined,
                    stateFromParent: undefined
                }

                let selector = EventDesigner['generateCardSelector']()
                
                expect(selector).toEqual(emptySelector)
            })
        })
    })
    describe('generateCardBuilder', () => {
        describe('UNIT TEST', () => {
            it('should return default card Builder', () => {
                let expectedCardBuilder = new CardBuilder
                let expectedBuilderSubType: EventCardBuilderSubType = 'constructionPhaseBuilder'
                const spy = spyOn(ButtonDesigner, 'createEventCardBuilderButton').and.returnValue([])
                expectedCardBuilder.addButtons([] as EventCardBuilderButton[])
                
                let builder = EventDesigner['generateCardBuilder'](0)

                expect(expectedCardBuilder).toEqual(builder)
            })
            it('should return default card Builder with option', () => {
                let expectedCardBuilder = new CardBuilder
                let expectedOption: CardBuilderOptionType = 'drawCard'
                const spy = spyOn(ButtonDesigner, 'createEventCardBuilderButton').and.returnValue([])
                expectedCardBuilder.addButtons([] as EventCardBuilderButton[])
                expectedCardBuilder['option'] = expectedOption
                
                let builder = EventDesigner['generateCardBuilder'](0, expectedOption)
                
                expect(expectedCardBuilder).toEqual(builder)
            })
        })
    })
    describe('createCardSelector Event', () => {
        let expectedSelector: CardSelector
        let expectedArgs: CreateEventOptionsSelector
        let expectedEvent: EventCardSelector
        let expectedSubType: EventUnionSubTypes
        let expectedWaiterId: number

        beforeEach(() => {
            expectedSelector = {
                selectFrom: [],
                selectedList: [],
                selectionQuantity: 0,
                selectionQuantityTreshold: 'equal',
                cardInitialState: undefined,
                filter: undefined,
                stateFromParent: undefined
            }

            expectedEvent = new EventCardSelector
            expectedEvent.button = undefined
            expectedEvent.cardSelector = expectedSelector
            expectedWaiterId = 5
        })
        describe('UNIT TEST', () => {
            it('should create a discardEvent selector', () => {
                expectedSubType = 'discardCards'
                expectedEvent.subType = expectedSubType
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')                
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                expectedEvent.title = `Select ${expectedEvent.cardSelector.selectionQuantity} card(s) to discard.`
                expectedEvent.locksEventpile = true

                let resultEvent = EventDesigner.createCardSelector(expectedSubType)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
            it('should create a discardEvent selector with initialState option', () => {
                expectedSubType = 'discardCards'
                expectedEvent.subType = expectedSubType
                expectedArgs = {cardSelector:{cardInitialState:{ignoreCost:true}}}
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')                
                expectedEvent.cardSelector.cardInitialState = expectedArgs.cardSelector?.cardInitialState
                expectedEvent.title = `Select ${expectedEvent.cardSelector.selectionQuantity} card(s) to discard.`
                expectedEvent.locksEventpile = true

                let resultEvent = EventDesigner.createCardSelector(expectedSubType, expectedArgs)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
            it('should create a selectCardForcedSell selector', () => {
                expectedSubType = 'selectCardForcedSell'
                expectedEvent.subType = expectedSubType
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')                
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                expectedEvent.cardSelector.selectionQuantityTreshold = 'min'

                let resultEvent = EventDesigner.createCardSelector(expectedSubType)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
            it('should create a selectCardOptionalSell selector', () => {
                expectedSubType = 'selectCardOptionalSell'
                expectedEvent.subType = expectedSubType
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')                
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}

                let resultEvent = EventDesigner.createCardSelector(expectedSubType)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
            it('should create a actionPhase selector', () => {
                expectedSubType = 'actionPhase'
                expectedEvent.subType = expectedSubType
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')                
                expectedEvent.cardSelector.cardInitialState = {activable: true, selectable: false, playable: false, ignoreCost:true}
                expectedEvent.title = 'Activate cards :'
                expectedEvent.cardSelector.filter = {type:"action"}

                let resultEvent = EventDesigner.createCardSelector(expectedSubType)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
            it('should create a researchPhaseResult selector', () => {
                expectedSubType = 'researchPhaseResult'
                expectedEvent.subType = expectedSubType
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')                
                expectedEvent.title = `Select ${expectedEvent.cardSelector.selectionQuantity} cards to draw`
                expectedEvent.cardSelector.cardInitialState = {selectable:true, ignoreCost: true}
                expectedEvent.cardSelector.selectionQuantityTreshold = 'equal'
                expectedEvent.refreshSelectorOnSwitch = false
                expectedEvent.waiterId = expectedWaiterId
                expectedArgs = {waiterId:expectedWaiterId}

                let resultEvent = EventDesigner.createCardSelector(expectedSubType, expectedArgs)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
        })
    })
    describe('createCardSelectorRessource Event', () => {
        let expectedSelector: CardSelector
        let expectedEvent: EventCardSelectorRessource
        let expectedSubType: EventUnionSubTypes
        let expectedWaiterId: number
        let expectedRessource: AdvancedRessourceStock

        beforeEach(() => {
            expectedSelector = {
                selectFrom: [],
                selectedList: [],
                selectionQuantity: 0,
                selectionQuantityTreshold: 'equal',
                cardInitialState: undefined,
                filter: undefined,
                stateFromParent: undefined
            }

            expectedEvent = new EventCardSelectorRessource
            expectedEvent.button = undefined
            expectedEvent.cardSelector = expectedSelector
            expectedWaiterId = 5
            expectedRessource = {name:'microbe', valueStock: 5}
        })
        describe('UNIT TEST', () => {
            it('should create a addRessourceToSelectedCard selector', () => {
                expectedSubType = 'addRessourceToSelectedCard'
                expectedEvent.subType = expectedSubType
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                expectedEvent.advancedRessource = expectedRessource
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                expectedEvent.title = `Select a card to add ${expectedRessource.valueStock} ${expectedRessource.name}(s).`
                expectedEvent.cardSelector.filter = {type:"stockable", value:expectedRessource.name}
                expectedEvent.cardSelector.selectionQuantity = 1
                expectedEvent.refreshSelectorOnSwitch = false

                let resultEvent = EventDesigner.createCardSelectorRessource(expectedRessource)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
        })
    })
    /*
    describe('createCardBuilder Event', () => {
        let expectedSelector: CardSelector
        let expectedBuilder: CardBuilder
        let expectedEvent: EventCardBuilder
        let expectedSubType: EventCardBuilderSubType

        beforeEach(() => {
            expectedEvent = new EventCardBuilder
            expectedEvent.button = undefined
            expectedEvent.cardSelector = expectedSelector
        })
        describe('UNIT TEST', () => {
            it('should create every CardBuilder selector', () => {
                expectedSubType = 'addRessourceToSelectedCard'
                expectedEvent.subType = expectedSubType
                const spy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                expectedEvent.advancedRessource = expectedRessource
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                expectedEvent.title = `Select a card to add ${expectedRessource.valueStock} ${expectedRessource.name}(s).`
                expectedEvent.cardSelector.filter = {type:"stockable", value:expectedRessource.name}
                expectedEvent.cardSelector.selectionQuantity = 1
                expectedEvent.refreshSelectorOnSwitch = false

                let resultEvent = EventDesigner.createCardSelectorRessource(expectedRessource)

                expect(expectedEvent).toEqual(resultEvent)
                expect(spy).toHaveBeenCalled()
            })
        })
    })
        */
})