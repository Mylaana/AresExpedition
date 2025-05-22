import { Injectable } from "@angular/core";
import { DrawEvent } from "../../models/core-game/event.model";
import { EventUnionSubTypes } from "../../types/event.type";
import { ScanKeep } from "../../interfaces/global.interface";

@Injectable({
    providedIn: 'root'
})
export class DrawEventDesigner {
    public static createDrawEvent(resolveType:EventUnionSubTypes, drawCardNumber:number, waiterId:number, isCardProduction:boolean = false): DrawEvent {
        let event = new DrawEvent
        event.drawCardNumber= drawCardNumber,
        event.resolveEventSubType = resolveType
        event.waiterId = waiterId
		event.isCardProduction = isCardProduction
        return event
    }
    public static createScanKeepEvent(resolveType:EventUnionSubTypes, scanKeep:ScanKeep ,waiterId:number): DrawEvent {
        let event = new DrawEvent
        event.drawCardNumber = scanKeep.scan
        event.resolveEventSubType = resolveType
        event.waiterId = waiterId
        event.keepCardNumber = scanKeep.keep
        return event
    }
}
