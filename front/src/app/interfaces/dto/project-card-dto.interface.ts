import { AdvancedRessourceStock } from "../global.interface"

export interface PlayedCardDTO {
	i: number //id
	s?: AdvancedRessourceStock[] //stock
}
export interface TriggerStateDTO {
	pci: number[] //playedCardsId
    aci: number[] //activeCardsId
    aoratc: number[] //activeOnRessourceAddedToCard
    aopi: number[] //activeOnParameterIncrease
    aopc: number[] //activeOnPlayedCard
    aogt: number[] //activeOnGainedTag
    acmt: number[] //activeCostModTrigger
}
