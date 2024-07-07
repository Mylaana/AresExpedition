import { Injectable } from "@angular/core";

type RessourceInfo = {
    id: number;
    description: string;
    imageUrl: string;
    textRessourceName: string;
};

@Injectable({
    providedIn: 'root'
})
export class GlobalRessourceInfoService {
    private ressourceInfo: RessourceInfo[] = [
        {
            id: 0,
            description: 'steel',
            imageUrl: 'assets/ressource/steel.png',
            textRessourceName: "$ressource_steel$",
        },
        {
            id: 1,
            description: 'titanium',
            imageUrl: 'assets/ressource/titanium.png',
            textRessourceName: "$ressource_titanium$",
        },
        {
            id: 2,
            description: 'science',
            imageUrl: 'assets/ressource/science.png',
            textRessourceName: "$ressource_science$",
        },
        {
            id: 3,
            description: 'power',
            imageUrl: 'assets/ressource/power.png',
            textRessourceName: "$ressource_power$",
        },
        {
            id: 4,
            description: 'plant',
            imageUrl: 'assets/ressource/plant.png',
            textRessourceName: "$ressource_plant$",
        },
        {
            id: 5,
            description: 'animal',
            imageUrl: 'assets/ressource/animal.png',
            textRessourceName: "$ressource_animal$",
        },
        {
            id: 6,
            description: 'microbe',
            imageUrl: 'assets/ressource/microbe.png',
            textRessourceName: "$ressource_microbe$",
        },
        {
            id: 7,
            description: 'heat',
            imageUrl: 'assets/ressource/heat.png',
            textRessourceName: "$ressource_heat$",
        },
        {
            id: 8,
            description: 'card',
            imageUrl: 'assets/ressource/card.png',
            textRessourceName: "$ressource_card$",
        },
        {
            id: 9,
            description: 'megacredit',
            imageUrl: 'assets/ressource/megacredit.png',
            textRessourceName: "$ressource_megacredit$",
        },
        {
            id: 9,
            description: 'megacreditvoid',
            imageUrl: 'assets/ressource/megacreditvoid.png',
            textRessourceName: "$ressource_megacreditvoid$",
        },
    ];

    getRessourceUrlFromID(id: number): string {
        if(id < 0 ){
            return ''
        }
        for(let i = 0; i < this.ressourceInfo.length; i++){
            if (this.ressourceInfo[i].id === id) {
                return this.ressourceInfo[i].imageUrl
            }
        }
        return '';
    }
    getRessourceUrlFromTextRessourceName(ressourceName:string): string {
        var result: string = '';
            for(let i = 0; i < this.ressourceInfo.length; i++) {
                if(this.ressourceInfo[i].textRessourceName===ressourceName){
                    return this.ressourceInfo[i].imageUrl
                }
            }
        return result;
    }
}