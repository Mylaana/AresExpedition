import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { RGB } from "../../types/global.type";
import { PlayerPhase } from "../../interfaces/global.interface";
import { NonSelectablePhase, SelectablePhase } from "../../types/global.type";
import { DrawModel } from "../../models/core-game/draw.model";

interface SelectedPhase {
    "development": boolean,
    "construction": boolean,
    "action": boolean,
    "production": boolean,
    "research": boolean
}
interface PhaseOrder {
    "0": NonSelectablePhase,
    "1": NonSelectablePhase,
    "2": NonSelectablePhase,
    "3": NonSelectablePhase,
    "4": NonSelectablePhase,
    "5": NonSelectablePhase,
}

const phaseCount = 5;

@Injectable({
    providedIn: 'root'
})
export class GameState{
    clientPlayerId = 0; //should be changed to reflect the client's player's id
    groupPlayerState = new BehaviorSubject<PlayerStateModel[]>([]);
    groupPlayerReady = new BehaviorSubject<PlayerReadyModel[]>([]);
    groupPlayerSelectedPhase = new BehaviorSubject<PlayerPhase[]>([]);
    playerCount: number = 0;
    phase = new BehaviorSubject<NonSelectablePhase>("planification")
    drawQueue = new BehaviorSubject<DrawModel[]>([])

    currentPhase = this.phase.asObservable();
    currentGroupPlayerState = this.groupPlayerState.asObservable();
    currentGroupPlayerReady = this.groupPlayerReady.asObservable();
    currentGroupPlayerSelectedPhase = this.groupPlayerSelectedPhase
    currentDrawQueue = this.drawQueue.asObservable()


    phaseIndex: number = 0;
  
    phaseOrder: PhaseOrder = {
        "0":"planification",
        "1":"development",
        "2":"construction",
        "3":"action",
        "4":"production",
        "5":"research"
    }
    selectedPhase: SelectedPhase = {
        "development": false,
        "construction": false,
        "action": false,
        "production": false,
        "research": false
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
                "valueProd": 5,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 9,
            },
            {
                "id":1,
                "name": "heat",
                "valueMod": 0,
                "valueProd": 2,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 7,
            },
            {
                "id":2,
                "name": "plant",
                "valueMod": 0,
                "valueProd": 3,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 4,
            },
            {
                "id":3,
                "name": "steel",
                "valueMod": 2,
                "valueProd": 1,
                "valueStock": 0,
                "hasStock": false,
                "imageUrlId": 0,
            },
            {
                "id":4,
                "name": "titanium",
                "valueMod": 3,
                "valueProd": 2,
                "valueStock": 0,
                "hasStock": false,
                "imageUrlId": 1,
            },
            {
                "id":5,
                "name": "card",
                "valueMod": 0,
                "valueProd": 1,
                "valueStock": 0,
                "hasStock": false,
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
            "hand": [1,2,3],
            "played": [4]
        };
        newPlayer.terraformingRating = 5;
        this.groupPlayerState.next(this.groupPlayerState.getValue().concat([newPlayer]));

        //creates and add player to groupPlayerReady
        var newPlayerReady = new PlayerReadyModel;
        newPlayerReady.id = newPlayer.id
        newPlayerReady.name = playerName;
        newPlayerReady.isReady = false
        this.groupPlayerReady.next(this.groupPlayerReady.getValue().concat(newPlayerReady))

        //creates and add player to groupPlayerSelectedPhase
        var newPlayerPhase: PlayerPhase;
        newPlayerPhase = {
            "playerId": newPlayer.id,
            "currentSelectedPhase": undefined,
            "currentPhaseType": undefined,
            "previousSelectedPhase": undefined
        }
        this.updateGroupPlayerSelectedPhase(this.groupPlayerSelectedPhase.getValue().concat([newPlayerPhase]))

        //updates player count
        this.playerCount++
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
        var newPhase = this.goToNextPhase(this.phase.getValue())
        this.updatePhase(newPhase)
    };

    /**
     * @param currentPhase as NonSelectablePhase
     * @returns next phase name
     * 
     * triggers all phase change and cleaning related stuff
     */
    goToNextPhase(currentPhase:NonSelectablePhase):NonSelectablePhase{
        var nextPhase: NonSelectablePhase;
        var startCounting: number = Math.max(this.phaseIndex + 1, 1) //start looping at phase index +1 or 1



        for(let i=startCounting; i<=phaseCount; i++){
            if(this.accessSelectedPhase(this.accessPhaseOrder(i))===true){
                this.phaseIndex = i
                nextPhase = this.accessPhaseOrder(i)
                this.setPhaseAsPlayed(currentPhase)
                return nextPhase
            }
        }
        //if no phase left selected to be played, restart to planification phase
        this.phaseIndex = 0
        this.setPhaseAsPlayed(currentPhase)
        this.resetPhaseSelection()
        return this.phaseOrder["0"]
    }

    updateGroupPlayerState(newState: PlayerStateModel[]): void{
        if(newState != this.groupPlayerState.getValue()){
            this.groupPlayerState.next(newState)
        }
    };

    getPlayerStateFromId(playerId: number): PlayerStateModel{
        return this.groupPlayerState.getValue()[playerId]
    }

    getClientPlayerState(): PlayerStateModel{
        return this.getPlayerStateFromId(this.clientPlayerId)
    }


    updateClientPlayerState(clientState: PlayerStateModel): void{
        this.groupPlayerState.getValue()[this.clientPlayerId] = clientState
        //calls the groupState update to next subscriptions
        this.updateGroupPlayerState(this.groupPlayerState.getValue())
    }

    accessPhaseOrder(key: string | number): NonSelectablePhase{
        return this.phaseOrder[String(key) as keyof PhaseOrder]
    }

    accessSelectedPhase(key: string): boolean{
        return this.selectedPhase[key as keyof SelectedPhase]
    }

    setPhaseAsPlayed(phaseName: string){
        this.selectedPhase[phaseName as keyof SelectedPhase] = false
    }

    /**
     * 
     * @param playerId 
     * @param phase 
     * @returns 
     * sets up the phase selection for player
     * 
     * updates the global selectedPhase
     */
    playerSelectPhase(playerId:number, phase:SelectablePhase):void{
        if(phase===undefined){
            return
        }
        //player phase selection
        for(let i=0; i<this.groupPlayerSelectedPhase.getValue().length; i++){
            if(i===playerId){
                //this.groupPlayerSelectedPhase.getValue()[i].previousSelectedPhase = this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase
                this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase = phase
                break
            }
        }
        //global selectedPhase
        this.selectedPhase[phase]=true
    }

    /**
     * clears up current phase selection for players and adds previous selected phase
     */
    resetPhaseSelection(){
        for(let i=0; i<this.groupPlayerSelectedPhase.getValue().length; i++){
            this.groupPlayerSelectedPhase.getValue()[i].previousSelectedPhase = this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase
            this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase = undefined
        }
    }
    
    updateGroupPlayerSelectedPhase(newGroupPlayerSelectedPhase: PlayerPhase[]):void{
        this.groupPlayerSelectedPhase.next(newGroupPlayerSelectedPhase)
    }

    getClientPlayerStateHand(): number[] {
        var playerState = this.getPlayerStateFromId(this.clientPlayerId)
        if(playerState===undefined){
            return []
        }
        return playerState.cards.hand
    }

    updateClientPlayerStateHand(cardList: number[]): void {
        var clientState = this.getClientPlayerState()
        console.log(cardList)
        console.log(clientState)
        clientState.cards.hand = clientState.cards.hand.concat(clientState.cards.hand, cardList)
        console.log(clientState)
        this.updateClientPlayerState(clientState)
    }

    addCardToPlayerHand(playerId: number, cardToAdd: number | number[]):void{
        //this.getClientPlayerHandStateId()
    }

    addDrawQueue(draw: DrawModel):void{
        this.drawQueue.next(this.drawQueue.getValue().concat([draw]));
        console.log(draw)
    }
}
