import { Injectable } from "@angular/core";
import { RessourceCardModel } from "../models/ressource-card.model";

@Injectable({
    providedIn: 'root'
})
export class RessourceProdService {
    ressourceInfo: RessourceCardModel[] = [
        {
            id: 1,
            description: 'mega credit',
            imageUrl: '/assets/ressource/megacredit.png',
            valueMod: 0,
            valueProd: 111,
            valueStock: 10
        },
        {
            id: 2,
            description: 'heat',
            imageUrl: '/assets/ressource/heat.png',
            valueMod: 0,
            valueProd: 222,
            valueStock: 20
        },
        {
            id: 3,
            description: 'plant',
            imageUrl: '/assets/ressource/plant.png',
            valueMod: 0,
            valueProd: 333,
            valueStock: 30
        },
        {
            id: 4,
            description: 'steel',
            imageUrl: '/assets/ressource/steel.png',
            valueMod: 2,
            valueProd: 444,
            valueStock: 40
        },
        {
            id: 5,
            description: 'titanium',
            imageUrl: '/assets/ressource/titanium.png',
            valueMod: 3,
            valueProd: 555,
            valueStock: 50
        },
        {
            id: 6,
            description: 'card',
            imageUrl: '/assets/ressource/card.png',
            valueMod: 0,
            valueProd: 666,
            valueStock: 60
        }
    ];

    getRessourceStatus(): RessourceCardModel[] {
        return this.ressourceInfo;
    }
}