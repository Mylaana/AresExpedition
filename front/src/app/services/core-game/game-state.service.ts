import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { RGB } from "../../types/global.type";
import { PlayerPhase } from "../../interfaces/global.interface";
import { NonSelectablePhase, SelectablePhase } from "../../types/global.type";
import { DrawModel } from "../../models/core-game/draw.model";
import { PhaseCardType } from "../../types/phase-card.type";

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

const phaseCount: number = 5;
const handSizeStart: number = 100;
const handSizeMaximum: number = 10;

@Injectable({
    providedIn: 'root'
})
export class GameState{
    clientPlayerId = 0; //should be changed to reflect the client's player's id
    playerCount: number = 0;

    groupPlayerState = new BehaviorSubject<PlayerStateModel[]>([]);
    groupPlayerReady = new BehaviorSubject<PlayerReadyModel[]>([]);
    groupPlayerSelectedPhase = new BehaviorSubject<PlayerPhase[]>([]);
    phase = new BehaviorSubject<NonSelectablePhase>("planification")
    drawQueue = new BehaviorSubject<DrawModel[]>([])


    currentGroupPlayerState = this.groupPlayerState.asObservable();
    currentGroupPlayerReady = this.groupPlayerReady.asObservable();
    currentGroupPlayerSelectedPhase = this.groupPlayerSelectedPhase.asObservable()
    currentPhase = this.phase.asObservable();
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
            "hand": [],
            "played": [],
            "maximum": handSizeMaximum
        };
        newPlayer.research = {
            'drawMod': 0,
            'keepMod': 0,
        }

        //fill player's hand
        let newPlayerDraw = new DrawModel;
        newPlayerDraw.playerId = newPlayer.id
        newPlayerDraw.cardNumber = handSizeStart
        newPlayerDraw.drawRule = 'draw'
        this.addDrawQueue(newPlayerDraw)

        newPlayer.terraformingRating = 5;

        //adds newplayer's state to  groupPlayerState
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
        this.groupPlayerState.next(newState)
    };

    getPlayerStateFromId(playerId: number): PlayerStateModel{
        return this.groupPlayerState.getValue()[playerId]
    }

    getClientPlayerState(): PlayerStateModel{
        return this.getPlayerStateFromId(this.clientPlayerId)
    }


    updatePlayerState(playerId:number, playerState: PlayerStateModel): void{
        this.groupPlayerState.getValue()[playerId] = playerState
        //calls the groupState update to next subscriptions
        this.updateGroupPlayerState(this.groupPlayerState.getValue())
    }

    updateClientPlayerState(clientState: PlayerStateModel): void{
        this.updatePlayerState(this.clientPlayerId, clientState)
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
                this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase = phase
                break
            }
        }
        //global selectedPhase
        this.selectedPhase[phase]=true
    }

    /**
     * 
     * @param playerId  
     * @param currentPhase 
     * @returns undefined if the player didnt select the current phase or the phase card type they selected if equal to current phase
     */
    getPlayerSelectedPhaseCardType(playerId:number, currentPhase: SelectablePhase): PhaseCardType | undefined {
        let selectedPhase = this.getPlayerPhase(playerId)
        if(selectedPhase===undefined){return undefined}
        if(selectedPhase.currentSelectedPhase != currentPhase){
            return undefined
        }
        return selectedPhase.currentPhaseType
    }

    /**
     * 
     * @param playerId 
     * @returns the player's current selected phase
     */
    getPlayerSelectedPhase(playerId: number): SelectablePhase | undefined {
        for(let playerSelcted of this.groupPlayerSelectedPhase.getValue()){
            if(playerSelcted.playerId === playerId){
                return playerSelcted.currentSelectedPhase
            }
        }
        return undefined
    }

    /**
     * 
     * @param playerId 
     * @returns the player's selected PlayerPhase
     */
    getPlayerPhase(playerId: number): PlayerPhase | undefined {
        for(let playerSelcted of this.groupPlayerSelectedPhase.getValue()){
            if(playerSelcted.playerId === playerId){
                return playerSelcted
            }
        }
        return undefined
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
        return this.getPlayerStateHand(this.clientPlayerId)
        var playerState = this.getPlayerStateFromId(this.clientPlayerId)
        if(playerState===undefined){
            return []
        }
        return playerState.cards.hand
    }

    getPlayerStateHand(playerId: number): number[] {
        var playerState = this.getPlayerStateFromId(playerId)
        if(playerState===undefined){
            return []
        }
        return playerState.cards.hand
    }

    getPlayerStatePlayed(playerId: number): number[] {
        var playerState = this.getPlayerStateFromId(playerId)
        if(playerState===undefined){
            return []
        }
        return playerState.cards.played
    }

    updateClientPlayerStateHand(cardList: number[]): void {
        var clientState = this.getClientPlayerState()
        clientState.cards.hand = clientState.cards.hand.concat(cardList)
        this.updateClientPlayerState(clientState)
    }

    updatePlayerStateHand(playerId: number, newCardList: number[]): void {
        var playerState = this.getPlayerStateFromId(playerId)
        playerState.cards.hand = newCardList
        this.updatePlayerState(playerId, playerState)
    }

    updatePlayerStatePlayed(playerId: number, newCardList: number[]): void {
        var playerState = this.getPlayerStateFromId(playerId)
        playerState.cards.played = newCardList
        this.updatePlayerState(playerId, playerState)
    }

    addCardToPlayerHand(playerId: number, cardsToAdd: number[]):void{
        var playerStateHand = this.getPlayerStateHand(playerId)
        this.updatePlayerStateHand(playerId, playerStateHand.concat(cardsToAdd))
    }

    removeCardFromPlayerHand(playerId: number, cardsToRemove: number[]):void{
        let playerStateHand = this.getPlayerStateHand(playerId)
        playerStateHand = playerStateHand.filter( ( el ) => !cardsToRemove.includes( el ) );
        this.updatePlayerStateHand(playerId, playerStateHand)
    }

    addCardToPlayerPlayed(playerId: number, cardsToAdd: number[]):void{
        var playerStatePlayed = this.getPlayerStatePlayed(playerId)
        this.updatePlayerStatePlayed(playerId, playerStatePlayed.concat(cardsToAdd))
    }

    addDrawQueue(draw: DrawModel):void{
        this.drawQueue.next(this.drawQueue.getValue().concat([draw]));
    }

    removeDrawQueue(drawQueueElement: DrawModel[]): void{
        const newDrawQueue: DrawModel[] = this.drawQueue.getValue();

        drawQueueElement.forEach(element => {
            for(let i=0; i<this.drawQueue.getValue().length; i++){
                if(element===this.drawQueue.getValue()[i]){
                    newDrawQueue.splice(i,1)
                }
            }
        });
        this.drawQueue.next(newDrawQueue)
    }

    /**
     * gets nothing
     * returns nothing
     * emits a next signal for drawQueue.next()
     */
    cleanAndNextDrawQueue(): void{
        var newDrawQueue: DrawModel[] = [];
        //clean draw queue
        for(let drawTicket of this.drawQueue.getValue()){
            if(drawTicket.isFinalized!=true){
                newDrawQueue.push(drawTicket)
            }
        }
        this.drawQueue.next(newDrawQueue)
    }
}
