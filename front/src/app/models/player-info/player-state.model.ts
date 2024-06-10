import { RessourceState, TagState } from "../../interfaces/global.interface";
import { RGB } from "../../types/global.type";

export class PlayerStateModel {
    id!: number;
    name!: string;
    color!: RGB; 
    ressource!: RessourceState[];
    tag!: TagState[];
    cards!: {
        "hand": number[],
        "played": number[]
    };
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