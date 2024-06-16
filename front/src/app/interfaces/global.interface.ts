import { SelectablePhase } from "../types/global.type";

export interface RessourceState {
    "id": number,
    "name": string,
    "valueMod": number,
    "valueProd": number,
    "valueStock": number,
    "hasStock": boolean,
    "imageUrlId": number,
}
export interface TagState {
    "id": number,
    "name": string,
    "idImageUrl": number;
    "valueMod": number;
    "valueCount": number;
}

export interface PlayerPhase {
    playerId: number;
    currentSelectedPhase: SelectablePhase;
    previousSelectedPhase: SelectablePhase;
}