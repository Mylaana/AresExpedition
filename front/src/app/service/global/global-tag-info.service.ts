import { Injectable } from "@angular/core";

type TagInfo = {
    id: number;
    description: string;
    imageUrl: string;
};

@Injectable({
    providedIn: 'root'
})
export class GlobalTagInfoService {

    
    private tagInfo: TagInfo[] = [
        {
            id: 0,
            description: 'building',
            imageUrl: 'assets/tag/building.png',
        },
        {
            id: 1,
            description: 'space',
            imageUrl: 'assets/tag/space.png',
        },
        {
            id: 2,
            description: 'science',
            imageUrl: 'assets/tag/science.png',
        },
        {
            id: 3,
            description: 'power',
            imageUrl: 'assets/tag/power.png',
        },
        {
            id: 4,
            description: 'earth',
            imageUrl: 'assets/tag/earth.png',
        },
        {
            id: 5,
            description: 'jovian',
            imageUrl: 'assets/tag/jovian.png',
        },
        {
            id: 6,
            description: 'plant',
            imageUrl: 'assets/tag/plant.png',
        },
        {
            id: 7,
            description: 'animal',
            imageUrl: 'assets/tag/animal.png',
        },
        {
            id: 8,
            description: 'microbe',
            imageUrl: 'assets/tag/microbe.png',
        },
        {
            id: 9,
            description: 'event',
            imageUrl: 'assets/tag/event.png',
        },
    ];

    getTagUrlFromID(id: number): string {
        if(id < 0 ){
            return ''
        }
        for(let i = 0; i < this.tagInfo.length; i++){
            if (this.tagInfo[i].id === id) {
                return this.tagInfo[i].imageUrl
            }
        }
        return '';
    }
}