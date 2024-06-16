import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { RGB } from "../../types/global.type";
import { PhaseHandlerService } from "./phase-handler.service";
import { NonSelectablePhase, SelectablePhase } from "../../types/global.type";

@Injectable({
    providedIn: 'root'
})
export class GameState{
    playerId = 0; //should be changed to reflect the client's player's id
    groupPlayerState = new BehaviorSubject<PlayerStateModel[]>([]);
    groupPlayerReady = new BehaviorSubject<PlayerReadyModel[]>([])
    playerCount: number = 0;
    phase = new BehaviorSubject<NonSelectablePhase>("planification")

    currentPhase = this.phase.asObservable();
    currentGroupPlayerState = this.groupPlayerState.asObservable();
    currentGroupPlayerReady = this.groupPlayerReady.asObservable();

    //initialize phaseHandler sub-service
    constructor(private phaseHandlerService: PhaseHandlerService){
        this.phaseHandlerService.clientPlayerId = this.playerId
    }

    addPlayer(playerName: string, playerColor: RGB): void {
        //creates and add player to groupPlayerState
        var newPlayer = new PlayerStateModel;
        newPlayer.id = this.groupPlayerState.getValue().length;
        newPlayer.name = playerName;
        newPlayer.color = playerColor;
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
        ];
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
        ];
        newPlayer.cards = {
            "hand": [],
            "played": []
        };
        this.groupPlayerState.next(this.groupPlayerState.getValue().concat([newPlayer]));

        //creates and add player to groupPlayerReady
        var newPlayerReady = new PlayerReadyModel;
        newPlayerReady.id = newPlayer.id
        newPlayerReady.name = playerName;
        newPlayerReady.isReady = false
        this.groupPlayerReady.next(this.groupPlayerReady.getValue().concat(newPlayerReady))

        //updates player count
        this.playerCount++

        //sends new player ID to phase handler
        this.phaseHandlerService.addPlayer(newPlayer.id)
    };

    /**
     * 
     * @param newPhase
     * gets the new phase to set
     * 
     * sets all players to not be ready
     */
    updatePhase(newPhase: NonSelectablePhase): void {
        if(newPhase === this.phase.getValue())
            return
        this.setPlayerReady(false)
        this.phase.next(newPhase)
        
        if(newPhase==="production"){
            this.phaseHandlerService.applyProductionPhase(this.getClientPlayerState())
        }
    };

    /**
     * @param playerId
     * @returns
     * set player with id to be ready or not according to {playerReady}

     * if no id specified, will set all players to not {playerReady}
     * */
    setPlayerReady(playerReady: boolean, playerId?: number){  
        var ready = this.groupPlayerReady.getValue()
        var loopStart: number;
        var loopFinish: number;

        if(playerId != undefined){
            loopStart = playerId
            loopFinish = playerId
        } else {
            loopStart = 0
            loopFinish = this.playerCount - 1
        }
        for(let i=loopStart; i<=loopFinish; i++){
            ready[i].isReady = playerReady
        }
        this.groupPlayerReady.next(ready)

        if(this.getPlayerReady()===true){
            this.GoToNextPhaseIfPlayerReady()
            return
        }
    };

    /**
     * @arg playerId
     * @returns @type {boolean} if the player is ready or not

     * if no id specified, will return if all players are ready or not
     * */
    getPlayerReady(playerId?: number): boolean {
        var ready = this.groupPlayerReady.getValue()
        var loopStart: number;
        var loopFinish: number;

        if(playerId != undefined){
            loopStart = playerId
            loopFinish = playerId
        } else {
            loopStart = 0
            loopFinish = this.playerCount - 1
        }
        for(let i=loopStart; i<=loopFinish; i++){
            if(ready[i].isReady === false){
                return false
            }
        }
        return true
    };

    GoToNextPhaseIfPlayerReady(){
        var newPhase = this.phaseHandlerService.goToNextPhase(this.phase.getValue())
        this.updatePhase(newPhase)
    };

    getPhase(): string {
        return this.phase.value
    };

    getPlayerStateFromId(playerId: number){
        var states: PlayerStateModel[] = [];
        states = this.groupPlayerState.getValue().slice()

        for(var i=0; i<states.length; i++){
            if(states[i].id === playerId){
                return states[i]
            }
        }
        return undefined
    };

    updateGroupPlayerState(newState: PlayerStateModel[]): void{
        if(newState != this.groupPlayerState.getValue()){
            this.groupPlayerState.next(newState)
        }
    };

    playerSelectPhase(playerId:number, phase:SelectablePhase){
        this.phaseHandlerService.playerSelectPhase(playerId, phase)
    };

    getClientPlayerState(): PlayerStateModel{
        return this.groupPlayerState.getValue()[this.playerId]
    }

    updateClientPlayerState(clientState: PlayerStateModel): void{
        this.groupPlayerState.getValue()[this.playerId] = clientState
        //calls the groupState update to next the subscriptions
        this.updateGroupPlayerState(this.groupPlayerState.getValue())
    }
}
