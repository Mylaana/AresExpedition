import { EventCardBuilderButton, EventMainButton, EventMainButtonSelector } from "../../models/core-game/button.model"
import { EventUnionSubTypes } from "../../types/event.type"
import { ButtonDesigner } from "./button-designer.service"

describe('Service - Designers - Button', () => {
    describe('getStartEnabled', () => {
        describe('UNIT TEST', () => {
            let expectedSubType: EventUnionSubTypes

            it('should return true for listed cases', () => {
                let expectedSubTypeList: EventUnionSubTypes[] = [
                    'default',
                    'createEventOptionalSell',
                    'cancelEventOptionalSell',
                    'upgradePhaseCards',
                    'developmentPhaseBuilder',
                    'actionPhase',
                    'selectCardOptionalSell',
                ]
                for(expectedSubType of expectedSubTypeList){
                    let startEnabled = ButtonDesigner['getStartEnabled'](expectedSubType)

                    expect(startEnabled).toBeTrue()
                }
                
            })
            it('should return false for other cases', () => {
                let startEnabled = ButtonDesigner['getStartEnabled']('fake' as EventUnionSubTypes)

                expect(startEnabled).toBeFalse()
            })
        })
    })
    describe('getCaption', () => {
        describe('UNIT TEST', () => {
            let expectedSubType: EventUnionSubTypes

            it('should return a specific caption for listed cases', () => {
                let expectedSubTypeList: EventUnionSubTypes[] = [
                    'default',
                    'planificationPhase',
                    'createEventOptionalSell',
                    'cancelEventOptionalSell',
                    'upgradePhaseCards',
                    'developmentPhaseBuilder',
                    'addRessourceToSelectedCard',
                    'actionPhase',
                    'researchPhaseResult',
                    'selectCardForcedSell',
                    'selectCardOptionalSell',
                    'discardCards',
                    'scanKeepResult'
                ]
                for(expectedSubType of expectedSubTypeList){
                    let caption = ButtonDesigner['getCaption'](expectedSubType)

                    expect(caption).not.toEqual('default validation')
                    expect(caption).toBeDefined()
                }               
            })
            it('should return default caption for other cases', () => {
                expectedSubType = 'fake' as EventUnionSubTypes
                let caption = ButtonDesigner['getCaption'](expectedSubType)

                expect(caption).toEqual('default validation')
                expect(caption).toBeDefined()
            })
        })
    })
    describe('createEventMainButton', () => {
        describe('UNIT TEST', () => {
            let expectedSubType: EventUnionSubTypes
            let expectedButton: EventMainButton

            it('should return a main event button', () => {
                expectedSubType = 'scanKeepResult'
                expectedButton = new EventMainButton
                expectedButton.caption = 'caption'
                expectedButton.eventSubType = expectedSubType
                expectedButton.startEnabled = true
                expectedButton.enabled = expectedButton.startEnabled
                const captionSpy = spyOn<any>(ButtonDesigner, 'getCaption').and.returnValue('caption')
                const startEnabledSpy = spyOn<any>(ButtonDesigner, 'getStartEnabled').and.returnValue(true)

                let button = ButtonDesigner.createEventMainButton(expectedSubType)

                expect(button).toEqual(expectedButton)
                expect(captionSpy).toHaveBeenCalled()
                expect(startEnabledSpy).toHaveBeenCalled()
            })
        })
        describe('INTEGRATION TEST', () => {
            let expectedSubType: EventUnionSubTypes
            let expectedButton: EventMainButton

            it('should return a valid main event button', () => {
                expectedSubType = 'selectCardForcedSell'
                expectedButton = new EventMainButton
                expectedButton.caption = 'Sell selection'
                expectedButton.eventSubType = expectedSubType
                expectedButton.startEnabled = false
                expectedButton.enabled = expectedButton.startEnabled

                let button = ButtonDesigner.createEventMainButton(expectedSubType)

                expect(button).toEqual(expectedButton)
                
            })
        })
    })
    describe('createEventSelectorMainButton', () => {
        describe('UNIT TEST', () => {
            let expectedSubType: EventUnionSubTypes
            let expectedButton: EventMainButtonSelector

            it('should return a main event button selector', () => {
                expectedSubType = 'scanKeepResult'
                expectedButton = new EventMainButtonSelector
                expectedButton.caption = 'Add selection to hand'
                expectedButton.eventSubType = expectedSubType
                expectedButton.startEnabled = true
                expectedButton.enabled = expectedButton.startEnabled
                const captionSpy = spyOn<any>(ButtonDesigner, 'getCaption').and.returnValue('Add selection to hand')
                const startEnabledSpy = spyOn<any>(ButtonDesigner, 'getStartEnabled').and.returnValue(true)

                let button = ButtonDesigner.createEventSelectorMainButton(expectedSubType)

                expect(button).toEqual(expectedButton)
                expect(captionSpy).toHaveBeenCalled()
                expect(startEnabledSpy).toHaveBeenCalled()
            })
        })
        describe('INTEGRATION TEST', () => {
            let expectedSubType: EventUnionSubTypes
            let expectedButton: EventMainButtonSelector

            it('should return a main event button selector', () => {
                expectedSubType = 'selectCardForcedSell'
                expectedButton = new EventMainButtonSelector
                expectedButton.caption = 'Sell selection'
                expectedButton.eventSubType = expectedSubType
                expectedButton.startEnabled = false
                expectedButton.enabled = expectedButton.startEnabled

                let button = ButtonDesigner.createEventSelectorMainButton(expectedSubType)

                expect(button).toEqual(expectedButton)
            })
        })
    })
    describe('createEventCardBuilderButton', () => {
        describe('UNIT TEST', () => {
            let expectedZoneId: number
            let buttonNames: string[]

            beforeEach(() => {
                expectedZoneId = 1
                buttonNames = ['selectCard','cancelCard','buildCard','gain6MC','drawCard']
            })

            it('should return a card builder event button list', () => {
                let buttons = ButtonDesigner.createEventCardBuilderButton(expectedZoneId)

                expect(buttons.length).toEqual(3)
                for(let i=0; i<3; i++){
                    expect(buttons[i].name).toEqual(buttonNames[i])    
                }
            })
            it('should return a card builder event button list with gain6MC option', () => {
                let buttons = ButtonDesigner.createEventCardBuilderButton(expectedZoneId, 'gain6MC')

                expect(buttons.length).toEqual(4)
                for(let i=0; i<4; i++){
                    expect(buttons[i].name).toEqual(buttonNames[i])    
                }
            })
            it('should return a card builder event button list with drawCard option', () => {
                let buttons = ButtonDesigner.createEventCardBuilderButton(expectedZoneId, 'drawCard')

                expect(buttons.length).toEqual(4)
                for(let i=0; i<3; i++){
                    expect(buttons[i].name).toEqual(buttonNames[i])    
                }
                expect(buttons[3].name).toEqual(buttonNames[4])
            })
        })

    })
})