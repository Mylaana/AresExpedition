import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { RGB } from "../../types/global.type";

type Phase = "planification" | "development" | "construction" | "action" | "production" | "research"

@Injectable({
    providedIn: 'root'
})
export class GameState{
    constructor(){}

    playerId = 0; //should be changed to reflect the client's player's id
    groupPlayerState = new BehaviorSubject<PlayerStateModel[]>([]);
    phase = new BehaviorSubject("planification")

    currentPhase = this.phase.asObservable();
    currentGroupPlayerState = this.groupPlayerState.asObservable();
    
    addPlayer(playerName: string, playerColor: RGB): void {
        var newPlayer = new PlayerStateModel
        newPlayer.id = this.groupPlayerState.getValue().length
        newPlayer.name = playerName
        newPlayer.color = playerColor
        newPlayer.ressource = [
            {
                "id":0,
                "name": "megacredit",
                "valueMod": 0,
                "valueProd": 0,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 9,
            },
            {
                "id":1,
                "name": "heat",
                "valueMod": 0,
                "valueProd": 0,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 7,
            },
            {
                "id":2,
                "name": "plant",
                "valueMod": 0,
                "valueProd": 0,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 4,
            },
            {
                "id":3,
                "name": "steel",
                "valueMod": 2,
                "valueProd": 0,
                "valueStock": 0,
                "hasStock": false,
                "imageUrlId": 0,
            },
            {
                "id":4,
                "name": "titanium",
                "valueMod": 3,
                "valueProd": 0,
                "valueStock": 0,
                "hasStock": false,
                "imageUrlId": 1,
            },
            {
                "id":5,
                "name": "card",
                "valueMod": 0,
                "valueProd": 0,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 8,
            },
        ]
        newPlayer.tag = [
            {
                "id": 0,
                "name": "building",
                "idImageUrl": 0,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 1,
                "name": "space",
                "idImageUrl": 1,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 2,
                "name": "science",
                "idImageUrl": 2,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 3,
                "name": "power",
                "idImageUrl": 3,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 4,
                "name": "earth",
                "idImageUrl": 4,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 5,
                "name": "jovian",
                "idImageUrl": 5,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 6,
                "name": "plant",
                "idImageUrl": 6,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 7,
                "name": "animal",
                "idImageUrl": 7,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 8,
                "name": "microbe",
                "idImageUrl": 8,
                "valueCount": 0,
                "valueMod": 0,
            },
            {
                "id": 9,
                "name": "event",
                "idImageUrl": 9,
                "valueCount": 0,
                "valueMod": 0,
            },
        ]
        newPlayer.cards = {
            "hand": [],
            "played": []
        }
        this.groupPlayerState.next(this.groupPlayerState.getValue().concat([newPlayer]));
    }
    updatePhase(newPhase: Phase): void {
        //updates phase
        this.phase.next(String(newPhase))
    }
    getPhase(): string {
        return this.phase.value
    }
    getPlayerStateFromId(playerId: number){
        var states: PlayerStateModel[] = [];
        states = this.groupPlayerState.getValue().slice()

        for(var i=0; i<states.length; i++){
            if(states[i].id === playerId){
                return states[i]
            }
        }

        return undefined
    }
}
