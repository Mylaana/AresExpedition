import { AdvancedRessourceStock } from "../../interfaces/global.interface"
import { AdvancedRessourceType, SettingSupportedLanguage, TagType } from "../../types/global.type"
import { SummaryType, CardType, PrerequisiteType,PrerequisiteTresholdType, TriggerLimit, LocalizedText} from "../../types/project-card.type"
import { ProjectFilter } from "../../interfaces/global.interface"
import { PlayedCardStocksDTO, TriggerStateDTO } from "../../interfaces/dto/project-card-dto.interface"
import { CardStats, PlayableCardEffect, PlayableCardInterface } from "../../interfaces/card.interface"
import { Utils } from "../../utils/utils"
import { ProjectFilterNameEnum } from "../../enum/global.enum"
import { SETTING_DEFAULT_LANGUAGE } from "../../global/global-const"


export class PlayableCardModel {
    cardCode!: string;
    origin!: string;
	balancedVersion!: string;
    costInitial!: number;
	cost!: number;
    tagsId!: number[];
    cardSummaryType?: SummaryType;
    cardType!: CardType;
    vpNumber?: string;
    prerequisiteTresholdType?: PrerequisiteTresholdType;
    prerequisiteType?: PrerequisiteType;
    prerequisiteTresholdValue?: number;
    phaseUp?: string;
    phaseDown?: string;
	private effects: PlayableCardEffect[] = []
    effectSummaryText?: string;
    effectText?: string;
    prerequisiteTagId?: number;
	stock?: AdvancedRessourceStock[];
    stockable?: AdvancedRessourceType[]
    triggerLimit!: TriggerLimit
	activated: number = 0
	startingMegacredits?: number
	status!: string
    effectSummaryOption!: string
    effectSummaryOption2!: string
	scalingVp!: boolean
	tagStock!: number[] // this stores additional tags and wildtags result
    tagsUrl?: string[];

	//stats
	stats?: CardStats

	private static _language: SettingSupportedLanguage = SETTING_DEFAULT_LANGUAGE
	constructor(
		private raw?: PlayableCardInterface,
	){
		if(!raw){return}
		this.cardCode = raw.cardCode
		this.origin = raw.origin
		this.costInitial = raw.costInitial ?? 0
		this.cost = this.costInitial
		this.tagsId = raw.tagsId ?? []
		this.cardSummaryType = raw.cardSummaryType
		this.cardType = raw.cardType
		this.vpNumber = raw.vpNumber
		this.prerequisiteTresholdType = raw.prerequisiteTresholdType
		this.prerequisiteType = raw.prerequisiteType
		this.prerequisiteTresholdValue = raw.prerequisiteTresholdValue
		this.phaseUp = raw.phaseUp
		this.phaseDown = raw.phaseDown
		this.effects = raw.effects ?? []
		this.effectSummaryText = raw.effectSummaryText
		this.effectText = raw.effectText
		this.prerequisiteTagId = raw.prerequisiteTagId
		this.stock = raw.stock ?? []
		this.stockable = raw.stockable
		this.activated = 0
		this.startingMegacredits = raw.startingMegacredits
		this.status = raw.status
		this.effectSummaryOption = raw.effectSummaryOption ?? ''
		this.effectSummaryOption2 = raw.effectSummaryOption2 ?? ''
		this.scalingVp = raw.scalingVp ?? false
		this.tagStock = []
		this.tagsUrl = raw.tagsUrl
		if(this.stockable){
			for(let stock of this.stockable){
				this.setInitialStock(stock)
			}
		}
		this.balancedVersion = raw.balancedVersion??''
	}

	static setLanguage(lang: SettingSupportedLanguage) {
		PlayableCardModel._language = lang;
	}
	//Localized getters
	hasPlayedText(): boolean {return this.hasLocalizedField(this.raw?.playedText)}
	hasPrerequisiteText(): boolean {return this.hasLocalizedField(this.raw?.prerequisiteText)}
	getTitle(): string {return this.getLanguageOrFallback(this.raw?.title)}
	getPlayedText(): string[] {return this.getLanguageOrFallback(this.raw?.playedText).split('$skipline$')}
	getVpText(): string {return this.getLanguageOrFallback(this.raw?.vpText, false)}
	getEffects(): PlayableCardEffect[] {return this.effects}
	getEffectText(effect: PlayableCardEffect): string {return this.getLanguageOrFallback(effect.effectText)}
	getEffectSummaryText(effect: PlayableCardEffect): string {return this.getLanguageOrFallback(effect.effectSummaryText)}
	getActionCaption(optionIndex: number): string {
		if(!this.raw?.actionCaption || this.raw.actionCaption.length < optionIndex+1){return ''}
		return this.getLanguageOrFallback(this.raw.actionCaption[optionIndex])
	}
	getPrerequisiteText(): string {return this.getLanguageOrFallback(this.raw?.prerequisiteText)}
	getPrerequisiteSummary(): string {return this.getLanguageOrFallback(this.raw?.prerequisiteSummaryText)}

	getLanguageOrFallback(obj: LocalizedText | undefined, displayMissing: boolean = true, fallbackLang: SettingSupportedLanguage = SETTING_DEFAULT_LANGUAGE): string {
		let result = obj?.[PlayableCardModel._language] || obj?.[fallbackLang]
		if(result){return result}
		if(displayMissing){return '[Missing]'}
		return ''
	}
	hasLocalizedField(field?: LocalizedText): boolean {
		return !!(field?.[PlayableCardModel._language] || field?.[SETTING_DEFAULT_LANGUAGE]);
	}

	//Other
    getCardTriggerLimit(): TriggerLimit | undefined{
        return this.triggerLimit
    }
	setCardTriggerLimit(limit: TriggerLimit){
		this.triggerLimit = limit
	}
    addRessourceToStock(ressource: AdvancedRessourceStock): void {
        if(this.checkStockable(ressource.name)===false){return}
        if(this.checkStockExists(ressource.name)===false){
            this.setInitialStock(ressource.name)
        }
        if(!this.stock){return}

        for(let s of this.stock){
            if(s.name===ressource.name){
                s.valueStock += ressource.valueStock
            }
        }
    }
    checkStockable(ressourceType: AdvancedRessourceType, minimumStockQuantity: number = 0): boolean {
        //add a check if ressource is stockable on this card
        if(this.stockable===undefined || this.stockable.length===0){return false}
        if(!this.stockable.includes(ressourceType)){return false}
		for(let s of this.stock??[]){
			if(s.name===ressourceType && s.valueStock>=minimumStockQuantity){return true}
		}
		return false
    }
    checkStockExists(ressource:AdvancedRessourceType): boolean {
        if(!this.stock){return false}

        for(let s of this.stock){
            if(s.name===ressource){
                return true
            }
        }
        return false
    }
    setInitialStock(ressource: AdvancedRessourceType): void {
        if(!this.stock){
            this.stock = []
        }
        this.stock.push({name: ressource,valueStock: 0})
    }
    getStockValue(ressourceName:AdvancedRessourceType): number {
        if(!this.stock){return 0}
        for(let s of this.stock){
            if(s.name===ressourceName){
                return s.valueStock
            }
        }
        return 0
    }
    isFilterOk(filter: ProjectFilter): boolean {
        switch(filter.type){
            case(ProjectFilterNameEnum.greenProject):{
                if(this.cardType==='greenProject'){
                    return true
                }
                break
            }
            case(ProjectFilterNameEnum.blueOrRedProject):{
                if(this.cardType!='greenProject'){
                    return true
                }
                break
            }
            case(ProjectFilterNameEnum.action):{
				return this.hasSummaryType('action')
            }
            case(ProjectFilterNameEnum.stockable):{
                //converts filterValue into stockable name list
                if(!filter.stockableType){return false}
                let filterValueList: AdvancedRessourceType[] = Utils.toArray(filter.stockableType)

                for(let f of filterValueList){
                    if(this.checkStockable(f, filter.minimumStockQuantity)){
                        return true
                    }
                }
                break
            }
			case(ProjectFilterNameEnum.blueProject):{
				return this.cardType === 'blueProject'
			}
			case(ProjectFilterNameEnum.hasTagEvent):{
				return this.hasTag('event')
			}
			case(ProjectFilterNameEnum.hasTagPlantOrScience):{
				return this.hasTag('science') || this.hasTag('plant')
			}
			case(ProjectFilterNameEnum.green9MCFree):{
				if(this.costInitial <= 9 && this.cardType==='greenProject'){return true}
				break
			}
			case(ProjectFilterNameEnum.maiNiProductions):{
				if(this.costInitial <= 12){return true}
				break
			}
			case(ProjectFilterNameEnum.playedDisplayCorpsAndActivable):{
				if(this.hasSummaryType('action')){return true}
				break
			}
			case(ProjectFilterNameEnum.playedDisplayTriggersAndNonActivableCorps):{
				if(this.hasSummaryType('trigger') && this.hasSummaryType('action')===false){return true}
				if(this.hasSummaryType('action')===false && this.cardType==='corporation'){return true}
				break
			}
			case(ProjectFilterNameEnum.playedDisplayRed):{
				if(this.cardType==='redProject'){return true}
				break
			}
			case(ProjectFilterNameEnum.developmentPhaseSecondBuilder):{
				if(this.cardType!='greenProject'){return false}
				return this.costInitial<=12
			}
			case(ProjectFilterNameEnum.corporations):{
				if(this.cardType!='corporation'){return false}
				return true
			}
			case(ProjectFilterNameEnum.notCorporations):{
				if(this.cardType==='corporation'){return false}
				return true
			}
			case(ProjectFilterNameEnum.syntheticCatastrophe):{
                if(this.cardType==='redProject' && this.cardCode!='P10'){return true}
                break
            }
			case(ProjectFilterNameEnum.authorizedTag):{
				for(let t of this.tagsId){
					if(filter.authorizedTag?.includes(Utils.toTagType(t))){return true}
				}
				break
			}
			case(ProjectFilterNameEnum.doubleProduction):{
				return this.getTitle(), this.hasSummaryType('production') || this.hasSummaryType('mixedProduction')
			}
			case(ProjectFilterNameEnum.redProject):{
				return this.cardType==='redProject'
			}
			case(ProjectFilterNameEnum.cost20orMore):{
				return this.costInitial>=20
			}
        }
        return false
    }
	private hasSummaryType(summaryType: SummaryType): boolean {
		//console.log(this.title, this.effects)
		for(let effect of this.effects){
			if(effect.effectSummaryType===summaryType){return true}
		}
		return false
	}
	hasTrigger(): boolean {
		return this.hasSummaryType('trigger')
	}
	hasTagId(tagId: number): boolean {
		for(let t of this.tagsId){
			if(t===tagId){
				return true
			}
		}
		return false
	}
	hasTag(tag: TagType): boolean {
		if(tag==='none'){
			return this.tagsId.filter((el) => el!=-1).length===0
		}
		return this.hasTagId(Utils.toTagId(tag))
	}
	hasTagInList(tagList: TagType[]): boolean {
		for(let t of tagList){
			if(this.hasTag(t)){
				return true
			}
		}
		return false
	}
	addTagToStock(tag: TagType){
		if(!this.tagStock){this.tagStock=[]}
		this.tagStock.push(Utils.toTagId(tag))
		this.applyTagStockToCurrentTags()
	}
	applyTagStockToCurrentTags(){
		let remainingStock = Utils.jsonCopy(this.tagStock)

		//CLM exception
		if(this.cardCode==='CF3'){return}

		//Research grant exception
		if(this.cardCode==='P24'){
			this.tagsId = this.tagStock
			return
		}
		//replace wild tags with stock
		this.tagsId = this.tagsId.filter((el) => ![10, -1].includes(el)).concat(remainingStock)
	}
	hasStats(): boolean {
		if(!this.stats){
			return false
		}
		return true
	}
	toStockDTO(): PlayedCardStocksDTO {
		let dto : PlayedCardStocksDTO = {}
		if(this.stock){dto.s = this.stock}
		if(this.tagStock){dto.t = this.tagStock}
		return dto
	}
	loadRessourceStockFromJson(stock: AdvancedRessourceStock[]){
		this.stock = stock
	}
	loadTagStockFromJson(tagStock: number[]){
		this.tagStock = tagStock
		this.applyTagStockToCurrentTags()
	}
}

/**
 * This Class handles Blue project card with trigger effects
 */
export class TriggerState {
    playedCards: string[] = []
    activeCards: string[] = []
    activeCostModTrigger: string[] = []

	constructor(dto?: TriggerStateDTO){
		if(!dto){return}
		this.playedCards = dto.p
		this.activeCards = dto.a
	}

    getPlayedTriggers(): string[] {
        return this.playedCards
    }
    getActivePlayedTriggers(): string[] {
        return this.activeCards
    }
    getCostMod(): string[] {
        return this.activeCostModTrigger
    }
    playTrigger(cardCode: string): void {
        this.playedCards.push(cardCode)
        this.activeCards.push(cardCode)
    }
    setTriggerInactive(cardCode: string): void {
        this.activeCards = this.activeCards.filter((e, i) => e !== cardCode)
    }
	public static fromJson(data: TriggerStateDTO): TriggerState {
		if (!data.a || !data.p){
			throw new Error("Invalid TriggerStateDTO: Missing required fields")
		}
		return new TriggerState(data)
	}
	public toJson(): TriggerStateDTO {
		return {
			a: this.activeCards,
			p: this.playedCards
		}
	}
}
