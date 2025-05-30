import { AdvancedRessourceStock } from "../global.interface"

export interface PlayedCardDTO {
	i: number //id
	s?: AdvancedRessourceStock[] //stock
}
export interface TriggerStateDTO {
	pci: string[] //playedCardsId
    aci: string[] //activeCardsId
    aoratc: string[] //activeOnRessourceAddedToCard
    aopi: string[] //activeOnParameterIncrease
    aopc: string[] //activeOnPlayedCard
    aogt: string[] //activeOnGainedTag
    acmt: string[] //activeCostModTrigger
}
