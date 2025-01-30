import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardBuilderSubType, EventGenericSubType, EventDeckQuerySubType, EventUnionSubTypes, EventWaiterSubType, EventPhaseSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, DrawDiscard, GlobalParameterValue, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton, NonEventButton } from "./button.model";
import { CardBuilderOptionType, EventCardBuilderButtonNames } from "../../types/global.type";
import { CardState } from "../cards/card-cost.model";
import { ProjectCardModel } from "../cards/project-card.model";


type ButtonGroupUpdateType = EventCardBuilderButtonNames | 'selectionCardSelected' | 'selectionCardDiscarded' | 'resetState'

export abstract class EventBaseModel {
    readonly type!: EventType
    readonly subType!: any
    readonly locksEventpile: boolean = false
    finalized: boolean = false
    autoFinalize: boolean = false
    id!: number
    button?: EventMainButton
    readonly title?: string
    waiterId?: number

    hasSelector(): boolean {return false}
    hasCardBuilder(): boolean {return false}
    getSelectionActive(): boolean {return false}
}

export abstract class EventBaseCardSelector extends EventBaseModel {
    override title: string = 'no title provided'
    override locksEventpile!: boolean
    override button?: EventMainButtonSelector
    refreshSelectorOnSwitch: boolean = true
    cardSelector: CardSelector = {
        selectFrom: [],
        selectedList: [],
        selectionQuantity: 0,
        selectionQuantityTreshold: 'equal'
    }
    private selectionActive: boolean = false

    updateCardSelection(selection:ProjectCardModel[]): void {
        this.cardSelector.selectedList = selection
        this.button?.updateEnabledTreshold({
            treshold: this.cardSelector.selectionQuantityTreshold,
            tresholdValue: this.cardSelector.selectionQuantity,
            value: this.cardSelector.selectedList.length
        })
    }
    override hasSelector(): boolean {
        return true
    }
    activateSelection(stateFromParent?:CardState): void {
        this.selectionActive = true
    }
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
}

export class EventCardSelectorRessource extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorRessource'
    override subType!: EventCardSelectorRessourceSubType;
    advancedRessource?: AdvancedRessourceStock
}

export class CardBuilder {
	private selectedCard!: ProjectCardModel | undefined
	private cardInitialState?: CardState
    private buttons: EventCardBuilderButton[] = []
    //private Id!: number
    private option!: CardBuilderOptionType
    private builderIsLocked: boolean = false

    addButtons(buttons: EventCardBuilderButton[]): void {
        this.buttons = buttons
    }
    getButtons(): EventCardBuilderButton[] {return this.buttons}
    getButtonFromName(name: EventCardBuilderButtonNames): EventCardBuilderButton | undefined {
        for(let button of this.buttons){
            if(button.name===name){
                return button
            }
        }
        return
    }
    setOption(option: CardBuilderOptionType): void {this.option = option}
    getOption(): CardBuilderOptionType {return this.option}
    private updateButtonEnabled(name: EventCardBuilderButtonNames, enabled: boolean): void {
        let button = this.getButtonFromName(name)
        if(!button){return}
        button.enabled = enabled
    }
    private updateButtonGroupState(buttonName: ButtonGroupUpdateType): void {
        switch(buttonName){
            case('selectCard'):{
                this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', true)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled('drawCard', false)
                this.updateButtonEnabled('gain6MC', false)
                break
            }
			case('cancelSelectCard'):{
                this.updateButtonEnabled('selectCard', true)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled('drawCard', true)
                this.updateButtonEnabled('gain6MC', true)
                break
            }
            case('buildCard'):{
                this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled('drawCard', false)
                this.updateButtonEnabled('gain6MC', false)
                break
            }
			case('discardSelectedCard'):{
                this.updateButtonEnabled('selectCard', true)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled('drawCard', true)
                this.updateButtonEnabled('gain6MC', true)
                break
            }
            case('drawCard'):case('gain6MC'):{
                this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled('drawCard', false)
                this.updateButtonEnabled('gain6MC', false)
                break
            }
			case('selectionCardSelected'):{
				this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', false)
				this.updateButtonEnabled('buildCard', true)
				this.updateButtonEnabled('discardSelectedCard', true)
				this.updateButtonEnabled('drawCard', false)
                this.updateButtonEnabled('gain6MC', false)
				break
			}
			case('selectionCardDiscarded'):{
				this.updateButtonEnabled('selectCard', true)
				this.updateButtonEnabled('cancelSelectCard', false)
				this.updateButtonEnabled('buildCard', false)
				this.updateButtonEnabled('discardSelectedCard', false)
				this.updateButtonEnabled('drawCard', true)
                this.updateButtonEnabled('gain6MC', true)
				break
			}
			case('resetState'):{
				if(this.builderIsLocked){break}
				this.resetButtons()
				break
			}
        }
    }
	public resetButtons(){
		if(this.builderIsLocked){return}
		for(let button of this.buttons){
			button.resetStartEnabled()
		}
	}
    resolveCardBuilderButtonClicked(button:EventCardBuilderButton){
        switch(button.name){
            case('discardSelectedCard'):{
                this.removeSelectedCard()
                break
            }
            case('buildCard'):case('drawCard'):case('gain6MC'):{
                this.setbuilderIsLocked()
                break
            }
        }
        this.updateButtonGroupState(button.name)
    }
    setSelectedCard(card: ProjectCardModel): void {
        this.selectedCard = card
        this.updateButtonGroupState('selectionCardSelected')
    }
    getSelectedCard(): ProjectCardModel {return this.selectedCard as ProjectCardModel}
    removeSelectedCard(): void {
		this.selectedCard = undefined
        this.updateButtonGroupState('cancelSelectCard')
	}
    setbuilderIsLocked(): void {this.builderIsLocked=true}
    getbuilderIsLocked(): boolean {return this.builderIsLocked}
}

export class EventCardBuilder extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorCardBuilder'
    override subType!: EventCardBuilderSubType;
    CardBuilder: CardBuilder [] = []
    CardBuilderIdHavingFocus?: number
    buildDiscountValue!: number
    buildDiscountUsed!: boolean
    override hasCardBuilder(): boolean {return true}
    override updateCardSelection(selection: ProjectCardModel[]): void {
        this.setSelectedCardToBuild(selection[0])
    }
    private setSelectedCardToBuild(card: ProjectCardModel): void {
        if(this.CardBuilderIdHavingFocus===undefined){return}
        let activeZone = this.CardBuilder[this.CardBuilderIdHavingFocus]
        activeZone.setSelectedCard(card)
        this.removeCardFromSelector(card)
        this.deactivateSelection()
        this.cardSelector.stateFromParent = {selectable: false}
        //activeZone.updateButtonGroupState('selectCard')
    }
    private removeCardFromSelector(card: ProjectCardModel): void {
        for(let i=0; i<this.cardSelector.selectFrom.length; i++){
            if(this.cardSelector.selectFrom[i].id===card.id){
                this.cardSelector.selectFrom.splice(i, 1)
            }
        }
    }
    getCardToBuildId(): number | undefined {
        if(this.CardBuilderIdHavingFocus===undefined){return}
        return this.CardBuilder[this.CardBuilderIdHavingFocus].getSelectedCard()?.id
    }
    cardBuilderButtonClicked(button: EventCardBuilderButton): void {
        if(this.CardBuilderIdHavingFocus===undefined){return}
		//reset state before changing focus
		this.resetNonFocusedBuildersState()

        this.setSelectionOnButtonClick(button)
        let activeZone = this.CardBuilder[this.CardBuilderIdHavingFocus]

        switch(button.name){
            case('selectCard'):{
                this.cardSelector.stateFromParent = {selectable:true}
                break
            }
            case('cancelSelectCard'):{
				this.cardSelector.stateFromParent = {selectable:false}
				break
            }
            case('buildCard'):{
                this.buildDiscountUsed = true
                this.buildDiscountValue = 0
				break
            }
			case('discardSelectedCard'):{
                let card = activeZone.getSelectedCard()
                if(card===undefined){break}
                this.cardSelector.selectFrom.push(card)
                break
            }
        }

        activeZone.resolveCardBuilderButtonClicked(button)

        if(button.name==='selectCard'){return}
        this.cardSelector.stateFromParent = {selectable:false, playable:false}
    }
	private resetNonFocusedBuildersState(){
		//if(!this.CardBuilderIdHavingFocus){return}
		for(let i=0; i<this.CardBuilder.length; i++){
			if(i===this.CardBuilderIdHavingFocus){continue}
			this.CardBuilder[i].resetButtons()
		}
	}
    private setSelectionOnButtonClick(button: EventCardBuilderButton): void {
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
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeQuantity?: number
}

export class EventDeckQuery extends EventBaseModel {
    override readonly type: EventType = 'deck'
    override locksEventpile!: boolean
    override subType!: EventDeckQuerySubType;
    override autoFinalize: boolean = true
    override waiterId!:number
    scanKeep?: Partial<ScanKeep>
    drawDiscard?: Partial<DrawDiscard>
}

export class EventWaiter extends EventBaseModel {
    override readonly type: EventType = 'waiter'
    override locksEventpile: boolean = true
    override subType!: EventWaiterSubType;
    override autoFinalize: boolean = true
    override waiterId!: number
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
    queried: boolean = false
    waiterId!: number
}

export class EventPhase extends EventBaseModel {
    override readonly type: EventType = 'phase'
    override subType!: EventPhaseSubType
    override autoFinalize: boolean = true
    override title!: string
    increaseParameter?: GlobalParameterValue
    increaseResearchScanKeep?: Partial<ScanKeep>
    baseRessource?:RessourceStock | RessourceStock[]
    cardIdToBuild?: number
    drawResultList?: number[]
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeQuantity?: number
}
