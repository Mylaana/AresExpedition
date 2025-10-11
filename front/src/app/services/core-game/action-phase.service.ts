import { Injectable } from "@angular/core";
import { ButtonNames, RessourceType, StandardProjectButtonNames } from "../../types/global.type";
import { GameState } from "./game-state.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { EventBaseModel, EventCardActivator } from "../../models/core-game/event.model";
import { NonEventButton } from "../../models/core-game/button.model";
import { ButtonDesigner } from "../../factory/button-designer.service";
import { PlayableCard } from "../../factory/playable-card.factory";
import { GlobalParameterNameEnum } from "../../enum/global.enum";
import { EventFactory } from "../../factory/event/event-factory";
import { STANDARD_PROJECT_EVENTS } from "../../maps/standard-project-maps";

interface StandardProjectState {
    costMC?: number
    costPlant?: number
    costHeat?: number
    caption: string
    button: NonEventButton,
    canBePaid: boolean,
    mustBePaid: boolean
}

@Injectable({
    providedIn: 'root'
})
export class ActionPhaseService{

    private actionEvent!: EventCardActivator | undefined
    private clientState!: PlayerStateModel

    private standardProjectsList: StandardProjectButtonNames[] = ['buyForest', 'buyInfrastructure', 'buyOcean', 'buyTemperature', 'buyUpgrade', 'convertForest', 'convertInfrastructure', 'convertTemperature']

    private mcStock: number = 0
	private plantStock: number = 0
	private heatStock: number = 0

    private standardProjectStates: Partial<Record<StandardProjectButtonNames, StandardProjectState>> = {}

    private infrastructureMandatory!: boolean

    constructor(
        private gameStateService: GameState,
    ){
        this.infrastructureMandatory = this.gameStateService.isInfrastructureMandatory()
        this.gameStateService.currentClientState.subscribe(state => this.onClientStateUpdate(state))
        this.gameStateService.currentEventQueue.subscribe(queue => this.onEventQueueUpdate(queue))
        this.initializeStandardProjectStates()
    }
    private initializeStandardProjectStates(){
        for (let s of this.standardProjectsList){
            this.standardProjectStates[s] = {
                caption: PlayableCard.activable.getScalingCostActivationCaption(s, this.clientState),
                canBePaid: true,
                mustBePaid: false,
                button: ButtonDesigner.createNonEventButton(s)
            }
        }
        this.updateCost()
        this.updateStandardProjectMustBePaid()
        this.updateButtonsCaption()
        this.updateButtonsStatus()
        this.updateMainButtonStatus()
    }
    private updateCost() {
        if(!this.clientState || !this.actionEvent){return }
        for(let s of this.standardProjectsList){
            if(!this.standardProjectStates[s]){continue}
            switch(s){
                case('convertForest'):{
                    this.standardProjectStates[s].costPlant = PlayableCard.activable.getScalingCostActivation(s, this.clientState)
                    break
                }
                case('convertInfrastructure'):{
                    this.standardProjectStates[s].costHeat = PlayableCard.activable.getScalingCostActivation(s + 'Heat', this.clientState)
                    this.standardProjectStates[s].costPlant = PlayableCard.activable.getScalingCostActivation(s + 'Plant', this.clientState)
                    break
                }
                case('convertTemperature'):{
                    this.standardProjectStates[s].costHeat = PlayableCard.activable.getScalingCostActivation(s, this.clientState)
                    break
                }
                default:{
                    this.standardProjectStates[s].costMC = PlayableCard.activable.getScalingCostActivation(s, this.clientState)
                }
            }
        }
    }
    private onEventQueueUpdate(queue: EventBaseModel[]){
        if(queue.length===0){return}
        let currentEvent = queue[0]
        if(currentEvent.type != 'cardActivator'){
            this.actionEvent = undefined
            return
        }
        this.actionEvent = currentEvent as EventCardActivator
        this.updateStandardProjectMustBePaid()
        this.updateButtonsStatus()
        this.updateMainButtonStatus()
    }
    private onClientStateUpdate(state: PlayerStateModel){
        this.clientState = state
        let stockChanged = 0
        let checkStockList: RessourceType[] = ['megacredit', 'heat', 'plant']
        for(let s of checkStockList){
            stockChanged += this.updateResourceStockAndReturnsUpdatedStatus(s, state.getRessourceInfoFromType(s)?.valueStock??0)?1:0
        }

        this.updateCost()
        
        if(stockChanged===0){return}
        this.updateButtonsCaption()

        if(!this.actionEvent){return}
        this.updateStandardProjectMustBePaid()
        this.updateButtonsStatus()
        this.updateMainButtonStatus()
    }
    private updateResourceStockAndReturnsUpdatedStatus(name: RessourceType, value: number): boolean {
        switch(name){
            case('megacredit'):{
                if(this.mcStock!=value){
                    this.mcStock = value
                    return true
                }
                break
            }
            case('heat'):{
                    if(this.heatStock!=value){
                    this.heatStock = value
                    return true
                }
                break
            }
            case('plant'):{
                if(this.plantStock!=value){
                    this.plantStock = value
                    return true
                }
                break
            }
        }
        return false
    }
    private updateButtonsCaption(){
        if(!this.clientState || !this.actionEvent){return}
        for(let s of this.standardProjectsList){
            if(!this.standardProjectStates[s]){continue}
            this.standardProjectStates[s].button.caption = this.standardProjectStates[s].caption
        }
    }
    private updateButtonsStatus(){
        if(!this.clientState || !this.actionEvent){return}
        for(let s of this.standardProjectsList){
            if(!this.standardProjectStates[s]){continue}
            switch(s){
                case('convertForest'):{
                    this.standardProjectStates[s].canBePaid = (this.standardProjectStates[s].costPlant??0) <= this.plantStock
                    break
                }
                case('convertTemperature'):{
                    this.standardProjectStates[s].canBePaid = (this.standardProjectStates[s].costHeat??0) <= this.heatStock
                    break
                }
                case('convertInfrastructure'):{
                    this.standardProjectStates[s].canBePaid = (this.standardProjectStates[s].costHeat??0) <= this.heatStock && (this.standardProjectStates[s].costPlant??0) <= this.plantStock
                    break
                }
                default:{
                    this.standardProjectStates[s].canBePaid = (this.standardProjectStates[s].costMC??0) <= this.mcStock
                    break
                }
            }
            this.standardProjectStates[s].button.setEnabled(this.standardProjectStates[s].canBePaid)
            this.updateButtonWarning(s)
        }
    }
    private updateStandardProjectMustBePaid(){
        if(!this.clientState || !this.actionEvent){return}
        for(let s of this.standardProjectsList){
            if(!this.standardProjectStates[s]){continue}
            switch(s){
                case('convertForest'):{
                    this.standardProjectStates[s].mustBePaid = this.clientState.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.oxygen)===false
                    break
                }
                case('convertTemperature'):{
                    this.standardProjectStates[s].mustBePaid = this.clientState.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.temperature)===false
                    break
                }
                case('convertInfrastructure'):{
                    this.standardProjectStates[s].mustBePaid = this.clientState.isGlobalParameterMaxedOutAtPhaseBeginning(GlobalParameterNameEnum.infrastructure)===false && this.infrastructureMandatory
                    break
                }
            }
        }
    }
    getButton(name: StandardProjectButtonNames): NonEventButton{
        if(!this.standardProjectStates[name]){return new NonEventButton}
        return this.standardProjectStates[name].button
    }
    onButtonClicked(buttonName: StandardProjectButtonNames){
        let newEvents: EventBaseModel[] = []
        if(!(buttonName in STANDARD_PROJECT_EVENTS) || !STANDARD_PROJECT_EVENTS[buttonName]){return}
        if(!this.standardProjectStates[buttonName]){return}
        newEvents = STANDARD_PROJECT_EVENTS[buttonName](
            this.standardProjectStates[buttonName].costMC??0,
            this.standardProjectStates[buttonName].costPlant??0,
            this.standardProjectStates[buttonName].costHeat??0
        )
		this.gameStateService.addEventQueue(newEvents, 'first')
    }
    private updateButtonWarning(name: StandardProjectButtonNames){
        if(!this.standardProjectStates[name]){return}
        this.standardProjectStates[name].button.warning = this.standardProjectStates[name].mustBePaid && this.standardProjectStates[name].canBePaid
    }
    private updateMainButtonStatus(){
        if(!this.clientState || !this.actionEvent){return}
        this.actionEvent.button?.setEnabled(this.isPhaseLocked()===false)
    }
    private isPhaseLocked(): boolean {
        for(let s of this.standardProjectsList){
            if(!this.standardProjectStates[s]){continue}
            if(this.standardProjectStates[s].canBePaid && this.standardProjectStates[s].mustBePaid){return true}
        }
        return false
    }
}