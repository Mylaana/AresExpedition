import { CardSelector } from "../../interfaces/global.interface"
import { EventDesigner } from "./event-designer.service"

describe('Service - Designers - Event', () => {
    describe('UNIT TEST', () => {
        let emptySelector: CardSelector
        beforeEach(() => {
            emptySelector = {
                selectFrom: [],
                selectedList: [],
                selectionQuantity: 0,
                selectionQuantityTreshold: 'equal',
                cardInitialState: undefined,
                filter: undefined,
                stateFromParent: undefined
            }
        })
        it('should evaluate generateCardSelector returning default empty selector', () => {
            let selector = EventDesigner['generateCardSelector']()
            expect(selector).toEqual(emptySelector)
        })
    })
})