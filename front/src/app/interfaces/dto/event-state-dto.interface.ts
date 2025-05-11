import { EventStateOriginEnum, EventStateTypeEnum } from "../../enum/eventstate.enum"

export interface EventStateDTO {
	o: EventStateOriginEnum
	t: EventStateTypeEnum
	v: any
	/*
	est: EventUnionSubTypes //event subtype
	bl?: boolean[] //builder locked list
	al?: {[key: string]: number} //activation log
	ced?: number //createEventDiscard
	*/
}
