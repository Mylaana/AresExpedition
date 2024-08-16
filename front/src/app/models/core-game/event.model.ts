import { EventType } from "../../types/global.type";
import { CardSelector, ChildButton, PlayableCardZone } from "../../interfaces/global.interface";

/**
 * cardNumber should be the requested card number
 * cardList the list of cards id provided by server
 * isFinalized should become true when object should go to garbage
 */
export class EventModel {
    type!: EventType
    cardSelector!: CardSelector
    isFinalized: boolean = false
    eventId?: number
    button?: ChildButton
    playCardZone!: PlayableCardZone []
	value?: any
	selectionActive: boolean = false
}
