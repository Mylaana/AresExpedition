import { AdvancedRessourceStock } from "../global.interface"

export interface PlayedCardDTO {
	i: number //id
	s?: AdvancedRessourceStock[] //stock
}
export interface TriggerStateDTO {
	p: string[] //played
    a: string[] //active
}
