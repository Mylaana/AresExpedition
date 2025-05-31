import { AdvancedRessourceStock, CardSelector, DrawDiscard, GlobalParameterValue, RessourceStock, ScanKeep } from "../../interfaces/global.interface"
import { EventCardBuilderButton } from "../../models/core-game/button.model"
import { CardBuilder, EventCardActivator, EventCardBuilder, EventCardSelector, EventCardSelectorRessource, EventDeckQuery, EventGeneric, EventPhase, EventTargetCard, EventWaiter } from "../../models/core-game/event.model"
import { EventCardBuilderSubType, EventCardSelectorSubType, EventDeckQuerySubType, EventGenericSubType, EventPhaseSubType, EventTargetCardSubType, EventUnionSubTypes, EventWaiterSubType } from "../../types/event.type"
import { CardBuilderOptionType } from "../../types/global.type"
import { ButtonDesigner } from "./button-designer.service"
import { EventDesigner } from "./event-designer.service"
import { BuilderType } from "../../types/phase-card.type"
import { PlayableCardModel } from "../../models/cards/project-card.model"
import { Utils } from "../../utils/utils"
import { GlobalParameterNameEnum } from "../../enum/global.enum"


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
describe('Service - Designers - Event', () => {
    describe('generateCardSelector', () => {
        describe('UNIT TEST', () => {
            it('should return default empty selector', () => {
                let expectedSelector: CardSelector = {
                    selectFrom: [],
                    selectedList: [],
                    selectionQuantity: 0,
                    selectionQuantityTreshold: 'equal',
                    cardInitialState: undefined,
                    filter: undefined,
                    stateFromParent: undefined
                }

                let selector = EventDesigner['generateCardSelector']()

                expect(selector).toEqual(expectedSelector)
            })
            it('should return selector', () => {
                let card = new PlayableCardModel
                card.id = 3
                let expectedSelector: CardSelector = {
                    selectFrom: [card],
                    selectedList: [card],
                    selectionQuantity: 3,
                    selectionQuantityTreshold: 'min',
                    cardInitialState: {activable:true, selectable:true},
                    filter: {type:'action'},
                    stateFromParent: {selected:false}
                }

                let selector = EventDesigner['generateCardSelector'](expectedSelector)

                expect(selector).toEqual(expectedSelector)
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
                expect(spy).toHaveBeenCalled()
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

            it('should create a discardEvent selector Event', () => {
                expectedSubType = 'discardCards'
                expectedEvent.subType = expectedSubType
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                expectedEvent.title = `Select ${expectedEvent.cardSelector.selectionQuantity} card(s) to discard.`
				expectedEvent.lockRollbackButton = true
				expectedEvent.lockSellButton = true

                let resultEvent = EventDesigner.createCardSelector(expectedSubType)

                expect(expectedEvent).toEqual(resultEvent)
                expect(buttonSpy).toHaveBeenCalled()
            })

            it('should create a discardEvent selector with initialState option', () => {
                expectedSubType = 'discardCards'
                expectedEvent.subType = expectedSubType
                expectedArgs = {cardSelector:{cardInitialState:{ignoreCost:true}}}
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                expectedEvent.cardSelector.cardInitialState = expectedArgs.cardSelector?.cardInitialState
                expectedEvent.title = `Select ${expectedEvent.cardSelector.selectionQuantity} card(s) to discard.`
                expectedEvent.lockRollbackButton = true
				expectedEvent.lockSellButton = true

                let resultEvent = EventDesigner.createCardSelector(expectedSubType, expectedArgs)

                expect(expectedEvent).toEqual(resultEvent)
                expect(buttonSpy).toHaveBeenCalled()
            })
            it('should create a selectCardForcedSell selector Event', () => {
                expectedSubType = 'selectCardForcedSell'
                expectedEvent.subType = expectedSubType
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}
                expectedEvent.cardSelector.selectionQuantityTreshold = 'min'
				expectedEvent.lockRollbackButton = true
				expectedEvent.lockSellButton = true

                let resultEvent = EventDesigner.createCardSelector(expectedSubType)

                expect(expectedEvent).toEqual(resultEvent)
                expect(buttonSpy).toHaveBeenCalled()
            })
            it('should create a selectCardOptionalSell selector Event', () => {
                expectedSubType = 'selectCardOptionalSell'
				expectedEvent.title = 'Select any number of cards to sell'
                expectedEvent.subType = expectedSubType
				expectedSelector.selectionQuantity = 1
				expectedSelector.selectionQuantityTreshold = 'min'

                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                expectedEvent.cardSelector.cardInitialState = {selectable: true, ignoreCost: true}

                let resultEvent = EventDesigner.createCardSelector(expectedSubType)

                expect(expectedEvent).toEqual(resultEvent)
                expect(buttonSpy).toHaveBeenCalled()
            })
            it('should create a researchPhaseResult selector Event', () => {
                expectedSubType = 'researchPhaseResult'
                expectedEvent.subType = expectedSubType
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                expectedEvent.title = `Select ${expectedEvent.cardSelector.selectionQuantity} cards to draw`
                expectedEvent.cardSelector.cardInitialState = {selectable:true, ignoreCost: true}
                expectedEvent.cardSelector.selectionQuantityTreshold = 'equal'
                expectedEvent.refreshSelectorOnSwitch = false
                expectedEvent.waiterId = expectedWaiterId
                expectedArgs = {waiterId:expectedWaiterId}

                let resultEvent = EventDesigner.createCardSelector(expectedSubType, expectedArgs)

                expect(expectedEvent).toEqual(resultEvent)
                expect(buttonSpy).toHaveBeenCalled()
            })

            it('should log an error message and return a default Event', () => {
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                const logTextSpy = spyOn(Utils, 'logText')
                expectedSubType = 'fake' as EventCardSelectorSubType

                let event = EventDesigner.createCardSelector(expectedSubType)

                expect(event).toBeDefined()
                expect(logTextSpy).toHaveBeenCalled()
                expect(buttonSpy).toHaveBeenCalled()
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
            it('should create a addRessourceToSelectedCard selector Event', () => {
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
    describe('createCardBuilder Event', () => {
        let expectedSelector: CardSelector
        let expectedBuilder: CardBuilder
        let expectedEvent: EventCardBuilder
        let expectedSubType: EventCardBuilderSubType

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

            expectedEvent = new EventCardBuilder
            expectedEvent.button = undefined
            expectedEvent.cardSelector = expectedSelector
			expectedBuilder = new CardBuilder
        })
        describe('UNIT TEST', () => {
            it('should create every development card builder Event', () => {
                let expectedBuilderType: BuilderType[] = ['developmentAbilityOnly', 'development_6mc', 'development_base', 'development_second_card']

                expectedSubType = 'developmentPhaseBuilder'
                expectedEvent.subType = expectedSubType
                expectedEvent.cardSelector = expectedSelector
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                const cardBuilderSpy = spyOn<any>(EventDesigner, 'generateCardBuilder').and.returnValue(new CardBuilder)
                expectedEvent.cardSelector.cardInitialState = {selectable: false, buildable: true}
                expectedEvent.refreshSelectorOnSwitch = false
                expectedEvent.buildDiscountUsed = false

                expectedEvent.title = 'Play Green cards :'
                expectedEvent.refreshSelectorOnSwitch = true
                expectedEvent.button = undefined
                expectedEvent.cardSelector.filter = {type:'development'}
                expectedEvent.cardBuilder.push(expectedBuilder)


                for(let builderType of expectedBuilderType){
                    switch(builderType){
                        case('developmentAbilityOnly'):{
                            expectedEvent.buildDiscountValue = 0
                            break
                        }
                        case('development_base'):{
                            expectedEvent.buildDiscountValue = 3
                            break
                        }
                        case('development_6mc'):{
                            expectedEvent.buildDiscountValue = 6
                            break
                        }
                        case('development_second_card'):{
                            expectedEvent.buildDiscountValue = 3
                            expectedEvent.cardBuilder.push(expectedBuilder)
                            break
                        }
                    }

                    let resultEvent = EventDesigner.createCardBuilder(expectedSubType, builderType)

                    expect(expectedEvent).toEqual(resultEvent)
                    expect(buttonSpy).toHaveBeenCalled()
                    expect(cardBuilderSpy).toHaveBeenCalled()
                }
            })
            it('should create every construction card builder Event', () => {
                let expectedBuilderType: BuilderType[] = ['constructionAbilityOnly', 'construction_6mc', 'construction_base', 'construction_draw_card']

                expectedSubType = 'constructionPhaseBuilder'
                expectedEvent.subType = expectedSubType
                expectedEvent.cardSelector = expectedSelector
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
                const cardBuilderSpy = spyOn<any>(EventDesigner, 'generateCardBuilder').and.returnValue(new CardBuilder)
                expectedEvent.cardSelector.cardInitialState = {selectable: false, buildable: true}
                expectedEvent.refreshSelectorOnSwitch = false
                expectedEvent.buildDiscountUsed = false
                expectedEvent.title = 'Play Blue or Red cards'
                expectedEvent.refreshSelectorOnSwitch = true
                expectedEvent.button = undefined
                expectedEvent.cardSelector.filter = {type:'construction'}
                expectedEvent.cardBuilder.push(expectedBuilder)
                expectedEvent.buildDiscountValue = 0


                for(let builderType of expectedBuilderType){
                    switch(builderType){
                        case('constructionAbilityOnly'):{
                            break
                        }
                        case('construction_6mc'):{
                            expectedEvent.cardBuilder = []
                            expectedEvent.cardBuilder.push(expectedBuilder)
                            expectedEvent.cardBuilder.push(expectedBuilder)
                            break
                        }
                        case('construction_base'):{
                            expectedEvent.cardBuilder = []
                            expectedEvent.cardBuilder.push(expectedBuilder)
                            expectedEvent.cardBuilder.push(expectedBuilder)
                            break
                        }
                        case('construction_draw_card'):{
                            expectedEvent.cardBuilder = []
                            expectedEvent.cardBuilder.push(expectedBuilder)
                            expectedEvent.cardBuilder.push(expectedBuilder)
                            break
                        }
                    }

                    let resultEvent = EventDesigner.createCardBuilder(expectedSubType, builderType)

                    expect(expectedEvent).toEqual(resultEvent)
                    expect(buttonSpy).toHaveBeenCalled()
                    expect(cardBuilderSpy).toHaveBeenCalled()
                }
            })
            it('should log an error message and return a default Event', () => {
                const logTextSpy = spyOn(Utils, 'logText')
                const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')

                expectedSubType = 'fake' as EventCardBuilderSubType
                let builderType = 'fake' as BuilderType
                expectedEvent.subType = expectedSubType

                let event = EventDesigner.createCardBuilder(expectedSubType, builderType)

                expect(event).not.toBeUndefined()
                expect(buttonSpy).toHaveBeenCalled()
                expect(logTextSpy).toHaveBeenCalled()
            })
        })
		describe('createCardSelector Event', () => {
			let expectedSelector: CardSelector
			let expectedArgs: CreateEventOptionsSelector
			let expectedEvent: EventCardActivator
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

				expectedEvent = new EventCardActivator
				expectedEvent.button = undefined
				expectedEvent.cardSelector = expectedSelector
				expectedWaiterId = 5
			})
			describe('UNIT TEST', () => {
				it('should create a actionPhase activator Event', () => {
					expectedSelector = {
						selectFrom: [],
						selectedList: [],
						selectionQuantity: 0,
						selectionQuantityTreshold: 'equal',
						cardInitialState: undefined,
						filter: undefined,
						stateFromParent: undefined
					}
					expectedEvent.doubleActivationCount = 0
					expectedEvent.cardSelector = expectedSelector
					expectedSubType = 'actionPhaseActivator'
					expectedEvent.subType = 'actionPhaseActivator'
					const buttonSpy = spyOn(ButtonDesigner, 'createEventSelectorMainButton')
					expectedEvent.cardSelector.cardInitialState = {activable: true, selectable: false, buildable: false, ignoreCost:true}
					expectedEvent.title = 'Activate cards'
					expectedEvent.cardSelector.filter = {type:"action"}

					let resultEvent = EventDesigner.createCardActivator(expectedSubType)

					expect(expectedEvent).toEqual(resultEvent)
					expect(buttonSpy).toHaveBeenCalled()
				})
			})
		})
    })
    describe('createTargetCard Event', () => {
        let expectedEvent: EventTargetCard
        let expectedSubType: EventTargetCardSubType
        let expectedCardId: string

        beforeEach(() => {
            expectedEvent = new EventTargetCard
            expectedEvent.button = undefined
            expectedCardId = '253'
        })
        describe('UNIT TEST', () => {
            it('should create a addRessourceToCardId target Event', () => {
                let expectedRessource: AdvancedRessourceStock = {name:'animal', valueStock:4}
                expectedEvent.advancedRessource = expectedRessource
                expectedSubType = 'addRessourceToCardId'
                expectedEvent.subType = expectedSubType
                expectedEvent.targetCardId = expectedCardId
                const buttonSpy = spyOn(ButtonDesigner, 'createEventMainButton')

                let event = EventDesigner.createTargetCard(expectedSubType, expectedCardId, {advancedRessource:expectedRessource})

                expect(event).toEqual(expectedEvent)
                expect(buttonSpy).toHaveBeenCalled()
            })
            it('should create a deactivateTrigger target Event', () => {
                expectedSubType = 'deactivateTrigger'
                expectedEvent.subType = expectedSubType
                expectedEvent.targetCardId = expectedCardId
                const buttonSpy = spyOn(ButtonDesigner, 'createEventMainButton')

                let event = EventDesigner.createTargetCard(expectedSubType, expectedCardId)

                expect(event).toEqual(expectedEvent)
                expect(buttonSpy).toHaveBeenCalled()
            })
            it('should log an error message and return a default Event', () => {
                const logTextSpy = spyOn(Utils, 'logText')
                const buttonSpy = spyOn(ButtonDesigner, 'createEventMainButton')
                expectedSubType = 'fake' as EventTargetCardSubType

                let event = EventDesigner.createTargetCard(expectedSubType, expectedCardId)

                expect(event).toBeDefined()
                expect(buttonSpy).toHaveBeenCalled()
                expect(logTextSpy).toHaveBeenCalled()
            })
        })
    })
    describe('createGeneric Event', () => {
        let expectedEvent: EventGeneric
        let expectedSubType: EventGenericSubType
        let expectedArgs: CreateEventOptionsGeneric

        beforeAll(() => {
            const buttonSpy = spyOn(ButtonDesigner, 'createEventMainButton')
        })
        describe('UNIT TEST', () => {
            it('should create every Generic Event', () => {
                let genericSubTypeList: EventGenericSubType[] = ['addRessourceToPlayer','buildCard','drawResult','endOfPhase','increaseGlobalParameter','increaseResearchScanKeep','planificationPhase','upgradePhaseCards']

                for(let genericSubType of genericSubTypeList){
                    expectedSubType = genericSubType
                    expectedEvent = new EventGeneric
                    expectedEvent.button = undefined
                    expectedEvent.subType = expectedSubType

                    switch(genericSubType){
                        case('addRessourceToPlayer'):{
                            let expectedRessource: RessourceStock = {name:'heat', valueStock:7}
                            expectedEvent.baseRessource = expectedRessource
                            expectedArgs = {baseRessource:expectedRessource}
                            break
                        }
                        case('endOfPhase'):{
                            break
                        }
                        case('drawResult'):{
                            let expectedDrawResult: number[] = [5, 227, 3]
                            let expectedWaiterId = 7
                            expectedEvent.drawResultList = expectedDrawResult
                            expectedEvent.waiterId = expectedWaiterId
                            expectedArgs = {drawEventResult:expectedDrawResult, waiterId:expectedWaiterId}
                            break
                        }
                        case('increaseGlobalParameter'):{
                            let expectedParameterIncrease: GlobalParameterValue = {name:GlobalParameterNameEnum.infrastructure, steps: 5}
                            expectedEvent.increaseParameter = expectedParameterIncrease
                            expectedArgs = {increaseParameter:expectedParameterIncrease}
                            break
                        }
                        case('increaseResearchScanKeep'):{
                            let expectedScanKeep: ScanKeep = {keep:0, scan:3}
                            expectedEvent.increaseResearchScanKeep = expectedScanKeep
                            expectedArgs = {scanKeep:expectedScanKeep}
                            break
                        }
                        case('planificationPhase'):{
                            expectedEvent.autoFinalize = false
							expectedEvent.title = 'Select a phase card:'
                            break
                        }
                        case('upgradePhaseCards'):{
                            let expectedList = [0,3]
                            let expectedQuantity = 2
                            expectedEvent.title = 'Select a phase card to upgrade'
                            expectedEvent.autoFinalize = false
                            expectedEvent.phaseCardUpgradeList = expectedList
                            expectedEvent.phaseCardUpgradeQuantity = expectedQuantity
                            expectedArgs = {phaseCardUpgradeList:expectedList, phaseCardUpgradeNumber:expectedQuantity}
                            break
                        }
                        default:{
                            continue
                        }
                    }

                    let event = EventDesigner.createGeneric(genericSubType, expectedArgs?expectedArgs:undefined)

                    expect(event).toEqual(expectedEvent)
                }
            })
            it('should log an error message and return a default Event', () => {
                const logTextSpy = spyOn(Utils, 'logText')
                expectedSubType = 'fake' as EventGenericSubType

                let event = EventDesigner.createGeneric(expectedSubType)

                expect(event).toBeDefined()
                expect(logTextSpy).toHaveBeenCalled()
            })
        })
    })
    describe('createDeckQuery Event', () => {
        let expectedEvent: EventDeckQuery
        let expectedSubType: EventDeckQuerySubType
        let expectedScanKeep: ScanKeep
        let expectedDrawDiscard: DrawDiscard

        beforeEach(() => {
            expectedEvent = new EventDeckQuery
            expectedScanKeep = {scan: 7, keep:2}
            expectedDrawDiscard = {discard: 1, draw: 4}
        })
        describe('UNIT TEST', () => {
            it('should create a scanKeepQuery target Event', () => {
                expectedSubType = 'scanKeepQuery'
                expectedEvent.subType = expectedSubType
                expectedEvent.scanKeep = expectedScanKeep

                let event = EventDesigner.createDeckQueryEvent(expectedSubType, {scanKeep:expectedScanKeep})

                expect(event).toEqual(expectedEvent)
            })
            it('should create a drawQuery target Event', () => {
                expectedSubType = 'drawQuery'
                expectedEvent.subType = expectedSubType
                expectedEvent.drawDiscard = expectedDrawDiscard
				expectedEvent.isCardProduction = false

                let event = EventDesigner.createDeckQueryEvent(expectedSubType, {drawDiscard:expectedDrawDiscard, isCardProduction: false})

                expect(event).toEqual(expectedEvent)
            })
            it('should create a researchPhaseQuery target Event', () => {
                expectedSubType = 'researchPhaseQuery'
                expectedEvent.subType = expectedSubType
                expectedEvent.scanKeep = expectedScanKeep

                let event = EventDesigner.createDeckQueryEvent(expectedSubType, {scanKeep:expectedScanKeep})

                expect(event).toEqual(expectedEvent)
            })
            it('should log an error message and return a default Event', () => {
                const logTextSpy = spyOn(Utils, 'logText')
                expectedSubType = 'fake' as EventDeckQuerySubType

                let event = EventDesigner.createDeckQueryEvent(expectedSubType)

                expect(event).toBeDefined()
                expect(logTextSpy).toHaveBeenCalled()
            })
        })
    })
    describe('createWaiter Event', () => {
        let expectedEvent: EventWaiter
        let expectedSubType: EventWaiterSubType
        let expectedWaiterId: number

        beforeEach(() => {
            expectedEvent = new EventWaiter
            expectedWaiterId = 3
        })
        describe('UNIT TEST', () => {
            it('should create a deckWaiter Event', () => {
                expectedSubType = 'deckWaiter'
                expectedEvent.subType = expectedSubType
                expectedEvent.waiterId = expectedWaiterId
                expectedEvent.autoFinalize = false
				expectedEvent.lockRollbackButton = true
				expectedEvent.lockSellButton = true
				expectedEvent.lockValidateButton = true

                let event = EventDesigner.createWaiter(expectedSubType, expectedWaiterId)

                expect(event).toEqual(expectedEvent)
            })
            it('should log an error message and return a default Event', () => {
                const logTextSpy = spyOn(Utils, 'logText')

                expectedSubType = 'fake' as EventWaiterSubType

                let event = EventDesigner.createWaiter(expectedSubType, expectedWaiterId)

                expect(event).toBeDefined()
                expect(logTextSpy).toHaveBeenCalled()
            })
        })
    })
    describe('createPhase Event', () => {
        let expectedEvent: EventPhase
        let expectedSubType: EventPhaseSubType

        describe('UNIT TEST', () => {
            it('should create every Event', () => {
                let expectedSubTypeList: EventPhaseSubType[] = ['constructionPhase', 'developmentPhase', 'productionPhase', 'researchPhase']
                const buttonSpy = spyOn(ButtonDesigner, 'createEventMainButton')
                const logTextSpy = spyOn(Utils, 'logText')

                for(expectedSubType of expectedSubTypeList){
                    expectedEvent = new EventPhase
                    expectedEvent.subType = expectedSubType
                    expectedEvent.button = undefined

                    switch(expectedSubType){
                        case('constructionPhase'):case('developmentPhase'):case('researchPhase'):{
                            break
                        }
						case('productionPhase'):{
							expectedEvent.autoFinalize = false
							expectedEvent.productionApplied = false
						}
                    }

                    let event = EventDesigner.createPhase(expectedSubType)

                    expect(event).toEqual(expectedEvent)
                    expect(buttonSpy).toHaveBeenCalled()
                }
            })
            it('should log an error message and return a default Event', () => {
                const buttonSpy = spyOn(ButtonDesigner, 'createEventMainButton')
                const logTextSpy = spyOn(Utils, 'logText')
                expectedSubType = 'fake' as EventPhaseSubType

                let event = EventDesigner.createPhase(expectedSubType)

                expect(event).toBeDefined()
                expect(buttonSpy).toHaveBeenCalled()
                expect(logTextSpy).toHaveBeenCalled()
            })
        })
    })
})
