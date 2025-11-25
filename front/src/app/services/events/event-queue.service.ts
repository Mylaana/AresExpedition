import { Injectable } from "@angular/core";
import { EventBaseCardSelector, EventBaseModel, EventCardActivator, EventCardBuilder } from "../../models/core-game/event.model";
import { BehaviorSubject } from "rxjs";
import { EventPileAddRule } from "../../types/event.type";
import { Utils } from "../../utils/utils";
import { EventStateDTO } from "../../interfaces/event-state.interface";
import { EventStateOriginEnum } from "../../enum/eventstate.enum";
import { EventStateDeserializerService } from "../../factory/event-state-deserializer-service.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";


@Injectable({
    providedIn: 'root'
})
export class EventQueueService {
    private eventStateDTO: EventStateDTO[] = []
    private clientState!: PlayerStateModel

    _eventQueue$ = new BehaviorSubject<EventBaseModel[]>([])


    constructor(private eventStateDeserializerService: EventStateDeserializerService){}

    public getCurrentEventQueue(): EventBaseModel[] {
        return this._eventQueue$.getValue()
    }

    public addEventQueue(events: EventBaseModel | EventBaseModel[], addRule: EventPileAddRule): void {
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
    public cleanAndNextEventQueue(): void{
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
            queue = this.eventStateDeserializerService.createFromJson(this.eventStateDTO, this.clientState).concat(queue)
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
		this._eventQueue$.next(queue)
	}

}