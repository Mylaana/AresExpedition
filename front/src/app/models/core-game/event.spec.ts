import { ProjectCardInfoService } from "../../services/cards/project-card-info.service";
import { ButtonDesigner } from "../../services/designers/button-designer.service";
import { EventCardBuilderButtonNames } from "../../types/global.type";
import { ProjectCardModel } from "../cards/project-card.model";
import { EventCardBuilderButton } from "./button.model";
import { CardBuilder, EventBaseCardSelector, EventBaseModel, EventCardBuilder } from "./event.model";


class testEventBaseModel extends EventBaseModel{}
class testEventBaseCardSelector extends EventBaseCardSelector{}
describe('Models - Event', () => {
    describe('EventBaseModel', () => {
        describe('UNIT TEST', () => {
            let event: testEventBaseModel

            beforeAll(() => {
                event = new testEventBaseModel
            })
            it('should evaluate hasSelector', () => {
                expect(event.hasSelector()).toBeFalse()
            })
            it('should evaluate hasCardBuilder', () => {
                expect(event.hasCardBuilder()).toBeFalse()
            })
            it('should evaluate getSelectionActive', () => {
                expect(event.getSelectionActive()).toBeFalse()
            })
        })
    })
    describe('EventBaseCardSelector', () =>{
        describe('UNIT TEST', () =>{
            let event: testEventBaseCardSelector

            beforeEach(() => {
                event = new testEventBaseCardSelector
            })
            it('should evaluate hasSelector', () => {
                expect(event.hasSelector()).toBeTrue()
            })
            it('should evaluate hasCardBuilder', () => {
                expect(event.hasCardBuilder()).toBeFalse()
            })
            it('should evaluate getSelectionActive', () => {
                expect(event.getSelectionActive()).toBeFalse()
            })
            it('should evaluate getSelection as false', () =>{
                expect(event.getSelectionActive()).toEqual(false)
            })
            it('should evaluate activateSelection setting selectionActive as true', () =>{
                event.activateSelection()
                expect(event['selectionActive']).toEqual(true)
             })
            it('should evaluate deactivateSelection setting selectionActive as false', () =>{
                event['selectionActive'] = true
                event.deactivateSelection()
                expect(event['selectionActive']).toEqual(false)
            })
        })
        describe('INTEGRATION TEST', () =>{
            let event: testEventBaseCardSelector
            let cardInfoService: ProjectCardInfoService

            beforeAll(() => {
                event = new testEventBaseCardSelector
                cardInfoService = new ProjectCardInfoService
            })
            it('should evaluate updateCardSelection', () => {
                let testCardId = 263
                event.updateCardSelection(cardInfoService.getProjectCardList([testCardId]))
                expect(event.cardSelector.selectedList.length).toEqual(1)
                expect(event.cardSelector.selectedList[0].id).toEqual(testCardId)
            })
        })
    })
    describe('CardBuilder', () => {
        describe('UNIT TEST', () =>{
            let builder: CardBuilder

            beforeEach(() => {
                builder = new CardBuilder
            })
            it('should evaluate getButtons returning empty list', () => {
                expect(builder.getButtons()).toEqual([])
            })
            it('should evaluate getOptions being undefined', () => {
                expect(builder.getOption()).toBeUndefined()
            })
            it('should evaluate setOptions', () => {
                builder.setOption('gain6MC')
                expect(builder.getOption()).toEqual('gain6MC')
            })
            it('should evaluate getCardSelected returning undefined', () => {
                expect(builder.getSelectedCard()).toBeUndefined()
            })
            it('should evaluate setCardSelected', () => {
                let card = new ProjectCardModel
                builder.setSelectedCard(card)
                expect(builder.getSelectedCard()).toEqual(card)
            })
            it('should evaluate removeSelectedCard', () => {
                let card = new ProjectCardModel
                builder.setSelectedCard(card)
                expect(builder.getSelectedCard()).toEqual(card)
                builder.removeSelectedCard()
                expect(builder.getSelectedCard()).toBeUndefined()
            })
            it('should evaluate getbuilderIsLocked returning false', () => {
                expect(builder.getbuilderIsLocked()).toEqual(false)
            })
            it('should evaluate setCardBuilt returning false', () => {
                builder.setbuilderIsLocked()
                expect(builder.getbuilderIsLocked()).toEqual(true)
            })
        })
        describe('INTEGRATION TEST', () => {
            let builder: CardBuilder
            let cardInfoService: ProjectCardInfoService
            let buttonList: EventCardBuilderButton[]

            beforeAll(() => {
                cardInfoService = new ProjectCardInfoService
            })
            beforeEach(() => {
                builder = new CardBuilder
                buttonList = ButtonDesigner.createEventCardBuilderButton(0)
                builder.addButtons(buttonList)
            })
            it('should evaluate addButtons', () => {
                builder = new CardBuilder
                builder.addButtons(buttonList)
                expect(builder.getButtons()).toBe(buttonList)
            })
            it('should evaluate getButtons and buttons status', () => {
                let resultButtonList = builder.getButtons()
                expect(resultButtonList).toBe(buttonList)
                for(let i=0; i<resultButtonList.length; i++){
                    expect(resultButtonList[0].enabled).toEqual(resultButtonList[0].startEnabled)
                }
            })
            it('should evaluate getButtonFromName to return selectButton', () => {
                let selectButton: EventCardBuilderButton = buttonList[0]
                expect(builder.getButtonFromName(selectButton.name)).toEqual(selectButton)
            })
            it('should evaluate getButtonFromName to return undefined', () => {
                expect(builder.getButtonFromName('non existing buttonName value' as EventCardBuilderButtonNames)).toEqual(undefined)
            })

            it('should evaluate resolveCardBuilderButtonClicked with select sent', () => {
                expect(builder.getButtonFromName('selectCard')?.enabled).toBeTrue()
                expect(builder.getButtonFromName('buildCard')?.enabled).toBeFalse()
                expect(builder.getButtonFromName("discardSelectedCard")?.enabled).toBeFalse()

                let button = builder.getButtonFromName('selectCard') as EventCardBuilderButton
                builder.resolveCardBuilderButtonClicked(button)
                expect(builder.getButtonFromName('selectCard')?.enabled).toBeFalse()
				expect(builder.getButtonFromName('cancelSelectCard')?.enabled).toBeTrue()
                expect(builder.getButtonFromName('buildCard')?.enabled).toBeFalse()
                expect(builder.getButtonFromName('discardSelectedCard')?.enabled).toBeFalse()
            })
            it('should evaluate resolveCardBuilderButtonClicked with discard sent', () => {
                let card = new ProjectCardModel
                builder.setSelectedCard(card)
                expect(builder.getSelectedCard()).toEqual(card)

                let button = builder.getButtonFromName('discardSelectedCard') as EventCardBuilderButton
                builder.resolveCardBuilderButtonClicked(button)
                expect(builder.getButtonFromName('selectCard')?.enabled).toBeTrue()
                expect(builder.getButtonFromName('buildCard')?.enabled).toBeFalse()
                expect(builder.getButtonFromName('discardSelectedCard')?.enabled).toBeFalse()

                expect(builder.getSelectedCard()).toBeUndefined()
            })
            it('should evaluate resolveCardBuilderButtonClicked with build sent', () => {
                expect(builder.getbuilderIsLocked()).toBeFalse()

                let button = builder.getButtonFromName('buildCard') as EventCardBuilderButton
                builder.resolveCardBuilderButtonClicked(button)
                expect(builder.getButtonFromName('selectCard')?.enabled).toBeFalse()
                expect(builder.getButtonFromName('buildCard')?.enabled).toBeFalse()
                expect(builder.getButtonFromName('discardSelectedCard')?.enabled).toBeFalse()

                expect(builder.getbuilderIsLocked()).toBeTrue()
            })
        })
    })

    describe('EventCardBuilder', () => {
        describe('UNIT TEST', () => {
            let event: EventCardBuilder
            let cardInfoService: ProjectCardInfoService
            let buttonList: EventCardBuilderButton[]

            beforeAll(() => {
                cardInfoService = new ProjectCardInfoService
            })
            beforeEach(() => {
                event = new EventCardBuilder
                buttonList = ButtonDesigner.createEventCardBuilderButton(0)
            })
            it('should evaluate hasSelector', () => {
                expect(event.hasSelector()).toBeTrue()
            })
            it('should evaluate hasCardBuilder', () => {
                expect(event.hasCardBuilder()).toBeTrue()
            })
            it('should evaluate getSelectionActive', () => {
                expect(event.getSelectionActive()).toBeFalse()
            })
            it('should evaluate activateSelection setting selectionActive as true', () =>{
                event.activateSelection()
                expect(event['selectionActive']).toEqual(true)
             })
            it('should evaluate deactivateSelection setting selectionActive as false', () =>{
                event['selectionActive'] = true
                event.deactivateSelection()
                expect(event['selectionActive']).toEqual(false)
            })
        })
    })
})
