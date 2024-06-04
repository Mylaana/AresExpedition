import { Injectable } from "@angular/core";
import { TagCardModel } from "../../models/player-info/tag-card.model";

@Injectable({
    providedIn: 'root'
})
export class TagInfoService {
    tagInfo: TagCardModel[] = [
        {
            id: 0,
            description: 'building',
            imageUrl: 'assets/tag/building.png',
            valueMod: 0,
            valueCount: 1,
        },
        {
            id: 1,
            description: 'space',
            imageUrl: 'assets/tag/space.png',
            valueMod: 0,
            valueCount: 5,
        },
        {
            id: 2,
            description: 'science',
            imageUrl: 'assets/tag/science.png',
            valueMod: 0,
            valueCount: 0,
        },
        {
            id: 3,
            description: 'power',
            imageUrl: 'assets/tag/power.png',
            valueMod: 0,
            valueCount: 0,
        },
        {
            id: 4,
            description: 'earth',
            imageUrl: 'assets/tag/earth.png',
            valueMod: -2,
            valueCount: 3,
        },
        {
            id: 5,
            description: 'jovian',
            imageUrl: 'assets/tag/jovian.png',
            valueMod: 0,
            valueCount: 0,
        },
        {
            id: 6,
            description: 'plant',
            imageUrl: 'assets/tag/plant.png',
            valueMod: 0,
            valueCount: 0,
        },
        {
            id: 7,
            description: 'animal',
            imageUrl: 'assets/tag/animal.png',
            valueMod: 0,
            valueCount: 0,
        },
        {
            id: 8,
            description: 'microbe',
            imageUrl: 'assets/tag/microbe.png',
            valueMod: 0,
            valueCount: 0,
        },
        {
            id: 9,
            description: 'event',
            imageUrl: 'assets/tag/event.png',
            valueMod: 0,
            valueCount: 120,
        },
    ];
    getTagStatus(): TagCardModel[] {
        return this.tagInfo;
    }
}