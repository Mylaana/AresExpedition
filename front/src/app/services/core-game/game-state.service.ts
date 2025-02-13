import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { RGB } from "../../types/global.type";
import { CardRessourceStock, GlobalParameterValue, PlayerPhase, ScanKeep, RessourceStock, ProjectFilter } from "../../interfaces/global.interface";
import { NonSelectablePhase } from "../../types/global.type";
import { PhaseCardType, PhaseCardUpgradeType } from "../../types/phase-card.type";
import { DrawEvent, EventBaseModel } from "../../models/core-game/event.model";
import { ProjectCardModel} from "../../models/cards/project-card.model";
import { ProjectCardPlayedEffectService } from "../cards/project-card-played-effect.service";
import { ProjectCardInfoService } from "../cards/project-card-info.service";
import { WsDrawResult, WsGroupReady } from "../../interfaces/websocket.interface";
import { RxStompService } from "../websocket/rx-stomp.service";
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../../enum/phase.enum";
import { GLOBAL_CLIENT_ID } from "../../global/global-const";
import { PhaseCardModel } from "../../models/cards/phase-card.model";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";

interface SelectedPhase {
    "undefined": boolean,
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
const handSizeMaximum: number = 10;
const cardSellValue: number = 3;

@Injectable({
    providedIn: 'root'
})
export class GameState{
    loading = new BehaviorSubject<boolean>(true);

    clientPlayerId = GLOBAL_CLIENT_ID; //should be changed to reflect the client's player's id
    playerCount = new BehaviorSubject<number[]>([]);

    groupPlayerState = new BehaviorSubject<PlayerStateModel[]>([]);
    groupPlayerReady = new BehaviorSubject<PlayerReadyModel[]>([]);
    groupPlayerSelectedPhase = new BehaviorSubject<PlayerPhase[]>([]);
    phase = new BehaviorSubject<NonSelectablePhaseEnum>(NonSelectablePhaseEnum.undefined)
    drawQueue = new BehaviorSubject<DrawEvent[]>([])
    eventQueue = new BehaviorSubject<EventBaseModel[]>([])
	clientState: BehaviorSubject<PlayerStateModel> = new BehaviorSubject<PlayerStateModel>(PlayerStateModel.empty(this.injector))

    currentGroupPlayerState = this.groupPlayerState.asObservable();
    currentGroupPlayerReady = this.groupPlayerReady.asObservable();
    currentGroupPlayerSelectedPhase = this.groupPlayerSelectedPhase.asObservable()
    currentPhase = this.phase.asObservable();
    currentDrawQueue = this.drawQueue.asObservable()
    currentEventQueue = this.eventQueue.asObservable()
    currentPlayerCount = this.playerCount.asObservable()
    currentLoadingState = this.loading.asObservable()

	currentClientState = this.clientState.asObservable();

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
        "undefined": false,
        "development": false,
        "construction": false,
        "action": false,
        "production": false,
        "research": false
    }

	constructor(
        private projectCardService: ProjectCardInfoService,
		private readonly projectCardPlayed : ProjectCardPlayedEffectService,
        private rxStompService: RxStompService,
		private injector: Injector
	){}

    addPlayer(playerName: string, playerColor: RGB): void {

    };

    setPlayerIdList(playerIdList: number[]):void{
        this.playerCount.next(playerIdList)
    }

    public setCurrentPhase(newPhase: NonSelectablePhaseEnum): void {
        this.phase.next(newPhase)
        this.setClientReady(false)
    };

    public setClientReady(ready: boolean){
        this.setPlayerReady(this.clientPlayerId, ready)
    };

    public setPlayerReady(playerId: number, ready: boolean){
        let groupReady = this.groupPlayerReady.getValue()

        for(let player of groupReady){
            if(player.id===playerId){
                player.isReady = ready
                break
            }
        }
        this.groupPlayerReady.next(groupReady)
    }

    getClientReady(): boolean {
        return this.getPlayerReady(this.clientPlayerId)
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

    /*
    GoToNextPhaseIfPlayerReady(){
        let newPhase = this.goToNextPhase(this.phase.getValue())
        this.updatePhase(newPhase)
    }
        */

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
		//this.clientState.next(newState[this.clientPlayerId])
    }

    getPlayerStateFromId(playerId: number): PlayerStateModel{
        return this.groupPlayerState.getValue()[playerId]
    }

    getClientState(): PlayerStateModel{
        return this.getPlayerStateFromId(this.clientPlayerId)
    }


    updatePlayerState(playerId:number, playerState: PlayerStateModel): void{
        this.groupPlayerState.getValue()[playerId] = playerState
        //calls the groupState update to next subscriptions
        this.updateGroupPlayerState(this.groupPlayerState.getValue())
    }

    updateClientState(clientState: PlayerStateModel): void{
        this.updatePlayerState(this.clientPlayerId, clientState)
		this.clientState.next(clientState)
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
    playerSelectPhase(playerId:number, phase:SelectablePhaseEnum):void{
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
        //this.selectedPhase[phase]=true

    }
    clientPlayerValidateSelectedPhase(): void {
        this.rxStompService.publishSelectedPhase(this.getClientCurrentSelectedPhase())
    }
    /**
     *
     * @param playerId
     * @param currentPhase
     * @returns undefined if the player didnt select the current phase or the phase card type they selected if equal to current phase
     */
    getPlayerSelectedPhaseCardType(playerId:number, currentPhase: SelectablePhaseEnum): PhaseCardType | undefined {
        let selectedPhase = this.getPlayerPhase(playerId)
        if(selectedPhase===undefined){return undefined}
        if(selectedPhase.currentSelectedPhase != currentPhase){
            return undefined
        }
        return selectedPhase.currentPhaseType
    }

    getClientCurrentSelectedPhase(): SelectablePhaseEnum {
        return this.getPlayerCurrentSelectedPhase(this.clientPlayerId)
    }
    /**
     *
     * @param playerId
     * @returns the player's current selected phase
     */
    getPlayerCurrentSelectedPhase(playerId: number): SelectablePhaseEnum {
        for(let playerSelcted of this.groupPlayerSelectedPhase.getValue()){
            if(playerSelcted.playerId === playerId){
                return playerSelcted.currentSelectedPhase
            }
        }
        return SelectablePhaseEnum.undefined
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
            this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase = SelectablePhaseEnum.undefined
        }
    }

    updateGroupPlayerSelectedPhase(newGroupPlayerSelectedPhase: PlayerPhase[]):void{
        this.groupPlayerSelectedPhase.next(newGroupPlayerSelectedPhase)
    }

	getClientPhaseSelected(): SelectablePhaseEnum | undefined {return this.getClientState().getPhaseSelected()}
    getClientUpgradedPhaseCards(): PhaseCardModel[] {return this.getClientState().getUpgradedPhaseCards()}
    getClientHandIdList(): number[] {return this.getClientState().getProjectHandIdList()}
    getClientHandModelList(): ProjectCardModel[] {return this.projectCardService.getProjectCardList(this.getClientHandIdList())}

    getClientProjectPlayedIdList(): number[] {return this.getPlayerProjectPlayedIdList(this.clientPlayerId)}
	getPlayerProjectPlayedIdList(playerId: number): number[] {return this.getPlayerStateFromId(playerId).getProjectPlayedIdList()}
    getClientProjectPlayedModelList(filter?: ProjectFilter): ProjectCardModel [] {return this.getPlayerProjectPlayedModelList(this.clientPlayerId, filter)}
    getPlayerProjectPlayedModelList(playerId: number, filter?: ProjectFilter): ProjectCardModel[] {return this.getPlayerStateFromId(playerId).getProjectPlayedModelList(filter)}

    addCardsToClientHand(cardsToAdd: number | number[]):void{
        let clientState = this.getClientState()
        clientState.addCardsToHand(cardsToAdd)
		this.updateClientState(clientState)
    }

    removeCardsFromClientHand(cardsToRemove: number | number[]):void{
		let clientState = this.getClientState()
        clientState.removeCardsFromHand(cardsToRemove)
		this.updateClientState(clientState)
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
	/*
	getPlayerPhaseCardHolder(playerId: number): PhaseCardHolderModel {
		return this.groupPlayerState.getValue()[playerId].phaseCards
	}
	getPlayerPhaseCardGroup(playerId: number, phaseIndex: number): PhaseCardGroupModel {
		return this.groupPlayerState.getValue()[playerId].phaseCards.phaseGroups[phaseIndex]
	}
	*/
	setClientPhaseCardUpgraded(upgrade: PhaseCardUpgradeType): void {
		let state = this.getClientState()
		state.setPhaseCardUpgraded(upgrade)
		this.updateClientState(state)
	}
	sellCardsFromClientHand(quantity: number){
		let playerState = this.getClientState()
		playerState.addRessource('megacredit', quantity * (cardSellValue + playerState.getSellCardValueMod()))
		this.updateClientState(playerState)
	}
	playCardFromClientHand(card: ProjectCardModel):void{
        let events: EventBaseModel[] = []
		let newState: PlayerStateModel = this.projectCardPlayed.playCard(card, this.getClientState())
		let playedCardEvents = this.projectCardPlayed.getPlayedCardEvent(card)

        this.updateClientState(newState)


        //check for triggers and add them to queue
        let onPlayedTriggers = newState.getTriggersIdOnPlayedCard()
        if(onPlayedTriggers.length!=0){
            let eventsOnPlayed = this.projectCardPlayed.getEventTriggerByPlayedCard(card, onPlayedTriggers, newState)
            if(eventsOnPlayed!=undefined){
                events = events.concat(eventsOnPlayed)
            }
        }

        let onTagGainedTriggers = newState.getTriggersIdOnGainedTag()
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
    setClientTriggerAsInactive(triggerId: number): void {
        let newState: PlayerStateModel = this.getClientState()
        newState.setTriggerInactive(triggerId)

        this.updateClientState(newState)
    }
	removeMegaCreditsFromPlayer(playerId:number, quantity:number):void {
		let playerState = this.getPlayerStateFromId(playerId)
		playerState.addRessource("megacredit", -quantity)
		this.updatePlayerState(playerId, playerState)
	}
    addGlobalParameterStepsEOPtoPlayerId(playerId:number, parameter:GlobalParameterValue): void {
        let newState = this.getPlayerStateFromId(playerId)
		newState.addGlobalParameterStepEOP(parameter)
		this.updatePlayerState(playerId, newState)

        let triggers = newState.getTriggersIdOnParameterIncrease()
        if(triggers.length===0){return}

        let events = this.projectCardPlayed.getEventTriggerByGlobalParameterIncrease(triggers,parameter)
        if(!events){return}


        this.addEventQueue(events, 'first')

    }
    addRessourceToClient(ressources: RessourceStock[]): void {
        let playerState = this.getClientState()

        for(let ressource of ressources){
            playerState.addRessource(ressource.name, ressource.valueStock)
        }
        this.updateClientState(playerState)
    }
    addRessourceToClientCard(cardStock: CardRessourceStock): void {
        let newState = this.getClientState()

        for(let stock of cardStock.stock){
            newState.addRessourceToCard(cardStock.cardId, stock)
        }

        this.updateClientState(newState)

        for(let ressource of cardStock.stock){
            let card = newState.getProjectPlayedModelFromId(cardStock.cardId)
            if(!card){continue}

            let triggers = newState.getTriggersIdOnRessourceAddedToCard()
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
    addClientResearchScanValue(scan: number): void {
        let newState = this.getClientState()
        newState.addResearchValue({scan:scan})
        this.updateClientState(newState)
    }
    addClientResearchKeepValue(keep: number): void {
        let newState = this.getClientState()
        newState.addResearchValue({keep:keep})
        this.updateClientState(newState)
    }
    getClientResearchMods(): ScanKeep {
        return this.getClientState().getResearch()
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
    public setGroupReady(wsGroupReady: WsGroupReady[]): void {
		console.log('set group ready:',wsGroupReady)
        for(let ready of wsGroupReady){
            this.setPlayerReady(ready.playerId,ready.ready)
        }
    }
    public clearEventQueue(){
		this.eventQueue.next([])
	}
    public finalizeEventWaitingGroupReady(){
        if(this.eventQueue.getValue().length===0){return}

        for(let event of this.eventQueue.getValue()){
            if(event.subType==='waitingGroupReady'){
                event.finalized = true
            }
        }
        this.cleanAndNextEventQueue()
    }

	public startGame(){
	}

	public setGameLoaded(){
		this.loading.next(false)
	}
	public setGroupStateFromJson(dto: PlayerStateDTO[]){
		let groupPlayerState: PlayerStateModel[] = []
		let playerIdList: number[] = []
		for(let playerStateDTO of dto){
			//add playerId to list
			playerIdList.push(playerStateDTO.infoState.i)

			//add playerstate
			groupPlayerState.push(PlayerStateModel.fromJson(playerStateDTO, this.injector))
		}
		this.setPlayerIdList(playerIdList)
		this.updateGroupPlayerState(groupPlayerState)

		//creates and add player to groupPlayerSelectedPhase
		let result: PlayerPhase[] = []
		for(let i=0; i<4; i++){
			let newPlayerPhase: PlayerPhase;
			newPlayerPhase = {
				"playerId": i,
				"currentSelectedPhase": SelectablePhaseEnum.undefined,
				"currentPhaseType": undefined,
				"previousSelectedPhase": SelectablePhaseEnum.undefined
			}
			result.push(newPlayerPhase)
		}

        //creates and add player to groupPlayerReady
		let groupReady: PlayerReadyModel[] = []
		for(let i=0; i<4; i++){
			let playerReady = new PlayerReadyModel;
			playerReady.id = i
			playerReady.isReady = false

			groupReady.push(playerReady)
		}
        this.groupPlayerReady.next(groupReady)

		this.updateGroupPlayerSelectedPhase(result)
		console.log(this.groupPlayerSelectedPhase.getValue())
		console.log('loaded: ', this.groupPlayerState.getValue())
		console.log('group ready:', this.groupPlayerReady.getValue())
	}

	public getPlayerCount(): number {
		return this.groupPlayerState.getValue().length
	}
}
