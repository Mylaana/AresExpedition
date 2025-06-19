import { DrawEvent } from "../models/core-game/event.model";
import { EventUnionSubTypes } from "../types/event.type";
import { ScanKeep } from "../interfaces/global.interface";
import { DeckQueryOptionsEnum } from "../enum/global.enum";

export const DrawEventFactory = {
    createDrawEvent(resolveType:EventUnionSubTypes, drawCardNumber:number, waiterId:number, isCardProduction:boolean = false, thenDiscard: number = 0): DrawEvent {
        let event = new DrawEvent
        event.drawCardNumber= drawCardNumber,
        event.resolveEventSubType = resolveType
        event.waiterId = waiterId
		event.isCardProduction = isCardProduction
		event.discardAfterDraw =  thenDiscard
        return event
    },
    createScanKeepEvent(resolveType:EventUnionSubTypes, scanKeep:ScanKeep ,waiterId:number, options?:DeckQueryOptionsEnum): DrawEvent {
		let event = new DrawEvent
        event.drawCardNumber = scanKeep.scan
        event.resolveEventSubType = resolveType
        event.waiterId = waiterId
        event.keepCardNumber = scanKeep.keep
		event.scanKeepOptions = options
        return event
    }
}
