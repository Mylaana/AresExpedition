import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardSelectorPlayZoneSubType, EventGenericSubType, EventDeckQuerySubType, EventUnionSubTypes, EventWaiterSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, DrawDiscard, GlobalParameterValue, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventPlayZoneButton, EventSecondaryButton } from "./button.model";
import { EventPlayZoneButtonNames } from "../../types/global.type";
import { CardState } from "../cards/card-cost.model";
import { ProjectCardModel } from "../cards/project-card.model";


interface CreateEventOptionsSelector {
    cardSelector?: Partial<CardSelector>
    title?: string
    waiterId?:number
}
interface CreateEventOptionsTargetCard {
    advancedRessource?: AdvancedRessourceStock
}
interface CreateEventOptionsGeneric {
    increaseParameter?: GlobalParameterValue
    baseRessource?: RessourceStock | RessourceStock[]
    scanKeep?: ScanKeep
    cardId?: number
    drawEventResult?:number[]
    waiterId?:number
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeNumber?: number
}
interface CreateEventOptionsDeckQuery {
    drawDiscard?: Partial<DrawDiscard>
    scanKeep?: Partial<ScanKeep>,
}


/**
 * isFinalized should become true when object should go to garbage
 */
export abstract class EventBaseModel {
    readonly type!: EventType
    readonly subType!: any
    readonly locksEventpile: boolean = false
    finalized: boolean = false
    autoFinalize: boolean = false
    id!: number
    button?: EventMainButton
    readonly title?: string

    hasSelector(): boolean {return false}
    hasCardBuilder(): boolean {return false}
    getSelectionActive(): boolean {return false}
}

export abstract class EventBaseCardSelector extends EventBaseModel {
    override title: string = 'no title provided'
    override locksEventpile!: boolean
    cardSelector: CardSelector = {
        selectFrom: [],
        selectedList: [],
        selectionQuantity: 0,
        selectionQuantityTreshold: 'equal'
    }
    private selectionActive: boolean = false

    updateCardSelection(selection:ProjectCardModel[]): void {
        this.cardSelector.selectedList = selection
    }
    override hasSelector(): boolean {
        return true
    }
    /**
     * 
     * @param stateFromParent 
     * default state from parent {selectable:true}
     */
    activateSelection(stateFromParent?:CardState): void {
        this.selectionActive = true
    }
        /**
     * 
     * @param stateFromParent 
     * default state from parent {selectable:true}
     */
    deactivateSelection(stateFromParent?:CardState): void {
        this.selectionActive = false
    }
    override getSelectionActive(): boolean {
        return this.selectionActive
    }
}

export class EventCardSelector extends EventBaseCardSelector{
    override readonly type: EventType = 'cardSelector'
    override subType!: EventCardSelectorSubType
    override button?: EventMainButtonSelector

    override updateCardSelection(selection: ProjectCardModel[]): void {
        super.updateCardSelection(selection)
        this.button?.updateEnabledTreshold({
            treshold: this.cardSelector.selectionQuantityTreshold,
            tresholdValue: this.cardSelector.selectionQuantity,
            value: this.cardSelector.selectedList.length
        })
    }
}

export class EventCardSelectorRessource extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorRessource'
    override subType!: EventCardSelectorRessourceSubType;
    advancedRessource?: AdvancedRessourceStock
}

export class PlayableCardZone {
	selectedCard!: ProjectCardModel | undefined
	cardInitialState?: CardState
    buttons: EventPlayZoneButton[] = []

    addButtons(buttons: EventPlayZoneButton[]): void {
        this.buttons = buttons
    }
    getButtonFromName(name: EventPlayZoneButtonNames): EventPlayZoneButton | undefined {
        for(let button of this.buttons){
            if(button.name===name){
                return button
            }
        }
        return
    }
    updateButtonEnabled(name: EventPlayZoneButtonNames, enabled: boolean): void {
        let button = this.getButtonFromName(name)
        if(!button){return}
        button.enabled = enabled
    }
    updateButtonGroupState(buttonName: EventPlayZoneButtonNames): void {
        switch(buttonName){
            case('selectCard'):{
                this.updateButtonEnabled('selectCard', false)
                this.updateButtonEnabled('buildCard', true)
                this.updateButtonEnabled('cancelCard', true)
                this.updateButtonEnabled('alternative', false)
                break
            }
            case('cancelCard'):{
                this.updateButtonEnabled('selectCard', true)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('cancelCard', false)
                this.updateButtonEnabled('alternative', true)
                break
            }
            case('buildCard'):{
                this.updateButtonEnabled('selectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('cancelCard', false)
                this.updateButtonEnabled('alternative', false)
                break
            }
            case('alternative'):{
                this.updateButtonEnabled('selectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('cancelCard', false)
                this.updateButtonEnabled('alternative', false)
                break
            }
        }
    }
    resolvePlayZoneButtonClicked(button:EventPlayZoneButton){
        switch(button.name){
            case('cancelCard'):{
                this.selectedCard = undefined
                break
            }
            case('buildCard'):{
                this.buildCard()
                break
            }

        }

        if(button.name==='selectCard'){return}
        this.updateButtonGroupState(button.name)
    }
    addCardSelected(card: ProjectCardModel): void {
        this.selectedCard = card
    }
    removeCardSelected(): void {
        this.selectedCard = undefined
    }
    buildCard(): void {
        //this.gameStateService.addEventQueue(EventDesigner.createGeneric('buildCard', {cardId:this.selectedCardId}))
    }
}

export class EventCardSelectorPlayZone extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorPlayZone'
    override subType!: EventCardSelectorPlayZoneSubType;
    playCardZone: PlayableCardZone [] = []
    playCardZoneIdHavingFocus?: number
    override hasCardBuilder(): boolean {return true}
    override updateCardSelection(selection: ProjectCardModel[]): void {
        this.setSelectedCardToBuild(selection[0])
    }
    private setSelectedCardToBuild(card: ProjectCardModel): void {
        if(this.playCardZoneIdHavingFocus===undefined){return}
        let activeZone = this.playCardZone[this.playCardZoneIdHavingFocus]
        activeZone.addCardSelected(card)
        this.removeCardFromSelector(card)
        this.deactivateSelection()
        activeZone.updateButtonGroupState('selectCard')
    }
    private removeCardFromSelector(card: ProjectCardModel): void {
        for(let i=0; i<this.cardSelector.selectFrom.length; i++){
            if(this.cardSelector.selectFrom[i].id===card.id){
                this.cardSelector.selectFrom.splice(i, 1)
            }
        }
    }
    private cancelSelectedCard(): void {

    }
    getCardToBuildId(): number | undefined {
        if(this.playCardZoneIdHavingFocus===undefined){return}
        return this.playCardZone[this.playCardZoneIdHavingFocus].selectedCard?.id
    }
    playZoneButtonClicked(button: EventPlayZoneButton): void {
        if(this.playCardZoneIdHavingFocus===undefined){return}
        this.setSelectionOnButtonClick(button)
        let activeZone = this.playCardZone[this.playCardZoneIdHavingFocus]

        switch(button.name){
            case('selectCard'):{
                this.activateSelection()
                this.cardSelector.stateFromParent = {selectable:true, playable:true}
                break
            }
            case('cancelCard'):{
                let card = activeZone.selectedCard
                if(card===undefined){break}
                this.cardSelector.selectFrom.push(card)
                break
            }
        }

        activeZone.resolvePlayZoneButtonClicked(button)
        
        if(button.name==='selectCard'){return}
        activeZone.updateButtonGroupState(button.name)
        this.cardSelector.stateFromParent = {selectable:false, playable:false}
    }
    private setSelectionOnButtonClick(button: EventPlayZoneButton): void {
        switch(button.name){
            case('selectCard'):{
                this.activateSelection()
                break
            }
            default:{
                this.deactivateSelection()
                break
            }
        }
    }
}

export class EventTargetCard extends EventBaseModel {
    override readonly type: EventType = 'targetCard'
    override subType!: EventTargetCardSubType;
    targetCardId!: number
    override autoFinalize: boolean = true
    advancedRessource?: AdvancedRessourceStock | AdvancedRessourceStock[]
}

export class EventGeneric extends EventBaseModel {
    override readonly type: EventType = 'generic'
    override subType!: EventGenericSubType
    override autoFinalize: boolean = true
    override title!: string
    increaseParameter?: GlobalParameterValue
    increaseResearchScanKeep?: Partial<ScanKeep>
    baseRessource?:RessourceStock | RessourceStock[]
    cardIdToBuild?: number
    drawResultList?: number[]
    waiterId?: number
}

export class EventDeckQuery extends EventBaseModel {
    override readonly type: EventType = 'deck'
    override locksEventpile!: boolean
    override subType!: EventDeckQuerySubType;
    override autoFinalize: boolean = true
    waiterId!:number
    scanKeep?: Partial<ScanKeep>
    drawDiscard?: Partial<DrawDiscard>
}

export class EventWaiter extends EventBaseModel {
    override readonly type: EventType = 'waiter'
    override locksEventpile: boolean = true
    override subType!: EventWaiterSubType;
    override autoFinalize: boolean = true
    waiterId!: number
}

export class DrawEvent {
    id!: number
    resolveEventSubType!: EventUnionSubTypes
    drawCardNumber!: number
    keepCardNumber?:number
    drawDate = new Date()
    drawResultCardList: number[] = []
    finalized: boolean = false
    served: boolean = false
    waiterId!: number
}