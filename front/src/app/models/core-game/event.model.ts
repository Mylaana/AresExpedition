import { EventCardSelectorSubType, EventType, EventTargetCardSubType, EventCardSelectorRessourceSubType, EventCardBuilderSubType, EventGenericSubType, EventDeckQuerySubType, EventUnionSubTypes, EventWaiterSubType, EventPhaseSubType, EventCardActivatorSubType, EventComplexCardSelectorSubType, EventTagSelectorSubType } from "../../types/event.type";
import { AdvancedRessourceStock, CardSelector, DrawDiscard, EventOrigin, GlobalParameterValue, MoonTile, ProjectFilter, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { EventMainButton, EventMainButtonSelector, EventCardBuilderButton } from "./button.model";
import { MinMaxEqualType, NonEventButtonNames, SettingSupportedLanguage, TagType } from "../../types/global.type";
import { PlayableCardModel } from "../cards/project-card.model";
import { CardState } from "../../interfaces/card.interface";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { EventStateDTO } from "../../interfaces/event-state.interface";
import { DeckQueryOptionsEnum, DiscardOptionsEnum, EffectPortalEnum, InputRuleEnum } from "../../enum/global.enum";
import { BuilderType } from "../../types/phase-card.type";
import { Utils } from "../../utils/utils";
import { SETTING_DEFAULT_LANGUAGE } from "../../global/global-const";
import { GameTextService } from "../../services/core-game/game-text.service";
import { EventTitleKey } from "../../types/text.type";
import { CardBuilder } from "./card-builder.model";
import { ALTERNATIVE_PAY_EVENT } from "../../maps/card-builder-maps";


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
	scrollToTopOnActivation: boolean = true

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
    selectAll(){
        this.updateCardSelection(this.getSelectorSelectFrom())
    }
    selectNone(){
        this.updateCardSelection([])
    }
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

export class EventCardBuilder extends EventBaseCardSelector {
    override readonly type: EventType = 'cardSelectorCardBuilder'
    override subType!: EventCardBuilderSubType;
    private currentBuilder!: CardBuilder
    cardBuilder: CardBuilder [] = []
	builderType!: BuilderType
    private eventIsComplete = false
    override hasCardBuilder(): boolean {return true}
    override updateCardSelection(selection: PlayableCardModel[]): void {
		this.setSelectedCardInCurrentCardBuilder(selection[0])
    }
    public initialize(){
        this.currentBuilder = this.cardBuilder[0]
        let otherBuilders = this.cardBuilder.filter(b => b!=this.currentBuilder)
        this.activateSelection()
        for(let b of otherBuilders){
            b.setBuilderIsLocked()
        }
    }
    public applyCardSelected(card: PlayableCardModel){
        if(this.eventIsComplete){return}
        this.resetCurrentBuilderSelectedCardIfExists()
        this.setSelectedCardInCurrentCardBuilder(card)
        this.removeCardFromSelector(card)
    }
    private setSelectedCardInCurrentCardBuilder(card: PlayableCardModel): void {
		if(!this.currentBuilder){return}
        this.currentBuilder.setSelectedCard(card)
    }
    private removeCardFromSelector(card: PlayableCardModel): void {
        for(let i=0; i<this.cardSelector.selectFrom.length; i++){
            if(this.cardSelector.selectFrom[i].cardCode===card.cardCode){
                this.cardSelector.selectFrom.splice(i, 1)
            }
        }
    }
    getCardToBuild(): PlayableCardModel | undefined {
		if(!this.currentBuilder){return}
        return this.currentBuilder.getSelectedCard()
    }
    cardBuilderButtonClicked(button: EventCardBuilderButton, nonCurrentBuilder?: CardBuilder): void {
        if(this.eventIsComplete){return}
        if(!this.currentBuilder){return}

        let builder = nonCurrentBuilder?nonCurrentBuilder:this.currentBuilder

        switch(button.name){
            case('buildCard'):{
                this.activateNextBuilder()
				break
            }
			case('discardSelectedCard'):{
                this.resetCurrentBuilderSelectedCardIfExists()
                break
            }
        }

        builder.resolveCardBuilderButtonClicked(button)
    }
    private resetCurrentBuilderSelectedCardIfExists(){
        let selectedCard = this.currentBuilder.getSelectedCard()
        if(!selectedCard){return}
        this.currentBuilder.resetBuilder()
        this.cardSelector.selectFrom.push(selectedCard)
    }
    private activateNextBuilder(){
        if(this.eventIsComplete){return}
        if(this.currentBuilder === this.cardBuilder[this.cardBuilder.length-1]){
            this.setEventIsComplete()
            return
        }
        let builder = this.getNextBuilder()
        if(!builder){
            this.setEventIsComplete()
            return
        }
        this.currentBuilder.setBuilderIsLocked(false)
    }
    private setEventIsComplete(){
        this.deactivateSelection()
        this.eventIsComplete = true
        this.cardSelector.stateFromParent = Utils.toFullCardState({})
    }
    private getNextBuilder(): CardBuilder | undefined {
        for(let b of this.cardBuilder){
            if(b===this.currentBuilder){
                continue
            }
            if(b.isEligibleForNext()){return b}
        }
        return
    }
    isComplete(): boolean {
        return this.eventIsComplete
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
    getCurrentBuilderDiscount(): number {
        return this.currentBuilder.getDiscount()
    }
    lockCurrentBuilder(){
        this.currentBuilder.setBuilderIsLocked()
    }
    addDiscountToCurrentCardBuilder(discount: number){
        this.currentBuilder.addDiscount(discount)
    }
    resolveCurrentBuilderAlternativeCostUsed(name: NonEventButtonNames){
        if(!ALTERNATIVE_PAY_EVENT[name]){return}
        ALTERNATIVE_PAY_EVENT[name](this.currentBuilder)
    }
    resolveBuilderAlternativeOptionUsed(builder: CardBuilder, option: NonEventButtonNames){
        for(let b of this.cardBuilder){
            if(b===builder){
                b.setBuilderIsLocked(true)
                b.setAlternativeOptionUsed(option)
                break
            }
        }
        if(this.cardBuilder.filter((e) => e.getBuilderIsLocked()===false).length===0){
            this.setEventIsComplete()
        }
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
	override scrollToTopOnActivation: boolean = false
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
