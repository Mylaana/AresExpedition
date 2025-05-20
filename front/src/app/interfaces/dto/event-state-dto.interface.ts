import { EventStateOriginEnum, EventStateTypeEnum } from "../../enum/eventstate.enum"

export interface EventStateDTO {
	o: EventStateOriginEnum
	t: EventStateTypeEnum
	v: any
}
