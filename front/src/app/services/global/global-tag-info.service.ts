import { Injectable } from "@angular/core";

type TagInfo = {
    id: number;
    description: string;
    imageUrl: string;
    textTagName: string;
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
            textTagName: "$tag_building$",
        },
        {
            id: 1,
            description: 'space',
            imageUrl: 'assets/tag/space.png',
            textTagName: "$tag_space$",
        },
        {
            id: 2,
            description: 'science',
            imageUrl: 'assets/tag/science.png',
            textTagName: "$tag_science$",
        },
        {
            id: 3,
            description: 'power',
            imageUrl: 'assets/tag/power.png',
            textTagName: "$tag_power$",
        },
        {
            id: 4,
            description: 'earth',
            imageUrl: 'assets/tag/earth.png',
            textTagName: "$tag_earth$",
        },
        {
            id: 5,
            description: 'jovian',
            imageUrl: 'assets/tag/jovian.png',
            textTagName: "$tag_jovian$",
        },
        {
            id: 6,
            description: 'plant',
            imageUrl: 'assets/tag/plant.png',
            textTagName: "$tag_plant$",
        },
        {
            id: 7,
            description: 'animal',
            imageUrl: 'assets/tag/animal.png',
            textTagName: "$tag_animal$",
        },
        {
            id: 8,
            description: 'microbe',
            imageUrl: 'assets/tag/microbe.png',
            textTagName: "$tag_microbe$",
        },
        {
            id: 9,
            description: 'event',
            imageUrl: 'assets/tag/event.png',
            textTagName: "$tag_event$",
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
    getTagUrlFromTextTagName(tagName:string): string {
        var result: string = '';
            for(let i = 0; i < this.tagInfo.length; i++) {
                if(this.tagInfo[i].textTagName===tagName){
                    return this.tagInfo[i].imageUrl
                }
            }
        return result;
    }
}