import { ScanKeep } from "../../interfaces/global.interface"
import { DrawEvent } from "../../models/core-game/event.model"
import { EventUnionSubTypes } from "../../types/event.type"
import { DrawEventDesigner } from "./event-designer.service"

describe('Draw Event Designer', () => {
    describe('createDrawEvent', () => {
        describe('UNIT TEST', () => {
            it('should create draw event', () => {
                let event = DrawEventDesigner.createDrawEvent('drawResult', 3, 125)
                let result = new DrawEvent 
                result.drawCardNumber = 3
                result.resolveEventSubType = 'drawResult'
                result.waiterId = 125
                
                expect(event).toEqual(result)
            })
            it('should create scanKeep event', () => {
                let expectedScanKeep: ScanKeep = {keep:3, scan:9}
                let expectedResolveType: EventUnionSubTypes = 'scanKeepResult'
                let expectedWaiterId = 125

                let event = DrawEventDesigner.createScanKeepEvent(expectedResolveType, expectedScanKeep, expectedWaiterId)
                let expectedEvent = new DrawEvent 
                expectedEvent.drawCardNumber = expectedScanKeep.scan
                expectedEvent.keepCardNumber = expectedScanKeep.keep
                expectedEvent.resolveEventSubType = expectedResolveType
                expectedEvent.waiterId = expectedWaiterId
                
                expect(event).toEqual(expectedEvent)
            })
        })
    })
})