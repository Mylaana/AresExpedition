import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { RGB } from "../../types/global.type";
import { CardRessourceStock, GlobalParameterValue, PlayerPhase, ScanKeep, RessourceStock } from "../../interfaces/global.interface";
import { NonSelectablePhase, SelectablePhase } from "../../types/global.type";
import { PhaseCardType } from "../../types/phase-card.type";
import { DrawEvent, EventBaseModel } from "../../models/core-game/event.model";
import { PhaseCardInfoService } from "../cards/phase-card-info.service";
import { PhaseCardHolderModel, PhaseCardGroupModel, PhaseCardModel } from "../../models/cards/phase-card.model";
import { ProjectCardModel, ProjectCardState } from "../../models/cards/project-card.model";
import { ProjectCardPlayedEffectService } from "../cards/project-card-played-effect.service";
import { ProjectCardInfoService } from "../cards/project-card-info.service";
import { EventDesigner } from "../designers/event-designer.service";
import { GlobalInfo } from "../global/global-info.service";
import { WsDrawResult, WsGroupReady } from "../../interfaces/websocket.interface";
import { RxStompService } from "../websocket/rx-stomp.service";

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

type EventPileAddRule = 'first' | 'second' | 'last'


const phaseCount: number = 5;
const handSizeStart: number = 8;
const handSizeMaximum: number = 10;
const phaseNumber: number = 5;
const phaseCardNumberPerPhase: number = 3;
const cardSellCost: number = 3;

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
    drawQueue = new BehaviorSubject<DrawEvent[]>([])
    eventQueue = new BehaviorSubject<EventBaseModel[]>([])

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

	constructor(
        private projectCardService: ProjectCardInfoService,
		private phaseCardService: PhaseCardInfoService,
		private readonly projectCardPlayed : ProjectCardPlayedEffectService,
        private rxStompService: RxStompService
	){}

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
                "valueProd": 0,
				"valueBaseProd": 0,
                "valueStock": 52,
                "hasStock": true,
                "imageUrlId": GlobalInfo.getIdFromType('megacredit'),
            },
            {
                "id":1,
                "name": "heat",
                "valueMod": 0,
                "valueProd": 0,
				"valueBaseProd": 0,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": GlobalInfo.getIdFromType('heat'),
            },
            {
                "id":2,
                "name": "plant",
                "valueMod": 0,
                "valueProd": 0,
				"valueBaseProd": 0,
                "valueStock": 0,
                "hasStock": true,
                "imageUrlId": GlobalInfo.getIdFromType('plant'),
            },
            {
                "id":3,
                "name": "steel",
                "valueMod": 2,
                "valueProd": 0,
				"valueBaseProd": 0,
                "valueStock": 0,
                "hasStock": false,
                "imageUrlId": GlobalInfo.getIdFromType('steel'),
            },
            {
                "id":4,
                "name": "titanium",
                "valueMod": 3,
                "valueProd": 0,
				"valueBaseProd": 0,
                "valueStock": 0,
                "hasStock": false,
                "imageUrlId": GlobalInfo.getIdFromType('titanium'),
            },
            {
                "id":5,
                "name": "card",
                "valueMod": 0,
                "valueProd": 0,
				"valueBaseProd": 0,
                "valueStock": 0,
                "hasStock": false,
                "imageUrlId": GlobalInfo.getIdFromType('card'),
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
        newPlayer.cards = new ProjectCardState(this.projectCardService)
        newPlayer.cards.maximum = handSizeMaximum

        newPlayer.research = {
            keep: 0,
            scan: 0,
        }

        //fill player's hand
        if(newPlayer.id===this.clientPlayerId){
            setTimeout(() => this.addEventQueue(EventDesigner.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:handSizeStart}}), 'first'), 2000)
            
        }

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
		newPlayer.phaseCards = this.phaseCardService.getNewPhaseHolderModel(phaseNumber, phaseCardNumberPerPhase)
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
        this.setClientPlayerReady(false)
        this.phase.next(newPhase)
    };

    /**
     * @param playerId
     * @returns
     * set player with id to be ready or not according to {playerReady}

     * if no id specified, will set all players to not {playerReady}
     * */
    setClientPlayerReady(ready: boolean){
        console.log('clientplayerReady called')
        this.setPlayerReady(this.clientPlayerId, ready)
        this.rxStompService.publishClientPlayerReady(true)
    };
    private setPlayerReady(playerId: number, ready: boolean){
        let groupReady = this.groupPlayerReady.getValue()

        for(let player of groupReady){
            if(player.id===playerId){
                player.isReady = ready
                break
            }
        }
        this.groupPlayerReady.next(groupReady)
    }

    getPlayerReady(playerId?: number): boolean {
        let groupReady = this.groupPlayerReady.getValue()

        for(let player of groupReady){
            if(player.id===playerId){
                return player.isReady
            }
            
        }
        return false
    }

    GoToNextPhaseIfPlayerReady(){
        let newPhase = this.goToNextPhase(this.phase.getValue())
        this.updatePhase(newPhase)
    }

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
    }

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

    getClientPlayerSelectedPhaseCards(): PhaseCardModel[] {
        return this.getClientPlayerState().phaseCards.getSelectedPhaseCards()
    }

    getClientPlayerStateHand(): number[] {
        return this.getPlayerStateHand(this.clientPlayerId)
    }
    
    getClientPlayerStateHandProject(): ProjectCardModel[] {
        return this.getClientPlayerState().cards.getHandProject()
    }

    getPlayerStateHand(playerId: number): number[] {
        return this.getPlayerStateFromId(playerId).cards.hand
    }

    getClientPlayerPlayedCardsId(): number[] {
        return this.getPlayerPlayedCardsId(this.clientPlayerId)
    }

    getPlayerPlayedCardsId(playerId: number): number[] {
        return this.getPlayerStateFromId(playerId).cards.getProjectIdList()
    }

    getClientPlayerPlayedCardsProject(): ProjectCardModel [] {
        return this.getPlayerPlayedCardsProject(this.clientPlayerId)
    }
    
    getPlayerPlayedCardsProject(playerId: number): ProjectCardModel[] {
        return this.getPlayerStateFromId(playerId).cards.getProjectPlayedList()
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

    addCardToPlayerHand(playerId: number, cardsToAdd: number[]):void{
        let playerStateHand = this.getPlayerStateHand(playerId)
        this.updatePlayerStateHand(playerId,  playerStateHand.concat(cardsToAdd))
    }

    removeCardFromPlayerHand(playerId: number, cardsToRemove: ProjectCardModel[]):void{
        let playerStateHand = this.getPlayerStateHand(playerId)
        let cardsIdToRemove = this.projectCardService.getProjectCardIdListFromModel(cardsToRemove)
        playerStateHand = playerStateHand.filter( ( el ) => !cardsIdToRemove.includes( el ));
        this.updatePlayerStateHand(playerId, playerStateHand)
    }

    addDrawQueue(drawEvent: DrawEvent):void{
        this.drawQueue.next(this.drawQueue.getValue().concat([drawEvent]));
    }

    removeDrawQueue(drawQueueElement: DrawEvent[]): void{
        const newDrawQueue: DrawEvent[] = this.drawQueue.getValue();

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
        let newDrawQueue: DrawEvent[] = [];
        //clean draw queue
        for(let drawEvent of this.drawQueue.getValue()){
            if(drawEvent.finalized!=true){
                newDrawQueue.push(drawEvent)
            }
        }
        this.drawQueue.next(newDrawQueue)
    }

    addEventQueue(events: EventBaseModel | EventBaseModel[], addRule: EventPileAddRule): void {
        let newQueue: EventBaseModel[] = []
        let addEvents: EventBaseModel[] = []

        if(!Array.isArray(events)){
            addEvents.push(events)
        } else {
            addEvents = events
        }
        
        switch(addRule){
            case('last'):{
                newQueue = newQueue.concat(this.eventQueue.getValue(), addEvents)
                break
            }
            case('first'):{
                newQueue = newQueue.concat(addEvents, this.eventQueue.getValue())
                break
            }
            case('second'):{
                let oldQueue = this.eventQueue.getValue()
                let firstEvent = oldQueue.shift()
                newQueue = newQueue.concat(firstEvent?[firstEvent]:[], addEvents, oldQueue)
            }
        }

        this.eventQueue.next(newQueue)
    }
    
    /**
     * gets nothing
     * returns nothing
     * emits a next signal for eventQueue.next()
     */
    cleanAndNextEventQueue(): void{
        let newEventQueue: EventBaseModel[] = [];
        //clean draw queue
        for(let ticket of this.eventQueue.getValue()){
            if(ticket.finalized!=true){
                newEventQueue.push(ticket)
            }
        }
        this.eventQueue.next(newEventQueue)
    }

	getPlayerPhaseCardHolder(playerId: number): PhaseCardHolderModel {
		return this.groupPlayerState.getValue()[playerId].phaseCards
	}
	getPlayerPhaseCardGroup(playerId: number, phaseIndex: number): PhaseCardGroupModel {
		return this.groupPlayerState.getValue()[playerId].phaseCards.phaseGroups[phaseIndex]
	}
	setPlayerUpgradedPhaseCardFromPhaseCardGroup(playerId: number, phaseIndex: number, phaseCardGroup: PhaseCardGroupModel): void {
		let playerState = this.getPlayerStateFromId(playerId)
		playerState.phaseCards.phaseGroups[phaseIndex] = phaseCardGroup
		this.updatePlayerState(playerId, playerState)
	}
	sellCardsFromClientHand(quantity: number){
		let playerState = this.getClientPlayerState()
		playerState.ressource[0].valueStock += quantity * (cardSellCost + playerState.sellCardValueMod)
		this.updateClientPlayerState(playerState)
	}
	playCardFromClientHand(card: ProjectCardModel):void{
        let events: EventBaseModel[] = []
		let newState: PlayerStateModel = this.projectCardPlayed.playCard(card, this.getClientPlayerState())
		let playedCardEvents = this.projectCardPlayed.getPlayedCardEvent(card)

        this.updateClientPlayerState(newState)


        //check for triggers and add them to queue
        let onPlayedTriggers = newState.cards.getTriggersOnPlayedCard()
        if(onPlayedTriggers.length!=0){
            let eventsOnPlayed = this.projectCardPlayed.getEventTriggerByPlayedCard(card, onPlayedTriggers, newState)
            if(eventsOnPlayed!=undefined){
                events = events.concat(eventsOnPlayed)
            }
        }

        let onTagGainedTriggers = newState.cards.getTriggersOnGainedTag()
        if(onTagGainedTriggers.length!=0){
            let eventsOnTagGained = this.projectCardPlayed.getTriggerByTagGained(card, onTagGainedTriggers)
            if(eventsOnTagGained!=undefined){
                events = events.concat(eventsOnTagGained)
            }
        }
       
        if(playedCardEvents!=undefined){
            events = events.concat(playedCardEvents)
        }
        if(events.length===0){return}

        events.reverse()
        this.addEventQueue(events, 'first')
	}
    setClientPlayerTriggerAsInactive(triggerId: number): void {
        let newState: PlayerStateModel = this.getClientPlayerState()
        newState.cards.setTriggerAsInactive(triggerId)
    
        this.updateClientPlayerState(newState)
    }
	removeMegaCreditsFromPlayer(playerId:number, quantity:number):void {
		let playerState = this.getPlayerStateFromId(playerId)
		playerState.ressource[0].valueStock -= quantity
		this.updatePlayerState(playerId, playerState)
	}
    addGlobalParameterStepsEOPtoPlayerId(playerId:number, parameter:GlobalParameterValue): void {
        let newState = this.getPlayerStateFromId(playerId)
		newState.globalParameter.addStepToParameterEOP(parameter)
		this.updatePlayerState(playerId, newState)

        let triggers = newState.cards.getTriggersOnParameterIncreaseId()
        if(triggers.length===0){return}

        let events = this.projectCardPlayed.getEventTriggerByGlobalParameterIncrease(triggers,parameter)
        if(!events){return}


        this.addEventQueue(events, 'first')

    }
    addRessourceToClientPlayer(ressources: RessourceStock[]): void {
        let playerState = this.getClientPlayerState()

        for(let ressource of ressources){
            playerState.addRessource(ressource.name, ressource.valueStock)
        }
        this.updateClientPlayerState(playerState)
    }
    addRessourceToClientPlayerCard(cardStock: CardRessourceStock): void {
        let newState = this.getClientPlayerState()

        for(let stock of cardStock.stock){
            newState.cards.addRessourceToCard(cardStock.cardId, stock)
        }

        this.updateClientPlayerState(newState)

        for(let ressource of cardStock.stock){
            let card = newState.cards.getPlayedProjectCardFromId(cardStock.cardId)
            if(!card){continue}
            
            let triggers = newState.cards.getTriggersOnRessourceAddedToCardId()
            if(triggers.length===0){break}

            let events = this.projectCardPlayed.getEventTriggerByRessourceAddedToCard(
                card,
                triggers,
                ressource
            )
            if(!events){continue}
            this.addEventQueue(events, 'first')
        }
    }
    addClientPlayerResearchScanValue(scan: number): void {
        let newState = this.getClientPlayerState()
        newState.research.scan += scan
        this.updateClientPlayerState(newState)
    }
    addClientPlayerResearchKeepValue(keep: number): void {
        let newState = this.getClientPlayerState()
        newState.research.keep += keep
        this.updateClientPlayerState(newState)
    }
    getClientPlayerResearchMods(): ScanKeep {
        return this.getClientPlayerState().research
    }
    handleWsDrawResult(wsDrawResult: WsDrawResult): void {
        let eventFound: boolean = false
        let drawQueue = this.drawQueue.getValue()
        for(let event of drawQueue){
            if(event.waiterId!=wsDrawResult.eventId){continue}
            event.served = true
            event.drawResultCardList = wsDrawResult.cardIdList
            eventFound = true
            this.cleanAndNextDrawQueue()
            break
        }

        if(eventFound===false){
            console.log('event not found', wsDrawResult, drawQueue, this.eventQueue.getValue())
        }
    }
    handleWsGroupReady(wsGroupReady: WsGroupReady[]): void {
        for(let wsReady of wsGroupReady){
            this.setPlayerReady(wsReady.playerId, wsReady.ready)
        }
    }
}
