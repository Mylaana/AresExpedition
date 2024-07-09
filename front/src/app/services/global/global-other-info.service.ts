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
            description: 'redarrow',
            imageUrl: 'assets/other/arrow.png',
            textItemName: "$other_redarrow$",
        },
        {
            id: 1,
            description: 'arrow',
            imageUrl: 'assets/other/arrow.png',
            textItemName: "$other_arrow$",
        },
        {
            id: 2,
            description: 'card',
            imageUrl: 'assets/other/card.png',
            textItemName: "$other_card$",
        },
        {
            id: 3,
            description: 'tr',
            imageUrl: 'assets/other/tr.png',
            textItemName: "$other_tr$",
        },
        {
            id: 4,
            description: 'ocean',
            imageUrl: 'assets/other/ocean.png',
            textItemName: "$other_ocean$",
        },
        {
            id: 5,
            description: 'oxygen',
            imageUrl: 'assets/other/oxygen.png',
            textItemName: "$other_oxygen$",
        },
        {
            id: 6,
            description: 'forest',
            imageUrl: 'assets/other/forest.png',
            textItemName: "$other_forest$",
        },
        {
            id: 7,
            description: 'temperature',
            imageUrl: 'assets/other/temperature.png',
            textItemName: "$other_temperature$",
        },
        {
            id: 8,
            description: 'infrastructure',
            imageUrl: 'assets/other/infrastructure.png',
            textItemName: "$other_infrastructure$",
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