import { AdvancedRessourceStock } from "../global.interface"

export interface PlayedCardStocksDTO {
	s?: AdvancedRessourceStock[] //stock
	t?: number[] //tag stock
}
export interface TriggerStateDTO {
	p: string[] //played
    a: string[] //active
}
