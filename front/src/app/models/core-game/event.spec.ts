import { ProjectCardInfoService } from "../../services/cards/project-card-info.service";
import { ButtonDesigner } from "../../services/core-game/button-designer.service";
import { EventCardBuilderButtonNames } from "../../types/global.type";
import { ProjectCardModel } from "../cards/project-card.model";
import { EventCardBuilderButton } from "./button.model";
import { CardBuilder, EventBaseCardSelector, EventBaseModel } from "./event.model";

class testEventBaseModel extends EventBaseModel{}
class testEventBaseCardSelector extends EventBaseCardSelector{}

describe('UNIT test abstract EventBaseModel', () => {
    let testEvent: testEventBaseModel
    
    beforeAll(() => {
        testEvent = new testEventBaseModel
    })
    it('should evaluate hasSelector', () => {
        expect(testEvent.hasSelector()).toEqual(false)
    })
    it('should evaluate hasCardBuilder', () => {
        expect(testEvent.hasCardBuilder()).toEqual(false)
    })
    it('should evaluate getSelectionActive', () => {
        expect(testEvent.getSelectionActive()).toEqual(false)
    })
})

describe('UNIT test abstract EventBaseCardSelector', () =>{
    let testEvent: testEventBaseCardSelector
    let cardInfoService: ProjectCardInfoService

    beforeAll(() => {
        cardInfoService = new ProjectCardInfoService
    })
    beforeEach(() => {
        testEvent = new testEventBaseCardSelector
    })
    it('should evaluate hasSelector', () => {
        expect(testEvent.hasSelector()).toEqual(true)
    })
    it('should evaluate getSelection as false', () =>{
        expect(testEvent.getSelectionActive()).toEqual(false)
    })
    it('should evaluate activateSelection setting selectionActive as true', () =>{
        testEvent.activateSelection()
        expect(testEvent.getSelectionActive()).toEqual(true)
     })
    it('should evaluate deactivateSelection setting selectionActive as false', () =>{
        testEvent.activateSelection()
        expect(testEvent.getSelectionActive()).toEqual(true)
        testEvent.deactivateSelection()
    expect(testEvent.getSelectionActive()).toEqual(false)
    })
    it('should evaluate updateCardSelection', () => {
        let testCardId = 263
        testEvent.updateCardSelection(cardInfoService.getProjectCardList([testCardId]))
        expect(testEvent.cardSelector.selectedList.length).toEqual(1)
        expect(testEvent.cardSelector.selectedList[0].id).toEqual(testCardId)
    })
})

describe('UNIT test CardBuilder', () =>{
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
    it('should evaluate getCardIsBuilt returning false', () => {
        expect(builder.getCardIsBuilt()).toEqual(false)
    })
    it('should evaluate setCardBuilt returning false', () => {
        builder.setCardIsBuilt()
        expect(builder.getCardIsBuilt()).toEqual(true)
    })
})
describe('INTEGRATION test CardBuilder', () => {
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
        expect(builder.getButtonFromName('cancelCard')?.enabled).toBeFalse()

        let button = builder.getButtonFromName('selectCard') as EventCardBuilderButton
        builder.resolveCardBuilderButtonClicked(button)
        expect(builder.getButtonFromName('selectCard')?.enabled).toBeFalse()
        expect(builder.getButtonFromName('buildCard')?.enabled).toBeTrue()
        expect(builder.getButtonFromName('cancelCard')?.enabled).toBeTrue()
    })
    it('should evaluate resolveCardBuilderButtonClicked with cancel sent', () => {
        let card = new ProjectCardModel
        builder.setSelectedCard(card)
        expect(builder.getSelectedCard()).toEqual(card)

        let button = builder.getButtonFromName('cancelCard') as EventCardBuilderButton
        builder.resolveCardBuilderButtonClicked(button)
        expect(builder.getButtonFromName('selectCard')?.enabled).toBeTrue()
        expect(builder.getButtonFromName('buildCard')?.enabled).toBeFalse()
        expect(builder.getButtonFromName('cancelCard')?.enabled).toBeFalse()

        expect(builder.getSelectedCard()).toBeUndefined()
    })
    it('should evaluate resolveCardBuilderButtonClicked with build sent', () => {
        expect(builder.getCardIsBuilt()).toBeFalse()

        let button = builder.getButtonFromName('buildCard') as EventCardBuilderButton
        builder.resolveCardBuilderButtonClicked(button)
        expect(builder.getButtonFromName('selectCard')?.enabled).toBeFalse()
        expect(builder.getButtonFromName('buildCard')?.enabled).toBeFalse()
        expect(builder.getButtonFromName('cancelCard')?.enabled).toBeFalse()

        expect(builder.getCardIsBuilt()).toBeTrue()
    })
})