import { GAME_RESSOURCE_LIST } from "../../global/global-const";
import { PlayerRessourceStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { RessourceInfo } from "../../interfaces/global.interface";
import { GlobalInfo } from "../../services/global/global-info.service";
import { RessourceType } from "../../types/global.type";

const ressourceIndex = new  Map<RessourceType, number>(
	[
		['megacredit', 0],
		['heat', 1],
		['plant', 2],
		['steel', 3],
		['titanium', 4],
		['card', 5],
	]
)

export class PlayerRessourceStateModel {
    private ressources: RessourceInfo[] = this.initializeRessources()

	constructor(data: PlayerRessourceStateDTO){
		this.ressources = data.ressource
	}

	private initializeRessources(): RessourceInfo[] {
		let result: RessourceInfo[] = []
		for(let i=0; i<=5; i++){
			let ressource: RessourceInfo = {
				id: i,
				name: GAME_RESSOURCE_LIST[i],
				valueMod: 0,
				valueProd: 0,
				valueBaseProd: 0,
				valueStock: 0,
				hasStock: (i!=3 && i!=4),
				imageUrlId: GlobalInfo.getIdFromType(GAME_RESSOURCE_LIST[i])
			}
			result.push(ressource)
		}
		return result
	}

	getRessources(): RessourceInfo[] {
		return this.ressources
	}
	getRessourceInfoFromId(ressourceId: number): RessourceInfo | undefined {
        for(let i=0; i<this.ressources.length; i++){
            if(this.ressources[i].id === ressourceId){
                return this.ressources[i]
            }
        }
        return
    }
	getRessourceStateFromType(type: RessourceType): RessourceInfo | undefined{
		for(let i=0; i<this.ressources.length; i++){
			if(this.ressources[i].name === type){
				return this.ressources[i]
			}
		}
		return
	}
	addProduction(ressource: RessourceType, quantity: number){
		this.ressources[Number(ressourceIndex.get(ressource))].valueBaseProd += quantity
	}
	addRessource(ressource: RessourceType, quantity: number){
		this.ressources[Number(ressourceIndex.get(ressource))].valueStock += quantity
	}
	setScalingProduction(ressource: RessourceType, scalingProduction:number):void{
		/*update productions with base + scaling values*/
		this.ressources[Number(ressourceIndex.get(ressource))].valueProd =
			this.ressources[Number(ressourceIndex.get(ressource))].valueBaseProd + scalingProduction
	}
	toJson(): PlayerRessourceStateDTO {
		return {
			ressource: this.ressources
		}
	}
	static fromJson(data: PlayerRessourceStateDTO): PlayerRessourceStateModel {
		if (!data.ressource){
			throw new Error("Invalid PlayerInfoStateDTO: Missing required fields")
		}
		return new PlayerRessourceStateModel(data)
	}
	static empty(): PlayerRessourceStateModel {
		return new PlayerRessourceStateModel(
			{
				ressource: []
			}
		)
	}
}
