import { ScanKeep } from "../../interfaces/global.interface"
import { DrawEvent } from "../../models/core-game/event.model"
import { EventUnionSubTypes } from "../../types/event.type"
import { DrawEventDesigner } from "./draw-event-designer.service"

describe('Service - Designers - Draw Event', () => {
    describe('createDrawEvent', () => {
        describe('UNIT TEST', () => {
            let expectedResolveType: EventUnionSubTypes
            let expectedWaiterId: number

            beforeEach(() => {
                expectedWaiterId = 125
            })
            it('should create draw event', () => {
                let expectedDrawNumber = 3
                expectedResolveType = 'drawResult'

                let expectedEvent = new DrawEvent 
                expectedEvent.drawCardNumber = expectedDrawNumber
                expectedEvent.resolveEventSubType = expectedResolveType
                expectedEvent.waiterId = expectedWaiterId
                
                let event = DrawEventDesigner.createDrawEvent(expectedResolveType, expectedDrawNumber, expectedWaiterId)
                expect(event).toEqual(expectedEvent)
            })
            it('should create scanKeep event', () => {
                let expectedScanKeep: ScanKeep = {keep:3, scan:9}
                expectedResolveType = 'scanKeepResult'

                let expectedEvent = new DrawEvent 
                expectedEvent.drawCardNumber = expectedScanKeep.scan
                expectedEvent.keepCardNumber = expectedScanKeep.keep
                expectedEvent.resolveEventSubType = expectedResolveType
                expectedEvent.waiterId = expectedWaiterId
                
                let event = DrawEventDesigner.createScanKeepEvent(expectedResolveType, expectedScanKeep, expectedWaiterId)
                expect(event).toEqual(expectedEvent)
            })
        })
    })
})