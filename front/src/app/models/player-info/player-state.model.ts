import { RessourceState, TagState } from "../../interfaces/global.interface";
import { RGB } from "../../types/global.type";
import { PhaseCardHolderModel } from "../cards/phase-card.model";

export class PlayerStateModel {
    id!: number;
    name!: string;
    color!: RGB;
    ressource!: RessourceState[];
    terraformingRating!: number;
    vp!: number;
    tag!: TagState[];
    cards!: {
        "hand": number[],
        "played": number[],
        "maximum": number;
    };
    research!: {
        "drawMod": number,
        "keepMod": number
    }
	phaseCard = new PhaseCardHolderModel
	phaseCardUpgradeNumber: number = 0
	sellCardValueMod: number = 0

    getRessourceStateFromId(ressourceId: number): RessourceState | undefined{
        for(let i=0; i<this.ressource.length; i++){
            if(this.ressource[i].id === ressourceId){
                return this.ressource[i]
            }
        }
        return
    }

    getRessourceStateFromName(ressourceName: string): RessourceState | undefined{
        for(let i=0; i<this.ressource.length; i++){
            if(this.ressource[i].name === ressourceName){
                return this.ressource[i]
            }
        }
        return
    }
}


export class PlayerReadyModel {
    id!: number;
    name!:string;
    isReady: boolean = false;
}
