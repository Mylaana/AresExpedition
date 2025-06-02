import { Injectable } from "@angular/core";
import { GameItemType } from "../../types/global.type";
import { GameItem } from "../../interfaces/global.interface";
import jsonData from '../../../assets/data/game-item_data.json'

@Injectable({
    providedIn: 'root'
})
export class GlobalInfo {
    private static readonly gameItems: GameItem[] = GlobalInfo.loadJson()

    private static loadJson(): GameItem[] {
        let result: GameItem[] = []
        for(let data of jsonData){
            result.push(data as GameItem)
        }
        return result
    }

    public static getUrlFromID(id: number): string {
        let result: string = ''
        for(let item of this.gameItems){
            if(item.id===id){return item.imageUrl}
        }
        return result
    }
    public static getUrlFromName(name:string): string {
        let result: string = ''
        for(let item of this.gameItems){
            if(item.name===name){return item.imageUrl}
        }
        return result
    }
    public static getIdFromType(type: GameItemType, itemType: 'ressource' | 'tag'): number {
        let tagId: number = -1
        for(let item of this.gameItems){
            if(item.name==='$' + itemType + '_' + type + '$'){return item.id}
        }
        return tagId
    }
}
