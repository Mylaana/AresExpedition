import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { myUUID, PlayableCardType, RGB } from "../../types/global.type";
import { CardRessourceStock, GlobalParameterValue, PlayerPhase, ScanKeep, RessourceStock, ProjectFilter } from "../../interfaces/global.interface";
import { NonSelectablePhase } from "../../types/global.type";
import { PhaseCardType, PhaseCardUpgradeType } from "../../types/phase-card.type";
import { DrawEvent, EventBaseModel } from "../../models/core-game/event.model";
import { PlayableCardModel} from "../../models/cards/project-card.model";
import { ProjectCardPlayedEffectService } from "../cards/project-card-played-effect.service";
import { ProjectCardInfoService } from "../cards/project-card-info.service";
import { WsDrawResult, WsGroupReady, WsOceanResult } from "../../interfaces/websocket.interface";
import { RxStompService } from "../websocket/rx-stomp.service";
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../../enum/phase.enum";
import { PhaseCardModel } from "../../models/cards/phase-card.model";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GameParamService } from "./game-param.service";
import { EventDesigner } from "../designers/event-designer.service";
import { EventStateDTO } from "../../interfaces/dto/event-state-dto.interface";
import { Utils } from "../../utils/utils";
import { GlobalParameterNameEnum, OceanBonusEnum } from "../../enum/global.enum";
import { EventStateTypeEnum } from "../../enum/eventstate.enum";
import { EventStateFactory } from "../designers/event-state-factory.service";

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

const cardSellValue: number = 3;

@Injectable({
    providedIn: 'root'
})
export class GameState{
    loading = new BehaviorSubject<boolean>(true);

    private clientId!: myUUID
    playerCount = new BehaviorSubject<myUUID[]>([]);
	private eventQueueSavedState: EventStateDTO[] = []

    private groupPlayerState = new BehaviorSubject<PlayerStateModel[]>([]);
    private groupPlayerReady = new BehaviorSubject<PlayerReadyModel[]>([]);
    private groupPlayerSelectedPhase = new BehaviorSubject<PlayerPhase[]>([]);
    private phase = new BehaviorSubject<NonSelectablePhaseEnum>(NonSelectablePhaseEnum.undefined)
    private drawQueue = new BehaviorSubject<DrawEvent[]>([])
    private eventQueue = new BehaviorSubject<EventBaseModel[]>([])
	private clientState: BehaviorSubject<PlayerStateModel> = new BehaviorSubject<PlayerStateModel>(PlayerStateModel.empty(this.injector))
	private selectedPhaseList = new BehaviorSubject<SelectablePhaseEnum[]>([])

    currentGroupPlayerState = this.groupPlayerState.asObservable();
    currentGroupPlayerReady = this.groupPlayerReady.asObservable();
    currentGroupPlayerSelectedPhase = this.groupPlayerSelectedPhase.asObservable()
    currentPhase = this.phase.asObservable();
    currentDrawQueue = this.drawQueue.asObservable()
    currentEventQueue = this.eventQueue.asObservable()
    currentPlayerCount = this.playerCount.asObservable()
    currentLoadingState = this.loading.asObservable()
	currentSelectedPhaseList = this.selectedPhaseList.asObservable()

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
		private gameParam: GameParamService,
		private injector: Injector
	){
		this.gameParam.currentClientId.subscribe((id) => {if(id){this.clientId = id}})
	}

    addPlayer(playerName: string, playerColor: RGB): void {

    };

    setPlayerIdList(playerIdList: myUUID[]):void{
        this.playerCount.next(playerIdList)
    }

    public setCurrentPhase(newPhase: NonSelectablePhaseEnum): void {
        this.phase.next(newPhase)
        this.setClientReady(false)
    };

    public setClientReady(ready: boolean){
        this.setPlayerReady(this.clientId, ready)
    };

    public setPlayerReady(playerId: string, ready: boolean){
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
        return this.getPlayerReady(this.clientId)
    }
    getPlayerReady(playerId?: myUUID): boolean {
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
	/*
    goToNextPhase(currentPhase:NonSelectablePhase):NonSelectablePhase{
        let nextPhase: NonSelectablePhase;
        let startCounting: number = Math.max(this.phaseIndex + 1, 1) //start looping at phase index +1 or 1
		console.log('GO TO NEXT PHASE')

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
		*/

    updateGroupPlayerState(newState: PlayerStateModel[]): void{
        this.groupPlayerState.next(newState)
		//this.clientState.next(newState[this.clientPlayerId])
    }

    getPlayerStateFromId(playerId: myUUID): PlayerStateModel | undefined{
		for(let state of this.groupPlayerState.getValue()){
			if(state.getId()===playerId){return state}
		}
        return undefined
    }

    getClientState(): PlayerStateModel{
        return this.clientState.getValue()
    }
	getClientStateDTO(): PlayerStateDTO {
		return this.getClientState().toJson(this.eventQueue.getValue())
	}
	/*
    updatePlayerState(playerId:myUUID, playerState: PlayerStateModel): void{
        this.groupPlayerState.getValue()[playerId] = playerState
        //calls the groupState update to next subscriptions
        this.updateGroupPlayerState(this.groupPlayerState.getValue())
    }
	*/

    updateClientState(clientState: PlayerStateModel): void{
        //this.updatePlayerState(this.clientPlayerId, clientState)
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

    clientSelectPhase(phase:SelectablePhaseEnum):void{
        if(phase===SelectablePhaseEnum.undefined){
            return
        }
		let state = this.getClientState()
		state.setPhaseSelected(phase)
		this.updateClientState(state)
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
    getPlayerSelectedPhaseCardType(playerId:myUUID, currentPhase: SelectablePhaseEnum): PhaseCardType | undefined {
        let selectedPhase = this.getPlayerPhase(playerId)
        if(selectedPhase===undefined){return undefined}
        if(selectedPhase.currentSelectedPhase != currentPhase){
            return undefined
        }
        return selectedPhase.currentPhaseType
    }

    getClientCurrentSelectedPhase(): SelectablePhaseEnum {
        return this.getClientState().getPhaseSelected()
    }
    /**
     *
     * @param playerId
     * @returns the player's current selected phase
     */
    getPlayerCurrentSelectedPhase(playerId: myUUID): SelectablePhaseEnum {
		console.log(this.groupPlayerSelectedPhase.getValue(), playerId)
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
    getPlayerPhase(playerId: myUUID): PlayerPhase | undefined {
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
	/*
    resetPhaseSelection(){
		console.log('RESET PHASE SELECTION')
        for(let i=0; i<this.groupPlayerSelectedPhase.getValue().length; i++){
            this.groupPlayerSelectedPhase.getValue()[i].previousSelectedPhase = this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase
            this.groupPlayerSelectedPhase.getValue()[i].currentSelectedPhase = SelectablePhaseEnum.undefined
        }
    }
*/
    updateGroupPlayerSelectedPhase(newGroupPlayerSelectedPhase: PlayerPhase[]):void{
        this.groupPlayerSelectedPhase.next(newGroupPlayerSelectedPhase)
    }

	getClientPhaseSelected(): SelectablePhaseEnum | undefined {return this.getClientState().getPhaseSelected()}
	getClientPreviousPhaseSelected(): SelectablePhaseEnum | undefined {return this.getClientState().getPreviousPhaseSelected()}
	getClientPhaseCards(onlyUpgraded: boolean = false): PhaseCardModel[] {return this.getClientState().getPhaseCards(onlyUpgraded)}
    getClientHandIdList(filter?: ProjectFilter): number[] {return this.getClientState().getProjectHandIdList(filter)}
    getClientHandModelList(filter?: ProjectFilter): PlayableCardModel[] {return this.projectCardService.getProjectCardList(this.getClientHandIdList(filter))}
	getClientHandCorporationIdList(filter?: ProjectFilter): number[] {return this.getClientState().getCorporationHandIdList()}
	getClientHandCorporationModelList(): PlayableCardModel[] {return this.projectCardService.getProjectCardList(this.getClientHandCorporationIdList())}

    getClientProjectPlayedIdList(): number[] {return this.getPlayerProjectPlayedIdList(this.clientId)}
	getPlayerProjectPlayedIdList(playerId: myUUID): number[] {return this.getPlayerStateFromId(playerId)?.getProjectPlayedIdList()??[]}
    getClientProjectPlayedModelList(filter?: ProjectFilter): PlayableCardModel [] {return this.getPlayerProjectPlayedModelList(this.clientId, filter)}
    getPlayerProjectPlayedModelList(playerId: myUUID, filter?: ProjectFilter): PlayableCardModel[] {return this.getPlayerStateFromId(playerId)?.getProjectPlayedModelList(filter)??[]}

    addCardsToClientHand(cardsToAdd: number | number[]):void{
        let clientState = this.getClientState()
        clientState.addCardsToHand(cardsToAdd)
		this.updateClientState(clientState)
    }
	addCardsToClientDiscard(cardsToAdd: number | number[]):void{
		let clientState = this.getClientState()
        clientState.addCardsToDiscard(cardsToAdd)
		this.updateClientState(clientState)
	}
	addCardsSelectedFromListAndDiscardTheRest(cardsToKeep: number | number[], cardList: number[]){
		this.addCardsToClientHand(cardsToKeep)
		this.addCardsToClientDiscard(cardList.filter(toDiscard => !Utils.toArray(cardsToKeep).includes(toDiscard)))
	}
    removeCardsFromClientHandById(cardsToRemove: number | number[], cardType: PlayableCardType):void{
		let clientState = this.getClientState()
        clientState.removeCardsFromHand(cardsToRemove, cardType)
		this.updateClientState(clientState)
    }
    removeCardsFromClientHandByModel(cardsToRemove: PlayableCardModel | PlayableCardModel[], cardType: PlayableCardType):void{
		let removeListId: number[] = []
		if(!Array.isArray(cardsToRemove)){
			this.removeCardsFromClientHandById(cardsToRemove.id, cardType)
			return
		}

		for(let removeCard of cardsToRemove){
			removeListId.push(removeCard.id)
		}
		this.removeCardsFromClientHandById(removeListId, cardType)
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
	/**
	 *
	 * adding one or multiple events in queue at the specified [addrule] position, if multiple events added this way, the received order is preserved.	 *
	 */
    addEventQueue(events: EventBaseModel | EventBaseModel[], addRule: EventPileAddRule): void {
        let newQueue: EventBaseModel[] = []
        let addEvents: EventBaseModel[] = Utils.toArray(events)

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
		if(this.eventQueueSavedState.length>0){
			//load data in existing events
			this.loadEventQueueSavedState(newQueue)
			//create new events
			newQueue = EventStateFactory.createEventsFromJson(this.eventQueueSavedState, this.getClientState()).concat(newQueue)
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
	playCardFromClientHand(card: PlayableCardModel, cardType: PlayableCardType):void{
        let events: EventBaseModel[] = []
		let newState: PlayerStateModel = this.projectCardPlayed.playCard(card, this.getClientState(), cardType)
        this.updateClientState(newState)
		console.log('played',Utils.jsonCopy(card))

		let playedCardEvents = this.projectCardPlayed.getPlayedCardEvent(card)

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
        this.addEventQueue(events, 'first')
	}
    setClientTriggerAsInactive(triggerId: number): void {
        let newState: PlayerStateModel = this.getClientState()
        newState.setTriggerInactive(triggerId)

        this.updateClientState(newState)
    }
	removeMegaCreditsFromClient(quantity:number):void {
		let state = this.getClientState()
		state.addRessource("megacredit", -quantity)
		this.updateClientState(state)
	}
    addGlobalParameterStepsEOPtoClient(parameter:GlobalParameterValue): void {
		let state = this.getClientState()
		let newEvents: EventBaseModel[] = []

		let triggers = state.getTriggersIdOnParameterIncrease()
        if(triggers.length>0){
			newEvents = newEvents.concat(this.projectCardPlayed.getEventTriggerByGlobalParameterIncrease(triggers,parameter)??[])
		}
		state.addGlobalParameterStepEOP(parameter)

		//add TR if not maxed out
		if(!state.isGlobalParameterMaxedOutAtPhaseBeginning(parameter.name)){
			state.addTR(parameter.steps)

			switch(parameter.name){
				//adds forest point if oxygen not already maxed out
				case(GlobalParameterNameEnum.oxygen):{
					state.addForest(parameter.steps)
					break
				}
				//query server for ocean bonus
				case(GlobalParameterNameEnum.ocean):{
					newEvents.push(EventDesigner.createGeneric('oceanQuery', {oceanQueryNumber: parameter.steps}))
					break
				}
			}
		}
		this.updateClientState(state)

        if(newEvents.length===0){return}
        this.addEventQueue(newEvents, 'first')

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
	public setGameLoaded(){
		this.loading.next(false)
	}
	public setGroupStateFromJson(dto: PlayerStateDTO[]){
		let groupPlayerState: PlayerStateModel[] = []
		let playerIdList: myUUID[] = []
		for(let playerStateDTO of dto){
			//add playerId to list
			playerIdList.push(playerStateDTO.infoState.i)

			//add playerstate
			if(playerStateDTO.infoState.i===this.clientId){
				this.eventQueueSavedState = playerStateDTO.eventState?.e??[]
				playerStateDTO.eventState.e = []
			}
			groupPlayerState.push(PlayerStateModel.fromJson(playerStateDTO, this.injector))
		}
		this.setPlayerIdList(playerIdList)
		this.updateGroupPlayerState(groupPlayerState)

		this.updateGroupPlayerSelectedPhase(PlayerStateModel.toPlayerPhaseGroup(dto))
		console.log('state loaded: ', this.groupPlayerState.getValue())

		for(let state of this.groupPlayerState.getValue()){
			if(state.getId()===this.clientId){
				this.updateClientState(state)
			}
		}
		//create events from eventqueue saved state
		//this.createEventFromEventQueueSavedState()
		console.log('client state loaded: ', this.clientState.getValue())
		console.log('eventstate loaded:', Utils.jsonCopy(this.eventQueueSavedState))
	}
	public getPlayerCount(): number {
		return this.groupPlayerState.getValue().length
	}
	public reset(): void {
		this.setCurrentPhase(NonSelectablePhaseEnum.undefined)
	}

	public newGame(groupDto: PlayerStateDTO[]): void {
		let clientState = this.getClientState()
		for(let dto of groupDto){
			if(dto.infoState.i===this.clientId){
				clientState.newGame(dto)
				this.updateClientState(clientState)
			}
		}
		this.rxStompService.publishPlayerState(clientState)
		console.log('newGame state loaded:', clientState)
	}
	public setSelectStartingHandEvents(): void {
		let events: EventBaseModel[] = []
		events.push(EventDesigner.createCardSelector('selectStartingHand'))
		events.push(EventDesigner.createGeneric('endOfPhase'))
		events.push(EventDesigner.createGeneric('waitingGroupReady'))
		this.addEventQueue(events,'first')
	}
	public setSelectCorporationEvents(): void {
		let events: EventBaseModel[] = []
		events.push(EventDesigner.createCardSelector('selectCorporation', {cardSelector: {selectFrom: this.getClientHandCorporationModelList()}}))
		events.push(EventDesigner.createGeneric('endOfPhase'))
		events.push(EventDesigner.createGeneric('waitingGroupReady'))
		this.addEventQueue(events,'first')
	}
	public playCorporation(corporation: PlayableCardModel): void {
		this.playCardFromClientHand(corporation, 'corporation')
	}
	private dtoToPlayerState(dto: PlayerStateDTO): PlayerStateModel {
		return PlayerStateModel.fromJson(dto, this.injector)
	}
	private dtoToGroupPlayerState(groupDto: PlayerStateDTO[]): PlayerStateModel[] {
		let groupState: PlayerStateModel[] = []

		for(let dto of groupDto){
			groupState.push(PlayerStateModel.fromJson(dto, this.injector))
		}

		return groupState
	}
	public initializeGroupReady(wsGroupReady: WsGroupReady[], wsGroupState: PlayerStateDTO[]): void {
		let groupReady: PlayerReadyModel[] = []
		for(let state of wsGroupState){
			let playerReady = new PlayerReadyModel
			playerReady.id = state.infoState.i
			playerReady.name = state.infoState.n

			for(let ready of wsGroupReady){
				if(ready.playerId===playerReady.id){
					playerReady.isReady = ready.ready
					break
				}
			}
			groupReady.push(playerReady)
		}
		this.groupPlayerReady.next(groupReady)
	}
	public setSelectedPhaseList(selectedPhaseList: SelectablePhaseEnum[]){
		let list: SelectablePhaseEnum[] = []
		for(let selected of selectedPhaseList){
			if(selected.toString()!='PLANIFICATION'){
				list.push(selected)
			}
		}
		this.selectedPhaseList.next(list)
	}
	private loadEventQueueSavedState(eventQueue: EventBaseModel[]){
		let playerState: PlayerStateModel = this.getClientState()

		for(let event of eventQueue){
			for(let eventState of this.eventQueueSavedState){
				if(EventStateFactory.shouldLoadEventFromThisSavedState(event, eventState)){
					console.log('loading eventState:',eventState, event)
					//specific cases
					switch(event.type){
						case('cardActivator'):{
							playerState.loadEventStateActivator(eventState)
							break
						}
					}

					//generic cases applied from event function
					event.fromJson(eventState)
					this.eventQueueSavedState = this.eventQueueSavedState.filter((ele) => ele!==eventState)
					break
				}
			}
		}
	}

	public addOceanBonus(oceanBonus: WsOceanResult){
		let ressources: RessourceStock[] = []
		let megacredit: number = 0
		let plant: number = 0
		let newEvents: EventBaseModel[] = []
		let clientState = this.getClientState()

		for(let bonus of oceanBonus.bonuses){
			megacredit += bonus.megacredit
			plant += bonus.plant
		}
		if(megacredit>0){ressources.push({name: 'megacredit', valueStock: megacredit})}
		if(plant>0){ressources.push({name: 'plant', valueStock: plant})}
		if(ressources.length>0){newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource:ressources}))}
		if(oceanBonus.draw.length>0){this.addCardsToClientHand(oceanBonus.draw)}

		if(newEvents.length>0){
			this.addEventQueue(newEvents,'first')
		}
		for(let bonus of oceanBonus.bonuses){
			clientState.addOceanFlippedBonus(bonus)
		}
		this.updateClientState(clientState)
		console.log(clientState)
	}

	public isClient(playerId: myUUID): boolean {
		return playerId===this.clientId
	}
	public addForestPoint(forestNumber: number){
		let state = this.getClientState()
		if(state.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.oxygen)){return}
		state.addForest(forestNumber)
		state.addGlobalParameterStepEOP({name:GlobalParameterNameEnum.oxygen, steps:forestNumber})
		state.addTR(forestNumber)
		this.updateClientState(state)
	}
}
