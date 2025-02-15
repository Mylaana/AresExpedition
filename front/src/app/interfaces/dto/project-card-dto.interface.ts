import { AdvancedRessourceStock } from "../global.interface"

export interface ProjectCardDTO {
	i: number //id
	s: AdvancedRessourceStock[] //stock
}

export interface TriggerStateDTO {
	pci: number[]
    aci: number[]
    aoratc: number[]
    aopi: number[]
    aopc: number[]
    aogt: number[]
    acmt: number[]
}
