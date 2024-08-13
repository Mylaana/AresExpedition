import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { RGB } from "../../types/global.type";
import { PlayerPhase } from "../../interfaces/global.interface";
import { NonSelectablePhase, SelectablePhase } from "../../types/global.type";
import { DrawModel } from "../../models/core-game/draw.model";
import { PhaseCardType } from "../../types/phase-card.type";
import { EventModel } from "../../models/core-game/event.model";
import { PhaseCardInfoService } from "../phase/phase-card-info.service";
import { PhaseCardHolderModel, PhaseCardGroupModel } from "../../models/core-game/phase-card.model";
import { deepCopy } from "../../functions/global.functions";

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
const handSizeStart: number = 10;
const handSizeMaximum: number = 10;
const phaseNumber: number = 5;
const phaseCardNumberPerPhase: number = 3;

@Injectable({
    providedIn: 'root'
})
export class GameState{
    loading = new BehaviorSubject<boolean>(true);

    clientPlayerId = 0; //should be changed to reflect the client's player's id
    playerCount = new BehaviorSubject<number[]>([]);

    groupPlayerState = new BehaviorSubject<PlayerStateModel[]>([]);
    groupPlayerReady = new BehaviorSubject<PlayerReadyModel[]>([]);
    groupPlayerSelectedPhase = new BehaviorSubject<PlayerPhase[]>([]);
    phase = new BehaviorSubject<NonSelectablePhase>("planification")
    drawQueue = new BehaviorSubject<DrawModel[]>([])
    eventQueue = new BehaviorSubject<EventModel[]>([])

    currentGroupPlayerState = this.groupPlayerState.asObservable();
    currentGroupPlayerReady = this.groupPlayerReady.asObservable();
    currentGroupPlayerSelectedPhase = this.groupPlayerSelectedPhase.asObservable()
    currentPhase = this.phase.asObservable();
    currentDrawQueue = this.drawQueue.asObservable()
    currentEventQueue = this.eventQueue.asObservable()
    currentPlayerCount = this.playerCount.asObservable()
    currentLoadingState = this.loading.asObservable()

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

	constructor(private phaseCardService: PhaseCardInfoService){}

    addPlayer(playerName: string, playerColor: RGB): void {
        //creates and add player to groupPlayerState
        let newPlayer = new PlayerStateModel;
        newPlayer.id = this.groupPlayerState.getValue().length;
        newPlayer.name = playerName;
        newPlayer.color = playerColor;
        newPlayer.ressource = [
            {
                "id":0,
                "name": "megacredit",
                "valueMod": 0,
                "valueProd": 99,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": 9,
            },
            {
                "id":1,
                "name": "heat",
                "valueMod": 0,
                "valueProd": 99,
                "valueStock": 250,
                "hasStock": true,
                "imageUrlId": 7,
            },
            {
                "id":2,
                "name": "plant",
                "valueMod": 0,
                "valueProd": 120,
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
        newPlayer.vp = newPlayer.terraformingRating

        //adds newplayer's state to  groupPlayerState
        this.groupPlayerState.next(this.groupPlayerState.getValue().concat([newPlayer]));

        //creates and add player to groupPlayerReady
        let newPlayerReady = new PlayerReadyModel;
        newPlayerReady.id = newPlayer.id
        newPlayerReady.name = playerName;
        newPlayerReady.isReady = false
        this.groupPlayerReady.next(this.groupPlayerReady.getValue().concat(newPlayerReady))

        //creates and add player to groupPlayerSelectedPhase
        let newPlayerPhase: PlayerPhase;
        newPlayerPhase = {
            "playerId": newPlayer.id,
            "currentSelectedPhase": undefined,
            "currentPhaseType": undefined,
            "previousSelectedPhase": undefined
        }
        this.updateGroupPlayerSelectedPhase(this.groupPlayerSelectedPhase.getValue().concat([newPlayerPhase]))

		//adds phase cards info to model
		newPlayer.phaseCard = this.phaseCardService.getNewPhaseHolderModel(phaseNumber, phaseCardNumberPerPhase)
    };

    setPlayerIdList(playerIdList: number[]):void{
        this.playerCount.next(playerIdList)
    }

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
        let ready = this.groupPlayerReady.getValue()
        let loopStart: number;
        let loopFinish: number;

        if(playerId != undefined){
            loopStart = playerId
            loopFinish = playerId
        } else {
            loopStart = 0
            loopFinish = this.playerCount.getValue().length - 1
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
        let ready = this.groupPlayerReady.getValue()
        let loopStart: number;
        let loopFinish: number;

        if(playerId != undefined){
            loopStart = playerId
            loopFinish = playerId
        } else {
            loopStart = 0
            loopFinish = this.playerCount.getValue().length - 1
        }
        for(let i=loopStart; i<=loopFinish; i++){
            if(ready[i].isReady === false){
                return false
            }
        }
        return true
    };

    GoToNextPhaseIfPlayerReady(){
        let newPhase = this.goToNextPhase(this.phase.getValue())
        this.updatePhase(newPhase)
    };

    /**
     * @param currentPhase as NonSelectablePhase
     * @returns next phase name
     *
     * triggers all phase change and cleaning related stuff
     */
    goToNextPhase(currentPhase:NonSelectablePhase):NonSelectablePhase{
        let nextPhase: NonSelectablePhase;
        let startCounting: number = Math.max(this.phaseIndex + 1, 1) //start looping at phase index +1 or 1



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
     * @returns the player's PlayerPhase interface
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
    }

    getPlayerStateHand(playerId: number): number[] {
        let playerState = this.getPlayerStateFromId(playerId)
        if(playerState===undefined){
            return []
        }
        return playerState.cards.hand
    }

    getClientPlayerStatePlayed(): number[] {
        return this.getPlayerStatePlayed(this.clientPlayerId)
    }

    getPlayerStatePlayed(playerId: number): number[] {
        let playerState = this.getPlayerStateFromId(playerId)
        if(playerState===undefined){
            return []
        }
        return playerState.cards.played
    }

    updateClientPlayerStateHand(cardList: number[]): void {
        let clientState = this.getClientPlayerState()
        clientState.cards.hand = clientState.cards.hand.concat(cardList)
        this.updateClientPlayerState(clientState)
    }

    updatePlayerStateHand(playerId: number, newCardList: number[]): void {
        let playerState = this.getPlayerStateFromId(playerId)
        playerState.cards.hand = newCardList
        this.updatePlayerState(playerId, playerState)
    }

    updatePlayerStatePlayed(playerId: number, newCardList: number[]): void {
        let playerState = this.getPlayerStateFromId(playerId)
        playerState.cards.played = newCardList
        this.updatePlayerState(playerId, playerState)
    }

    addCardToPlayerHand(playerId: number, cardsToAdd: number[]):void{
        let playerStateHand = this.getPlayerStateHand(playerId)
        this.updatePlayerStateHand(playerId, playerStateHand.concat(cardsToAdd))
    }

    removeCardFromPlayerHand(playerId: number, cardsToRemove: number[]):void{
        let playerStateHand = this.getPlayerStateHand(playerId)
        playerStateHand = playerStateHand.filter( ( el ) => !cardsToRemove.includes( el ) );
        this.updatePlayerStateHand(playerId, playerStateHand)
    }

    addCardToPlayerPlayed(playerId: number, cardsToAdd: number[]):void{
        let playerStatePlayed = this.getPlayerStatePlayed(playerId)
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
        let newDrawQueue: DrawModel[] = [];
        //clean draw queue
        for(let drawTicket of this.drawQueue.getValue()){
            if(drawTicket.isFinalized!=true){
                newDrawQueue.push(drawTicket)
            }
        }
        this.drawQueue.next(newDrawQueue)
    }

    addEventQueue(event: EventModel, addOnTop?: boolean): void {
        let newQueue: EventModel[] = []
        if(addOnTop===true){
            newQueue.push(event)
            this.eventQueue.next(newQueue.concat(this.eventQueue.getValue()));
        } else {
            newQueue = newQueue.concat(this.eventQueue.getValue())
            newQueue.push(event)
            this.eventQueue.next(newQueue);
        }
    }

    /**
     * gets nothing
     * returns nothing
     * emits a next signal for eventQueue.next()
     */
    cleanAndNextEventQueue(): void{
        let newEventQueue: EventModel[] = [];
        //clean draw queue
        for(let ticket of this.eventQueue.getValue()){
            if(ticket.isFinalized!=true){
                newEventQueue.push(ticket)
            }
        }
        this.eventQueue.next(newEventQueue)
    }

	getPlayerPhaseCardHolder(playerId: number): PhaseCardHolderModel {
		return this.groupPlayerState.getValue()[playerId].phaseCard
	}
	getPlayerPhaseCardGroup(playerId: number, phaseIndex: number): PhaseCardGroupModel {
		return this.groupPlayerState.getValue()[playerId].phaseCard.phaseGroup[phaseIndex]
	}
	setPlayerUpgradedPhaseCardFromPhaseCardGroup(playerId: number, phaseIndex: number, phaseCardGroup: PhaseCardGroupModel): void {
		let playerState = this.getPlayerStateFromId(playerId)
		playerState.phaseCard.phaseGroup[phaseIndex] = phaseCardGroup
		this.updatePlayerState(playerId, playerState)
	}
	addPhaseCardUpgradeNumber(playerId:number, upgradeNumber: number):void{
		let playerState = this.getPlayerStateFromId(playerId)
		playerState.phaseCardUpgradeNumber =+ upgradeNumber
		this.updatePlayerState(playerId, playerState)
	}
	removePhaseCardUpgradeNumber(playerId:number, upgradeNumber: number = 1, removeAll: boolean = false):void{
		console.log('remove phase called')
		let playerState = this.getPlayerStateFromId(playerId)
		console.log('upgradenumber: ',upgradeNumber)
		console.log('state before: ',deepCopy(playerState.phaseCardUpgradeNumber))

		if(removeAll===true){
			playerState.phaseCardUpgradeNumber = 0
			console.log('remove all')
		} else {
			playerState.phaseCardUpgradeNumber -= upgradeNumber
		}
		console.log('state after: ', deepCopy(playerState.phaseCardUpgradeNumber))
		this.updatePlayerState(playerId, playerState)
	}
}
