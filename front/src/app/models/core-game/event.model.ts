import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardBuilderSubType, EventGenericSubType, EventDeckQuerySubType, EventUnionSubTypes, EventWaiterSubType, EventPhaseSubType, EventCardActivatorSubType, EventScanKeepResult } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, DrawDiscard, GlobalParameterValue, ProjectFilter, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton  } from "./button.model";
import { CardBuilderOptionType, EventCardBuilderButtonNames } from "../../types/global.type";
import { PlayableCardModel } from "../cards/project-card.model";
import { CardState } from "../../interfaces/card.interface";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { EventStateDTO } from "../../interfaces/dto/event-state-dto.interface";
import { EventStateOriginEnum } from "../../enum/eventstate.enum";
import { EventStateFactory } from "../../factory/event-state-factory.service";
import { DeckQueryOptionsEnum } from "../../enum/global.enum";


type ButtonGroupUpdateType = EventCardBuilderButtonNames | 'selectionCardSelected' | 'selectionCardDiscarded' | 'resetState'

export abstract class EventBaseModel {
    readonly type!: EventType
    readonly subType!: EventUnionSubTypes
    finalized: boolean = false
    autoFinalize: boolean = false
    id!: number
    button?: EventMainButton
    readonly title?: string
    waiterId?: number
	lockSellButton: boolean = false
	lockRollbackButton: boolean = false
	lockValidateButton: boolean = false

    hasSelector(): boolean {return false}
	hasCardsToSelectFrom(): boolean {return false}
    hasCardBuilder(): boolean {return false}
	hasCardActivator(): boolean {return false}
    getSelectionActive(): boolean {return false}
	onSwitch(): void {}
	toJson(eventStateOperation: EventStateOriginEnum = EventStateOriginEnum.client): EventStateDTO | undefined{
		return EventStateFactory.toJson(this, eventStateOperation)
	}
	fromJson(dto: EventStateDTO){return}
}

export abstract class EventBaseCardSelector extends EventBaseModel {
    override title: string = 'no title provided'
    override button?: EventMainButtonSelector
    refreshSelectorOnSwitch: boolean = true
    cardSelector: CardSelector = {
        selectFrom: [],
        selectedList: [],
        selectionQuantity: 0,
        selectionQuantityTreshold: 'equal'
    }
    private selectionActive: boolean = false

    updateCardSelection(selection:PlayableCardModel[]): void {
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
	override hasCardsToSelectFrom(): boolean {
		return this.cardSelector.selectFrom.length > 0
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

export class EventScanKeepCardSelector extends EventBaseCardSelector{
    override readonly type: EventType = 'scanKeepSelector'
    override subType!: EventScanKeepResult
	options!: DeckQueryOptionsEnum
}

export class EventCardSelectorRessource extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorRessource'
    override subType!: EventCardSelectorRessourceSubType;
    advancedRessource?: AdvancedRessourceStock
}

export class EventCardActivator extends EventBaseCardSelector {
    override readonly type: EventType = 'cardActivator'
	override subType!: EventCardActivatorSubType
    activationLog: {[key: string]: number } = {}
	doubleActivationMaxNumber!: number
	doubleActivationCount: number = 0
	override hasCardActivator(): boolean {return true}
	override fromJson(dto: EventStateDTO): void {
		this.activationLog = dto.v??{}
	}
}

export class CardBuilder {
	private selectedCard!: PlayableCardModel | undefined
	private cardInitialState?: CardState
    private buttons: EventCardBuilderButton[] = []
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
    setSelectedCard(card: PlayableCardModel): void {
        this.selectedCard = card
        this.updateButtonGroupState('selectionCardSelected')
    }
    getSelectedCard(): PlayableCardModel {return this.selectedCard as PlayableCardModel}
    removeSelectedCard(): void {
		this.selectedCard = undefined
        this.updateButtonGroupState('cancelSelectCard')
	}
    setbuilderIsLocked(locked?: boolean): void {this.builderIsLocked=locked??true}
    getbuilderIsLocked(): boolean {return this.builderIsLocked}
	resetBuilder(): void {
		if(this.builderIsLocked){return}
		this.resetButtons()
		this.selectedCard = undefined
	}
}

export class EventCardBuilder extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorCardBuilder'
    override subType!: EventCardBuilderSubType;
    cardBuilder: CardBuilder [] = []
    cardBuilderIdHavingFocus?: number
    buildDiscountValue!: number
    buildDiscountUsed!: boolean
    override hasCardBuilder(): boolean {return true}
    override updateCardSelection(selection: PlayableCardModel[]): void {
		this.setSelectedCardToBuild(selection[0])
    }
    private setSelectedCardToBuild(card: PlayableCardModel): void {
		if(this.cardBuilderIdHavingFocus===undefined){return}
        let activeZone = this.cardBuilder[this.cardBuilderIdHavingFocus]
        activeZone.setSelectedCard(card)
        this.removeCardFromSelector(card)
        this.deactivateSelection()
        this.cardSelector.stateFromParent = {selectable: false}
    }
    private removeCardFromSelector(card: PlayableCardModel): void {
        for(let i=0; i<this.cardSelector.selectFrom.length; i++){
            if(this.cardSelector.selectFrom[i].id===card.id){
                this.cardSelector.selectFrom.splice(i, 1)
            }
        }
    }
    getCardToBuildId(): PlayableCardModel | undefined {
        if(this.cardBuilderIdHavingFocus===undefined){return}
        return this.cardBuilder[this.cardBuilderIdHavingFocus].getSelectedCard()
    }
    cardBuilderButtonClicked(button: EventCardBuilderButton): void {
        if(this.cardBuilderIdHavingFocus===undefined){return}
		//reset state before changing focus
		this.resetNonFocusedBuildersState()

        this.setSelectionOnButtonClick(button)
        let activeZone = this.cardBuilder[this.cardBuilderIdHavingFocus]

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
				this.discardBuilderSelectedCard(this.cardBuilderIdHavingFocus)
                break
            }
        }

        activeZone.resolveCardBuilderButtonClicked(button)
    }
	private discardBuilderSelectedCard(builderId: number){
		let targetBuilder = this.cardBuilder[builderId]
		let card = targetBuilder.getSelectedCard()
		if(card===undefined){return}
		this.cardSelector.selectFrom.push(card)
	}
	private resetNonFocusedBuildersState(){
		for(let i=0; i<this.cardBuilder.length; i++){
			if(i===this.cardBuilderIdHavingFocus || this.cardBuilder[i].getbuilderIsLocked()){continue}
			this.discardBuilderSelectedCard(i)
			this.cardBuilder[i].resetBuilder()
			break
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

	override onSwitch(): void {
		//reset cardBuilder's selection onSwitch
		for(let builder of this.cardBuilder){
			builder.resetBuilder()
		}
	}
	override fromJson(dto: EventStateDTO): void {
		if(dto.v){
			let index: number = 0
			for(let locked of dto.v){
				this.cardBuilder[index].setbuilderIsLocked(locked)
				index ++
			}
		}
	}
}

export class EventTargetCard extends EventBaseModel {
    override readonly type: EventType = 'targetCard'
    override subType!: EventTargetCardSubType;
    targetCardId!: string
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
    cardIdToBuild?: PlayableCardModel
    drawResultList?: number[]
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeQuantity?: number
	addForestPoint?: number
	selectedPhase?: SelectablePhaseEnum
	gainOceanNumber?: number
	production?: RessourceStock | RessourceStock[]
	increaseTr?: number
}

export class EventDeckQuery extends EventBaseModel {
    override readonly type: EventType = 'deck'
    override subType!: EventDeckQuerySubType;
    override autoFinalize: boolean = true
    override waiterId!:number
    scanKeep?: Partial<ScanKeep>
    drawDiscard?: Partial<DrawDiscard>
	isCardProduction?: boolean
	options?: DeckQueryOptionsEnum
}

export class EventWaiter extends EventBaseModel {
    override readonly type: EventType = 'waiter'
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
	isCardProduction: boolean = false
	scanKeepOptions?: DeckQueryOptionsEnum
}

export class EventPhase extends EventBaseModel {
    override readonly type: EventType = 'phase'
    override subType!: EventPhaseSubType
    override autoFinalize: boolean = true
    override title!: string
	productionApplied?: boolean
	productionCardList?: PlayableCardModel[]
    increaseParameter?: GlobalParameterValue
    increaseResearchScanKeep?: Partial<ScanKeep>
    baseRessource?:RessourceStock | RessourceStock[]
    cardIdToBuild?: number
    drawResultList?: number[]
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeQuantity?: number
}
