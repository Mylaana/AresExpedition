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
            textItemName: "$other-redarrow$",
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