import { Injectable } from "@angular/core";

type ItemInfo = {
    id: number;
    description: string;
    imageUrl: string;
    textItemName: string;
};

@Injectable({
    providedIn: 'root'
})
export class GlobalItemInfoService {
    private itemInfo: ItemInfo[] = [
        {
            id: 0,
            description: 'arrow',
            imageUrl: 'assets/other/arrow.png',
            textItemName: "$other_redarrow$",
        },
        {
            id: 1,
            description: 'ocean',
            imageUrl: 'assets/other/ocean.png',
            textItemName: "$other_ocean$",
        },
    ];

    getItemUrlFromTextItemName(itemName:string): string {
        var result: string = '';
        for(let i = 0; i < this.itemInfo.length; i++) {
            if(this.itemInfo[i].textItemName===itemName){
                return this.itemInfo[i].imageUrl
            }
        }
        return result;
    }
}