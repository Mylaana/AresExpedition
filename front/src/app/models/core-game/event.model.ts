import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardBuilderSubType, EventGenericSubType, EventDeckQuerySubType, EventUnionSubTypes, EventWaiterSubType, EventPhaseSubType, EventCardActivatorSubType, EventComplexCardSelectorSubType, EventTagSelectorSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, DrawDiscard, EventOrigin, GlobalParameterValue, MoonTile, ProjectFilter, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton  } from "./button.model";
import { EventCardBuilderButtonNames, MinMaxEqualType, NonEventButtonNames, SettingSupportedLanguage, TagType } from "../../types/global.type";
import { PlayableCardModel } from "../cards/project-card.model";
import { CardState } from "../../interfaces/card.interface";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { EventStateDTO } from "../../interfaces/event-state.interface";
import { BuilderOption, DeckQueryOptionsEnum, DiscardOptionsEnum, EffectPortalEnum, InputRuleEnum, ProjectFilterNameEnum } from "../../enum/global.enum";
import { BuilderType } from "../../types/phase-card.type";
import { Utils } from "../../utils/utils";
import { SETTING_DEFAULT_LANGUAGE } from "../../global/global-const";
import { GameTextService } from "../../services/core-game/game-text.service";
import { EventTitleKey } from "../../types/text.type";


type ButtonGroupUpdateType = EventCardBuilderButtonNames | 'selectionCardSelected' | 'selectionCardDiscarded' | 'resetState'

export abstract class EventBaseModel {
    private static language: SettingSupportedLanguage = SETTING_DEFAULT_LANGUAGE
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
	lockDisplayUpgraded: boolean = false
	eventOrigin?: EventOrigin
    titleKey!: EventTitleKey
	titleInterpolation!: string[]

    constructor(private gameTextService?: GameTextService){}

    static setLanguage(lang: SettingSupportedLanguage) {
        EventBaseModel.language = lang;
    }
    hasSelector(): boolean {return false}
	hasCardsToSelectFrom(): boolean {return false}
    hasCardBuilder(): boolean {return false}
	hasCardActivator(): boolean {return false}
    getSelectionActive(): boolean {return false}
	onSwitch(): void {}
	fromJson(dto: EventStateDTO){return}
}

export abstract class EventBaseCardSelector extends EventBaseModel {
    override title: string = 'no title provided'
    override button?: EventMainButtonSelector
    refreshSelectorOnSwitch: boolean = true
    protected cardSelector: CardSelector = {
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
	setCardSelector(selector: CardSelector){this.cardSelector = selector}
	getCardSelector():CardSelector{return this.cardSelector}
	getSelectorQuantity(): number {return this.cardSelector.selectionQuantity}
	setSelectorQuantity(quantity: number){this.cardSelector.selectionQuantity = quantity}
	getSelectorSelectFrom(): PlayableCardModel[] {return this.cardSelector.selectFrom}
	setSelectorSelectFrom(selectFrom: PlayableCardModel[]) {this.cardSelector.selectFrom = selectFrom}
	getSelectorSelectedList(): PlayableCardModel[] {return this.cardSelector.selectedList}
	hasSelectorCardSelected(): boolean {return this.cardSelector.selectedList.length>0}
	getSelectorSelectedQuantity():number {return this.getSelectorSelectedList().length}
	getSelectorFilter(): ProjectFilter | undefined {return this.cardSelector.filter}
	setSelectorFilter(filter: ProjectFilter){this.cardSelector.filter = filter}
	setSelectorStateFromParent(state: Partial<CardState>) {this.cardSelector.stateFromParent = Utils.toFullCardState(state)}
	setSelectorFilterAuthorizedTag(tagType: TagType | TagType[]) {
		if(!this.cardSelector.filter){return}
		this.cardSelector.filter.authorizedTag = Utils.toArray(tagType)
	}
	setSelectorQuantityTreshold(tresholdType: MinMaxEqualType){this.cardSelector.selectionQuantityTreshold = tresholdType}
	getSelectorQuantityTreshold():MinMaxEqualType {return this.cardSelector.selectionQuantityTreshold}
	setSelectorInitialState(state: Partial<CardState>){this.cardSelector.cardInitialState = Utils.toFullCardState(state)}
}

export class EventCardSelector extends EventBaseCardSelector{
    override readonly type: EventType = 'cardSelector'
    override subType!: EventCardSelectorSubType
}

export class EventComplexCardSelector extends EventBaseCardSelector{
    override readonly type: EventType = 'ComplexSelector'
    override subType!: EventComplexCardSelectorSubType
	scanKeepOptions!: DeckQueryOptionsEnum
	discardOptions!: DiscardOptionsEnum
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
	scanUsed: boolean = false
	hasScan: boolean = false
	override hasCardActivator(): boolean {return true}
}

export class CardBuilder {
	private selectedCard!: PlayableCardModel | undefined
	private cardInitialState?: CardState
    private buttons: EventCardBuilderButton[] = []
    private option!: BuilderOption
    private builderIsLocked: boolean = false
	private firstCardBuilt: boolean = false

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
    setOption(option: BuilderOption): void {this.option = option}
    getOption(): BuilderOption {return this.option}
    private updateButtonEnabled(name: EventCardBuilderButtonNames, enabled: boolean): void {
        let button = this.getButtonFromName(name)
        if(!button){return}
        button.setEnabled(enabled)
    }
    private updateButtonGroupState(buttonName: ButtonGroupUpdateType): void {
        switch(buttonName){
            case('selectCard'):{
                this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', true)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, false)
                this.updateButtonEnabled(BuilderOption.gain6MC, false)
                break
            }
			case('cancelSelectCard'):{
                this.updateButtonEnabled('selectCard', true)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, true)
                this.updateButtonEnabled(BuilderOption.gain6MC, true)
                break
            }
            case('buildCard'):{
                this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, false)
                this.updateButtonEnabled(BuilderOption.gain6MC, false)
                break
            }
			case('discardSelectedCard'):{
                this.updateButtonEnabled('selectCard', true)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, true)
                this.updateButtonEnabled(BuilderOption.gain6MC, true)
                break
            }
            case(BuilderOption.drawCard):case(BuilderOption.gain6MC):{
                this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', false)
                this.updateButtonEnabled('buildCard', false)
                this.updateButtonEnabled('discardSelectedCard', false)
                this.updateButtonEnabled(BuilderOption.drawCard, false)
                this.updateButtonEnabled(BuilderOption.gain6MC, false)
                break
            }
			case('selectionCardSelected'):{
				this.updateButtonEnabled('selectCard', false)
				this.updateButtonEnabled('cancelSelectCard', false)
				this.updateButtonEnabled('buildCard', true)
				this.updateButtonEnabled('discardSelectedCard', true)
				this.updateButtonEnabled(BuilderOption.drawCard, false)
                this.updateButtonEnabled(BuilderOption.gain6MC, false)
				break
			}
			case('selectionCardDiscarded'):{
				this.updateButtonEnabled('selectCard', true)
				this.updateButtonEnabled('cancelSelectCard', false)
				this.updateButtonEnabled('buildCard', false)
				this.updateButtonEnabled('discardSelectedCard', false)
				this.updateButtonEnabled(BuilderOption.drawCard, true)
                this.updateButtonEnabled(BuilderOption.gain6MC, true)
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
            case('buildCard'):case(BuilderOption.drawCard):case(BuilderOption.gain6MC):{
                this.setBuilderIsLocked()
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
		console.log('removed')
		this.selectedCard = undefined
        this.updateButtonGroupState('cancelSelectCard')
	}
    setBuilderIsLocked(locked?: boolean): void {this.builderIsLocked=locked??true}
    getBuilderIsLocked(): boolean {
		if(this.option===BuilderOption.developmentSecondBuilder && !this.firstCardBuilt){
			return true
		}
		return this.builderIsLocked
	}
	getBuitCardCode(): string | undefined {
		if(this.builderIsLocked===false){return}
		if(!this.selectedCard){return}
		return this.getSelectedCard().cardCode
	}
	resetBuilder(): void {
		if(this.builderIsLocked){return}
		this.resetButtons()
		this.selectedCard = undefined
	}
	setFirstCardBuilt(): void {
		if(this.option!=BuilderOption.developmentSecondBuilder){return}
		this.firstCardBuilt = true
		this.resetButtons()
	}
	isLockingValidation(): boolean {
		return this.selectedCard!=undefined && this.builderIsLocked===false
	}
}

export class EventCardBuilder extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorCardBuilder'
    override subType!: EventCardBuilderSubType;
    cardBuilder: CardBuilder [] = []
    cardBuilderIdHavingFocus?: number
    buildDiscountValue!: number
    buildDiscountUsed!: boolean
	alternativeCostUsedButtonName: NonEventButtonNames[] = []
	builderType!: BuilderType
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
            if(this.cardSelector.selectFrom[i].cardCode===card.cardCode){
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
			if(i===this.cardBuilderIdHavingFocus || this.cardBuilder[i].getBuilderIsLocked()){continue}
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
	setFirstCardBuilt(){
		this.alternativeCostUsedButtonName = []
		if(this.builderType!="development_second_card"){return}
		this.cardBuilder[1].setFirstCardBuilt()
		this.cardBuilder[1].setFirstCardBuilt()
		this.cardSelector.filter = {type:ProjectFilterNameEnum.developmentPhaseSecondBuilder}
		this.title = 'Play a second green card with a printed cost of 12MC or less.'
	}

	override onSwitch(): void {
		//reset cardBuilder's selection onSwitch
		for(let builder of this.cardBuilder){
			builder.resetBuilder()
		}
	}
	updateButtonEnabled(){
		if(!this.button){return}
		for(let b of this.cardBuilder){
			if(b.isLockingValidation()){
				this.button.setEnabled(false)
				return
			}
		}
		this.button.setEnabled(true)
	}
	onAlternativeCostUse(buttonName: NonEventButtonNames){
		this.alternativeCostUsedButtonName.push(buttonName)
	}
	getAlternativeCostUsed(): NonEventButtonNames[] {
		return this.alternativeCostUsedButtonName
	}
}

export class EventTagSelector extends EventBaseModel {
    override readonly type: EventType = 'tagSelector'
    override subType!: EventTagSelectorSubType;
    override title!: string
    targetCardId!: string
	selectedTag!: TagType
	authorizedTagList!: TagType[]
    override autoFinalize: boolean = false
}

export class EventTargetCard extends EventBaseModel {
    override readonly type: EventType = 'targetCard'
    override subType!: EventTargetCardSubType;
    targetCardId!: string
	addTag!: TagType
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
    drawResultList?: string[]
	thenDiscard?: number
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeQuantity?: number
	addForestPoint?: number
	selectedPhase?: SelectablePhaseEnum
	gainOceanNumber?: number
	production?: RessourceStock | RessourceStock[]
	increaseTr?: number
	loadProductionCardList?: string[]
    effectPortal?: EffectPortalEnum
	isCardProductionDouble?: boolean
	firstCardProduction?: string[]
	resourceConversionInputRule?:InputRuleEnum
	resourceConversionQuantity?:number
	addMoonTile?:MoonTile | MoonTile[]
}

export class EventDeckQuery extends EventBaseModel {
    override readonly type: EventType = 'deck'
    override subType!: EventDeckQuerySubType;
    override autoFinalize: boolean = true
    override waiterId!:number
    scanKeep?: Partial<ScanKeep>
    drawDiscard?: Partial<DrawDiscard>
	isCardProduction?: boolean
	isCardProductionDouble?: boolean
	options?: DeckQueryOptionsEnum
	drawThenDiscard?: boolean
	firstCardProduction?: string[]
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
    drawResultCardList: string[] = []
    finalized: boolean = false
    served: boolean = false
    queried: boolean = false
    waiterId!: number
	isCardProduction: boolean = false
	isCardProductionDouble: boolean = false
	scanKeepOptions?: DeckQueryOptionsEnum
	discardAfterDraw?: number
	firstCardProduction?: string []
}

export class EventPhase extends EventBaseModel {
    override readonly type: EventType = 'phase'
    override subType!: EventPhaseSubType
    override autoFinalize: boolean = true
    override title!: string
	productionApplied?: boolean
	productionMegacreditFromPhaseCard?: number
	productionDoubleApplied?: boolean
    increaseParameter?: GlobalParameterValue
    increaseResearchScanKeep?: Partial<ScanKeep>
    baseRessource?:RessourceStock | RessourceStock[]
    cardIdToBuild?: number
    drawResultList?: number[]
    phaseCardUpgradeList?: number[]
    phaseCardUpgradeQuantity?: number
}
