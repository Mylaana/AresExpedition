import { EventUnionSubTypes } from "../../types/event.type"

/**
 * est: Event SubType
 *
 * bl: Builder Locked List
 */
export interface EventDTO {
	est: EventUnionSubTypes //event subtype
	bl?: boolean[] //builder locked list
	al?: {[key: string]: number} //activation log
	ced?: number //createEventDiscard
}
