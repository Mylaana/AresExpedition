import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PlayerStateModel, PlayerReadyModel } from "../../models/player-info/player-state.model";
import { MilestoneState, myUUID, PlayableCardType, RessourceType, TagType } from "../../types/global.type";
import { CardRessourceStock, GlobalParameterValue, PlayerPhase, ScanKeep, RessourceStock, ProjectFilter,  } from "../../interfaces/global.interface";
import { NonSelectablePhase } from "../../types/global.type";
import { PhaseCardType, PhaseCardUpgradeType } from "../../types/phase-card.type";
import { DrawEvent, EventBaseModel, EventGeneric, EventPhase } from "../../models/core-game/event.model";
import { PlayableCardModel} from "../../models/cards/project-card.model";
import { ProjectCardInfoService } from "../cards/project-card-info.service";
import { WsDrawResult, WsGroupReady, WsOceanResult } from "../../interfaces/websocket.interface";
import { RxStompService } from "../websocket/rx-stomp.service";
import { NonSelectablePhaseEnum, SelectablePhaseEnum } from "../../enum/phase.enum";
import { PhaseCardModel } from "../../models/cards/phase-card.model";
import { PlayerStateDTO } from "../../interfaces/dto/player-state-dto.interface";
import { GameParamService } from "./game-param.service";
import { EventStateDTO } from "../../interfaces/event-state.interface";
import { Utils } from "../../utils/utils";
import { AwardsEnum, GlobalParameterNameEnum, MilestonesEnum } from "../../enum/global.enum";
import { EventStateService } from "../../factory/event-state-service.service";
import { EventFactory } from "../../factory/event/event-factory";
import { ActivationOption } from "../../types/project-card.type";
import { PlayableCard } from "../../factory/playable-card.factory";
import { EventStateOriginEnum } from "../../enum/eventstate.enum";
import { EventSerializer } from "../../utils/event-serializer.utils";
import { GAME_CARD_SELL_VALUE } from "../../global/global-const";
import { SCALING_PRODUCTION } from "../../maps/playable-card-maps";
import { GameOption } from "./create-game.service";

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


@Injectable({
    providedIn: 'root'
})
export class GameState{
    private loading = new BehaviorSubject<boolean>(true);
	private gameStarted = new BehaviorSubject<boolean>(true);

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
	private gameOver = new BehaviorSubject<boolean>(false)
	private gameOptions = new BehaviorSubject<GameOption>({
		balanced: false,
		discovery: false,
		fanmade: false,
		foundations: false,
		infrastructureMandatory: false,
		initialDraft: false,
		merger: false,
		promo: false,
		standardUpgrade: false,
		deadHand: false
	})
	private milestones = new BehaviorSubject<Partial<MilestoneState>>({})
	private awards = new BehaviorSubject<AwardsEnum[]>([])
	private round = new BehaviorSubject<number>(0)
	private cardProduction = new BehaviorSubject<string[]>([])

    currentGroupPlayerState = this.groupPlayerState.asObservable()
    currentGroupPlayerReady = this.groupPlayerReady.asObservable()
    currentGroupPlayerSelectedPhase = this.groupPlayerSelectedPhase.asObservable()
    currentPhase = this.phase.asObservable()
    currentDrawQueue = this.drawQueue.asObservable()
    currentEventQueue = this.eventQueue.asObservable()
    currentPlayerCount = this.playerCount.asObservable()
    currentLoadingState = this.loading.asObservable()
	currentGameStartedState = this.gameStarted.asObservable()
	currentSelectedPhaseList = this.selectedPhaseList.asObservable()
	currentGameOver = this.gameOver.asObservable()
	currentGameOptions = this.gameOptions.asObservable()
	currentClientState = this.clientState.asObservable()
	currentMilestones = this.milestones.asObservable()
	currentAwards = this.awards.asObservable()
	currentRound = this.round.asObservable()
	currentCardProduction = this.cardProduction.asObservable()

    phaseIndex: number = 0

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
        private rxStompService: RxStompService,
		private gameParam: GameParamService,
		private eventStateService: EventStateService,
		private injector: Injector
	){
		this.gameParam.currentClientId.subscribe((id) => {if(id){this.clientId = id}})
	}

    setPlayerIdList(playerIdList: myUUID[]):void{
        this.playerCount.next(playerIdList)
    }

    public setCurrentPhase(newPhase: NonSelectablePhaseEnum, isReconnect: boolean): void {
		let events: EventBaseModel[] = []
		switch(newPhase){
			case(NonSelectablePhaseEnum.undefined):{return}
			case(NonSelectablePhaseEnum.planification):{
				let selected = this.getClientPhaseSelected()
				if(selected && selected != SelectablePhaseEnum.undefined ){
					events.push(EventFactory.createGeneric('waitingGroupReady'))
					break
				}
				events.push(EventFactory.createGeneric('planificationPhase'))
				break}
			case(NonSelectablePhaseEnum.development):{events.push(EventFactory.createPhase('developmentPhase'));break}
			case(NonSelectablePhaseEnum.construction):{events.push(EventFactory.createPhase('constructionPhase'));break}
			case(NonSelectablePhaseEnum.action):{events.push(EventFactory.createPhase('actionPhase'));break}
			case(NonSelectablePhaseEnum.production):{
				this.cardProduction.next([])
				events.push(EventFactory.createPhase('productionPhase'))
				break
			}
			case(NonSelectablePhaseEnum.research):{
				if(!isReconnect){
					events.push(EventFactory.createPhase('researchPhase'));break}
				}
		}
		if(this.isLastPhaseOfRound(newPhase)){
			events.push(EventFactory.createCardSelector('selectCardForcedSell'))
		}
		if(newPhase!=NonSelectablePhaseEnum.planification){
			let state = this.getClientState()
			let triggers = state.getTriggersIdActive()
			let newEvents = PlayableCard.getOnTriggerredEvents('ON_PHASE_ACTIVATED', triggers, state, {activatedPhase: newPhase, clientSelectedPhase: state.getPhaseSelected()})
			this.addEventQueue(newEvents, 'first')
		}
		events.push(EventFactory.createGeneric('endOfPhase'))
		events.push(EventFactory.createGeneric('waitingGroupReady'))
		this.phase.next(newPhase)
		this.addEventQueue(events,'last')
    };
	private isLastPhaseOfRound(phase: NonSelectablePhaseEnum): boolean {
		if(phase===NonSelectablePhaseEnum.planification){false}
		let phaseList = this.selectedPhaseList.getValue()
		return phase.toString()===phaseList[phaseList.length-1]
	}
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
		return this.getClientState().toJson(
			EventSerializer.eventQueueToJson(
			this.eventQueue.getValue()))
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
		state.setPhaseSelected(phase, this.getRound())
		this.updateClientState(state)


		if(!state.isSelectedPhaseUpgraded()){return}
		let triggers = state.getTriggersIdActive()
		let newEvents = PlayableCard.getOnTriggerredEvents('ON_UPGRADED_PHASE_SELECTED', triggers, state, {})
		this.addEventQueue(newEvents, 'last')
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

    updateGroupPlayerSelectedPhase(newGroupPlayerSelectedPhase: PlayerPhase[]):void{
        this.groupPlayerSelectedPhase.next(newGroupPlayerSelectedPhase)
    }

	getClientPhaseSelected(): SelectablePhaseEnum | undefined {return this.getClientState().getPhaseSelected()}
	getClientPreviousPhaseSelected(): SelectablePhaseEnum | undefined {return this.getClientState().getPreviousPhaseSelected()}
	getClientPhaseCards(onlyUpgraded: boolean = false): PhaseCardModel[] {return this.getClientState().getPhaseCards(onlyUpgraded)}
    getClientHandIdList(filter?: ProjectFilter): string[] {return this.getClientState().getProjectHandIdList(filter)}
    getClientHandModelList(filter?: ProjectFilter): PlayableCardModel[] {return this.projectCardService.getProjectCardList(this.getClientHandIdList(filter))}
	getClientHandCorporationIdList(filter?: ProjectFilter): string[] {return this.getClientState().getCorporationHandIdList()}
	getClientHandCorporationModelList(): PlayableCardModel[] {return this.projectCardService.getProjectCardList(this.getClientHandCorporationIdList())}

    getClientProjectPlayedIdList(): string[] {return this.getPlayerProjectPlayedIdList(this.clientId)}
	getPlayerProjectPlayedIdList(playerId: myUUID): string[] {return this.getPlayerStateFromId(playerId)?.getProjectPlayedIdList()??[]}
    getClientProjectPlayedModelList(filter?: ProjectFilter): PlayableCardModel [] {return this.getPlayerProjectPlayedModelList(this.clientId, filter)}
    getPlayerProjectPlayedModelList(playerId: myUUID, filter?: ProjectFilter): PlayableCardModel[] {return this.getPlayerStateFromId(playerId)?.getProjectPlayedModelList(filter)??[]}

    addCardsToClientHand(cardsToAdd: string | string[]):void{
        let clientState = this.getClientState()
        clientState.addCardsToHand(cardsToAdd)
		this.updateClientState(clientState)
    }
	addCardsToClientDiscard(cardsToAdd: string | string[]):void{
		let clientState = this.getClientState()
        clientState.addCardsToDiscard(cardsToAdd)
		this.updateClientState(clientState)
	}
	addCardsSelectedFromListAndDiscardTheRest(cardsToKeep: string | string[], cardList: string[]){
		this.addCardsToClientHand(cardsToKeep)
		this.addCardsToClientDiscard(cardList.filter(toDiscard => !Utils.toArray(cardsToKeep).includes(toDiscard)))
	}
    removeCardsFromClientHandById(cardsToRemove: string | string[], cardType: PlayableCardType):void{
		let clientState = this.getClientState()
        clientState.removeCardsFromHand(cardsToRemove, cardType)
		this.updateClientState(clientState)
    }
    removeCardsFromClientHandByModel(cardsToRemove: PlayableCardModel | PlayableCardModel[], cardType: PlayableCardType):void{
		let removeListId: string[] = []
		if(!Array.isArray(cardsToRemove)){
			this.removeCardsFromClientHandById(cardsToRemove.cardCode, cardType)
			return
		}

		for(let removeCard of cardsToRemove){
			removeListId.push(removeCard.cardCode)
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
        let newDrawQueue: DrawEvent[] = this.drawQueue.getValue().filter((e) => e.finalized!=true);
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
			newQueue = this.applyEventQueueSavedState(newQueue)
		}
        this.eventQueue.next(newQueue)
    }
	private applyEventQueueSavedState(queue: EventBaseModel[]): EventBaseModel[] {
		//create new events
		if(this.eventQueueSavedState.filter((e) => e.o!=EventStateOriginEnum.load).length>0){
			queue = this.eventStateService.createFromJson(this.eventQueueSavedState).concat(queue)
			this.eventQueueSavedState = this.eventQueueSavedState.filter((e) => e.o!=EventStateOriginEnum.create)
		}
		//load data in existing events
		if(this.eventQueueSavedState.length>0){
			for(let event of queue){
				for(let dto of this.eventQueueSavedState){
					if(this.eventStateService.shouldLoadEvent(event, dto)){
						this.eventStateService.loadFromJson(event, dto, this.getClientState())
						this.eventQueueSavedState = this.eventQueueSavedState.filter((e) => e!=dto)
					}
				}
			}
		}
		return queue
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
		playerState.addRessource('megacredit', quantity * (GAME_CARD_SELL_VALUE + playerState.getSellCardValueMod()))
		this.updateClientState(playerState)
	}
	playCardFromClientHand(card: PlayableCardModel, cardType: PlayableCardType, removeCorpoHand: boolean = false):void{
		let events: EventBaseModel[] = []
		let state = this.getClientState()
		state.playCard(card, cardType)
		if(removeCorpoHand){
			state.removeCorporationsFromHand()
		}
		let playedCardEvents = PlayableCard.getOnPlayedEvents(card.cardCode, state)

        //check for triggers and add them to queue
		let activeTriggers = state.getTriggersIdActive()
        let eventsOnPlayed = PlayableCard.getOnTriggerredEvents('ON_CARD_PLAYED', activeTriggers, state, {playedCard:card})
        if(eventsOnPlayed.length>0){
            events = events.concat(eventsOnPlayed)
        }
        let eventsOnTagGained =PlayableCard.getOnTriggerredEvents('ON_TAG_GAINED', activeTriggers, state, {tagList:card.tagsId, playedCard: card})
        if(eventsOnTagGained.length>0){
            events = events.concat(eventsOnTagGained)
        }

        if(playedCardEvents!=undefined){
            events = events.concat(playedCardEvents)
        }
        if(events.length===0){return}
        this.addEventQueue(events, cardType==='project'?'first':'last')
	}
    setClientTriggerAsInactive(trigger: string): void {
        let newState: PlayerStateModel = this.getClientState()
        newState.setTriggerInactive(trigger)

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
		let isMaxedOut = state.isGlobalParameterMaxedOutAtPhaseBeginning(parameter.name)

		state.addGlobalParameterStepEOP(parameter)
		//add TR if not maxed out
		if(!isMaxedOut){
			state.addTR(parameter.steps)
			switch(parameter.name){
				//query server for ocean bonus
				case(GlobalParameterNameEnum.ocean):{
					newEvents.push(EventFactory.createGeneric('oceanQuery', {oceanQueryNumber: parameter.steps}))
					break
				}
			}
		}
		this.updateClientState(state)

		let triggers = state.getTriggersIdActive()
		if(triggers.length>0){
			newEvents = newEvents.concat(PlayableCard.getOnTriggerredEvents(
				"ON_PARAMETER_INCREASED",
				triggers,
				state,
				{
					increasedParameter:parameter.name,
					increasedParameterValue:parameter.steps,
					isParameterMaxedOutAtBeginningOfPhase: isMaxedOut
				}
			))
		}
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
		let newEvents: EventBaseModel[] = []
		let triggers = newState.getTriggersIdActive()
		let card = newState.getProjectPlayedModelFromId(cardStock.cardCode)
        for(let stock of cardStock.stock){
			newState.addRessourceToCard(cardStock.cardCode, stock)
			if(stock.valueStock<0){continue}
			if(triggers.length>0){
				newEvents = newEvents.concat(PlayableCard.getOnTriggerredEvents('ON_RESSOURCE_ADDED_TO_CARD', triggers, newState, {receivingCard:card, ressourceAdded:stock.name, ressourceAddedValue:stock.valueStock}))
			}
        }
		if(newEvents.length>0){
			this.addEventQueue(newEvents, 'first')
		}
        this.updateClientState(newState)
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
			event.scanKeepOptions = wsDrawResult.options
			event.keepCardNumber = wsDrawResult.keep
            eventFound = true
            this.cleanAndNextDrawQueue()
            break
        }

		//debug case
		if(wsDrawResult.eventId===-1){
			this.addCardsToClientHand(wsDrawResult.cardIdList)
			eventFound = true
		}
        if(eventFound===false){
            console.log('event not found', wsDrawResult, drawQueue, this.eventQueue.getValue())
        }
    }
    public setGroupReady(wsGroupReady: WsGroupReady[]): void {
		let groupReady = this.groupPlayerReady.getValue()
		for(let wsPlayerReady of wsGroupReady){
			for(let player of groupReady){
				if(player.id===wsPlayerReady.playerId){
					player.isReady = wsPlayerReady.ready
					break
				}
			}
		}
        this.groupPlayerReady.next(groupReady)
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

		for(let state of this.groupPlayerState.getValue()){
			if(state.getId()===this.clientId){
				this.updateClientState(state)
			}
		}
	}
	public getPlayerCount(): number {
		return this.groupPlayerState.getValue().length
	}
	public reset(): void {
		this.setCurrentPhase(NonSelectablePhaseEnum.undefined, false)
	}

	public newGame(groupDto: PlayerStateDTO[]): void {
		let clientState = this.getClientState()
		for(let dto of groupDto){
			if(dto.infoState.i===this.clientId){
				clientState.newGame(dto)
				this.updateClientState(clientState)
			}
		}
		this.rxStompService.publishPlayerState(clientState.toJson())
	}
	public setSelectStartingHandEvents(): void {
		let events: EventBaseModel[] = []
		events.push(EventFactory.createCardSelector('selectStartingHand'))
		events.push(EventFactory.createGeneric('endOfPhase'))
		events.push(EventFactory.createGeneric('waitingGroupReady'))
		this.addEventQueue(events,'first')
	}
	public setSelectCorporationEvents(isMerger: boolean = false): void {
		let events: EventBaseModel[] = []
		if(isMerger){
			events.push(EventFactory.createCardSelector('selectMerger',{cardSelector: {selectFrom: this.getClientHandCorporationModelList(),},isMerger:isMerger}))
		} else {
			events.push(EventFactory.createCardSelector('selectCorporation', {cardSelector: {selectFrom: this.getClientHandCorporationModelList()}}))
		}

		events.push(EventFactory.createGeneric('endOfPhase'))
		events.push(EventFactory.createGeneric('waitingGroupReady'))
		this.addEventQueue(events,'first')
	}
	public playCorporation(corporation: PlayableCardModel, isMerger: boolean = false): void {
		this.playCardFromClientHand(
			corporation,
			'corporation',
			//this.mergerGame && isMerger || this.mergerGame===false
		)
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
		if(ressources.length>0){newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource:ressources}))}
		if(oceanBonus.draw.length>0){this.addCardsToClientHand(oceanBonus.draw)}

		if(newEvents.length>0){
			this.addEventQueue(newEvents,'first')
		}
		for(let bonus of oceanBonus.bonuses){
			clientState.addOceanFlippedBonus(bonus)
		}
		this.updateClientState(clientState)
	}

	public isClient(playerId: myUUID): boolean {
		return playerId===this.clientId
	}
	public addForestPointAndOxygen(forestNumber: number){
		let state = this.getClientState()
		state.addForest(forestNumber)
		this.updateClientState(state)

		let newEvents = PlayableCard.getOnTriggerredEvents('ON_FOREST_GAINED', state.getTriggersIdActive(), state, {forestGained:forestNumber})
		if(newEvents.length>0){
			this.addEventQueue(newEvents, 'first')
		}
		if(state.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.oxygen)){return}
		this.addGlobalParameterStepsEOPtoClient({name:GlobalParameterNameEnum.oxygen, steps:forestNumber})
	}
	public addProductionToClient(ressources: RessourceStock | RessourceStock[]){
		let state = this.getClientState()
		state.addProduction(ressources)
		this.updateClientState(state)

		if(state.getTriggersIdActive().length>0){
			let newEvents: EventBaseModel[] = []
			for(let r of Utils.toArray(ressources)){
				newEvents = newEvents.concat(PlayableCard.getOnTriggerredEvents('ON_PRODUCTION_INCREASED', state.getTriggersIdActive(), state, {productionIncreased: r}))
			}
			if(!newEvents){return}
			this.addEventQueue(newEvents,'first')
		}

	}
	public addTr(quantity: number){
		let state = this.getClientState()
		state.addTR(quantity)
		this.updateClientState(state)
	}
	public addTagFromOtherSourceToClient(type: TagType){
		let state = this.getClientState()
		let tagId = Utils.toTagId(type)
		state.addTagFromOtherSource(tagId, 1)
		this.updateClientState(state)

		if(state.getTriggersIdActive().length>0){
			let newEvents =PlayableCard.getOnTriggerredEvents('ON_TAG_GAINED', state.getTriggersIdActive(), state, {tagList:[tagId]})
			if(!newEvents){return}
			this.addEventQueue(newEvents,'first')
		}
	}
    public activateCard(card: PlayableCardModel, option: ActivationOption){
        let clientState = this.getClientState()
		let newEvents: EventBaseModel[] = PlayableCard.getOnActivationEvents(card.cardCode, this.getClientState(), option)??[]
		let triggerredEvents = PlayableCard.getOnTriggerredEvents('ON_CARD_ACTIVATED', clientState.getTriggersIdActive(), clientState, {})
		newEvents = newEvents.concat(triggerredEvents)
		if(newEvents?.length===0){return}
		this.addEventQueue(newEvents,'first')
    }
	endOfPhase() {
		this.rxStompService.publishPlayerState(this.getClientState().toJson(EventSerializer.eventQueueToJson(this.eventQueue.getValue())))
	}
	setGameOver(){
		this.gameOver.next(true)
	}
	loadProductionPhaseCardList(cardList: string[], addToHand: boolean){
		this.addCardProduction(cardList, addToHand)
	}
	applyAverageStartingMegacredits(){
		let clientState = this.getClientState()
		let corps = clientState.getPlayedCorporations()
		let penalty: number = 0

		for(let c of corps){
			penalty += c.startingMegacredits??0
		}

		//rounds up MC penalty
		let event = EventFactory.simple.addRessource({name:'megacredit', valueStock: -Math.ceil(penalty /2)})
		this.addEventQueue(event, 'first')
	}
	getGroupState(): PlayerStateModel[] {
		return this.groupPlayerState.getValue()
	}
	recallCardFromPlayed(card: PlayableCardModel){
		let state = this.getClientState()
		state.removeTag(card.tagsId)
		state.addCardsToHand(card.cardCode)
		state.removeCardFromPlayed(card)
		if(card.vpNumber)
		if(Number(card.vpNumber??'')!=0 && !isNaN(Number(card.vpNumber??''))){
			state.addVP(-parseInt(card.vpNumber??''))
		}
	}
	addTagToTargetCard(cardCode: string, tag: TagType){
		this.addTagFromOtherSourceToClient(tag)
		let state = this.getClientState()
		state.addTagToCardId(cardCode, tag)
	}
	publishRollbackQuery(){
		this.rxStompService.publishRollbackQuery()
	}
	applyDoubleProduction(card: PlayableCardModel){
		if(!card){return}
		let resources: RessourceStock[] = []
		if(card.cardCode in SCALING_PRODUCTION){
			resources = SCALING_PRODUCTION[card.cardCode](this.getClientState())
		} else {
			resources = this.getFlatDoubleProduction(card)
		}
		if(resources.length===0){return}

		//remove cards resources and treat them separately
		let newEvents: EventBaseModel[] = []
		let cardToDraw: number = 0
		for(let r of resources){
			if(r.name==='card'){
				cardToDraw += r.valueStock
			}
		}
		resources = resources.filter((el) => el.name!='card')
		if(cardToDraw>0){
			newEvents.push(EventFactory.createDeckQueryEvent('drawQuery', {
				isCardProductionDouble:true,
				drawDiscard: {draw:cardToDraw},
				firstProductionCardList: this.cardProduction.getValue()
			}))
		}
		if(resources.length>0){
			newEvents.push(EventFactory.simple.addRessource(resources))
		}
		if(newEvents.length>0){
			this.addEventQueue(newEvents, 'first')
		}
	}
	private getFlatDoubleProduction(card: PlayableCardModel): RessourceStock[] {
		let playEvents: EventGeneric[] | undefined = PlayableCard.getOnPlayedEvents(card.cardCode, this.getClientState())
			?.filter((pe)=> pe.subType==='addProduction') as EventGeneric[] | undefined
		if(!playEvents || playEvents.length===0){return []}
		let resources: RessourceStock[] = []
		for(let e of playEvents){
			if(!e.baseRessource){continue}
			resources = resources.concat(this.toValidDoubleProductionRessource(Utils.toArray(e.baseRessource)))
		}
		return resources
	}
	private toValidDoubleProductionRessource(resources: RessourceStock[]): RessourceStock[] {
		let result: RessourceStock[] = []
		const excluded: RessourceType[] = ['steel', 'titanium']
		for(let r of resources){
			if(excluded.includes(r.name)){continue}
			result.push(r)
		}
		return result
	}
	setGameStarted(started: boolean = true){
		this.gameStarted.next(started)
	}
	setGameOptions(options: GameOption){
		this.gameOptions.next(options)
	}
	getGameOptions(): GameOption {
		return this.gameOptions.getValue()
	}
	setAwards(awards: AwardsEnum[]){
		if(this.awards.getValue().length===0){
			this.awards.next(awards)
		}
	}
	setMilestone(milestone: MilestoneState){
		this.milestones.next(milestone)
	}
	claimMilestone(milestone: MilestonesEnum){
		let state = this.getClientState()
		state.claimMilestone(milestone)
		let newEvents = PlayableCard.getOnTriggerredEvents('ON_MILESTONE_CLAIMED', state.getTriggersIdActive(), state, {})
		if(newEvents.length>0){
			this.addEventQueue(newEvents, 'first')
		}
	}
	isDiscoveryEnabled(): boolean {
		return this.gameOptions.getValue().discovery
	}
	isFoundationEnabled(): boolean {
		return this.gameOptions.getValue().foundations
	}
	setRound(round: number){
		if(round===this.getRound()){return}
		this.round.next(round)
	}
	getRound(): number{
		return this.round.getValue()
	}
	addCardProduction(cardList: string | string[], addToHand: boolean){
		let cards: string[] = Utils.toArray(cardList)
		let totalCards: string[] = this.cardProduction.getValue().concat(cards)
		this.cardProduction.next(totalCards)
		if(!addToHand)
		this.getClientState().addCardsToHand(cardList)
	}
}
