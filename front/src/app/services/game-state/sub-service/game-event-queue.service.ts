import { Injectable } from "@angular/core";
import { EventBaseCardSelector, EventBaseModel, EventCardActivator, EventCardBuilder } from "../../../models/core-game/event.model";
import { BehaviorSubject } from "rxjs";
import { EventPileAddRule } from "../../../types/event.type";
import { Utils } from "../../../utils/utils";
import { EventStateDTO } from "../../../interfaces/event-state.interface";
import { EventStateOriginEnum } from "../../../enum/eventstate.enum";
import { EventStateDeserializerService } from "../../../factory/event-state-deserializer-service.service";
import { PlayerStateModel } from "../../../models/player-info/player-state.model";


@Injectable({
    providedIn: 'root'
})
export class GameEventQueueService {
    private eventStateDTO: EventStateDTO[] = []
    private clientState!: PlayerStateModel

    _eventQueue$ = new BehaviorSubject<EventBaseModel[]>([])
    _eventSelector$ = new BehaviorSubject<EventBaseCardSelector | null>(null)
	_eventActivator$ = new BehaviorSubject<EventCardActivator | null>(null)
    _eventBuilder$ = new BehaviorSubject<EventCardBuilder | null>(null)


    constructor(private eventStateDeserializerService: EventStateDeserializerService){}

    getCurrentEventQueue(): EventBaseModel[] {
        return this._eventQueue$.getValue()
    }

    addEventQueue(events: EventBaseModel | EventBaseModel[], addRule: EventPileAddRule): void {
        let newQueue: EventBaseModel[] = []
        let addEvents: EventBaseModel[] = Utils.toArray(events)

        switch(addRule){
            case('last'):{
                newQueue = newQueue.concat(this._eventQueue$.getValue(), addEvents)
                break
            }
            case('first'):{
                newQueue = newQueue.concat(addEvents, this._eventQueue$.getValue())
                break
            }
            case('second'):{
                let oldQueue = this._eventQueue$.getValue()
                let firstEvent = oldQueue.shift()
                newQueue = newQueue.concat(firstEvent?[firstEvent]:[], addEvents, oldQueue)
            }
        }
        if(this.eventStateDTO.length>0){
            newQueue = this.applyEventStateDTO(newQueue)
        }
        this.updateEventQueue(newQueue)
    }
    cleanAndNextEventQueue(): void{
        console.error()
        let newEventQueue: EventBaseModel[] = [];
        for(let e of this._eventQueue$.getValue()){
            if(e.finalized!=true){
                newEventQueue.push(e)
            }
        }
        this.updateEventQueue(newEventQueue)
    }
    private applyEventStateDTO(queue: EventBaseModel[]): EventBaseModel[] {
        //create new events
        if(this.eventStateDTO.filter((e) => e.o!=EventStateOriginEnum.load).length>0){
            queue = this.eventStateDeserializerService.createFromJson(this.eventStateDTO).concat(queue)
            this.eventStateDTO = this.eventStateDTO.filter((e) => e.o!=EventStateOriginEnum.create)
        }
        //load data in existing events
        if(this.eventStateDTO.length>0){
            for(let event of queue){
                for(let dto of this.eventStateDTO){
                    if(this.eventStateDeserializerService.shouldLoadEvent(event, dto)){
                        this.eventStateDeserializerService.loadFromJson(event, dto, this.clientState)
                        this.eventStateDTO = this.eventStateDTO.filter((e) => e!=dto)
                    }
                }
            }
        }
        return queue
    }
    public clearEventQueue(){
		this._eventQueue$.next([])
	}
    public finalizeEventWaitingGroupReady(){
        if(this._eventQueue$.getValue().length===0){return}

        for(let event of this._eventQueue$.getValue()){
            if(event.subType==='waitingGroupReady'){
                event.finalized = true
            }
        }
        this.cleanAndNextEventQueue()
    }
    public loadEventStateDTOFromJson(eventState: EventStateDTO[]){
        this.eventStateDTO = eventState
    }
    public updateClientState(clientState: PlayerStateModel){
        this.clientState = clientState
    }
    private updateEventQueue(queue: EventBaseModel[]){
        //console.log('update queue:', queue)
        this.updateSpecificEventSubjects(queue)
		this._eventQueue$.next(queue)
	}
    private toEventCardActivator(event: EventBaseModel): EventCardActivator | null {
		return event?.hasCardActivator()
			? (event as EventCardActivator)
			: null
	}
	private toEventCardSelector(event: EventBaseModel): EventBaseCardSelector | null {
        return event?.hasSelector() && event?.hasCardBuilder()===false
			? (event as EventBaseCardSelector)
			: null
	}
    private toEventCardBuilder(event: EventBaseModel): EventCardBuilder | null {
		return event?.hasCardBuilder()
			? (event as EventCardBuilder)
			: null
	}
    private updateSpecificEventSubjects(eventQueue: EventBaseModel[]) {
		if(eventQueue.length===0){
			return
		}
		const currentEvent = eventQueue[0]
		
		this._eventSelector$.next(this.toEventCardSelector(currentEvent))
		this._eventActivator$.next(this.toEventCardActivator(currentEvent))
        this._eventBuilder$.next(this.toEventCardBuilder(currentEvent))
	}
}