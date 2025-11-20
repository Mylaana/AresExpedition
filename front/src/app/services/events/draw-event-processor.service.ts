import { Injectable } from "@angular/core";
import { RessourceInfo, RessourceStock, ScanKeep } from "../../interfaces/global.interface";
import { ProjectCardInfoService } from "../cards/project-card-info.service";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { BuilderType } from "../../types/phase-card.type";
import { PhaseCardModel } from "../../models/cards/phase-card.model";
import { DrawEvent, EventBaseModel, EventPhase } from "../../models/core-game/event.model";
import { Logger } from "../../utils/utils";
import { RxStompService } from "../websocket/rx-stomp.service";
import { SelectablePhaseEnum } from "../../enum/phase.enum";
import { myUUID } from "../../types/global.type";
import { GameParamService } from "../core-game/game-param.service";
import { EventFactory } from "../../factory/event/event-factory";


@Injectable()
export class DrawEventHandler {
	constructor(
		private gameStateService:GameStateFacadeService,
		private projectCardInfoService: ProjectCardInfoService,
		private rxStompService: RxStompService
	){}
	handleQueueUpdate(drawQueue: DrawEvent[]): void {
		if(drawQueue.length===0){return}
		if(drawQueue[0].finalized===true){return}
		if(drawQueue[0].queried===false){
			this.sendWsDrawQuery(drawQueue[0])
		}
		if(drawQueue[0].served===false){return}
		let event = drawQueue[0]
		event.finalized = true
		this.resolveDrawEvent(event)
		this.gameStateService.cleanAndNextDrawQueue()
	}
	private sendWsDrawQuery(event: DrawEvent){
		event.queried = true
		switch(event.resolveEventSubType){
			case('drawResult'):{
				this.rxStompService.publishDraw(event.drawCardNumber, event.waiterId, this.gameStateService.getClientStateDTO(), event.isCardProduction, undefined, event.firstCardProduction)
				break
			}
			case('researchPhaseResult'):{
				this.rxStompService.publishScanKeep({scan:event.drawCardNumber, keep: event.keepCardNumber??0}, event.waiterId, this.gameStateService.getClientStateDTO(), event.resolveEventSubType)
				break
			}
			case('scanKeepResult'):{
				this.rxStompService.publishScanKeep({scan:event.drawCardNumber, keep: event.keepCardNumber??0}, event.waiterId, this.gameStateService.getClientStateDTO(), event.resolveEventSubType, event.scanKeepOptions)
				break
			}
			case('drawResultThenDiscard'):{
				this.rxStompService.publishDraw(event.drawCardNumber, event.waiterId, this.gameStateService.getClientStateDTO(), event.isCardProduction, event.discardAfterDraw)
				break
			}
			default:{
				console.error('UNMAPED DRAW QUERY RESULT TYPE: ',event.resolveEventSubType)
			}
		}
	}
	private resolveDrawEvent(drawEvent: DrawEvent): void {
		let resultEvent!: EventBaseModel
		this.gameStateService.addCardSeenToClient(drawEvent.drawResultCardList.length)
		Logger.logEventResolution('resolving deck event: ',drawEvent.resolveEventSubType)
		switch(drawEvent.resolveEventSubType){
			case('drawResult'):{
				resultEvent = EventFactory.createGeneric(
					'drawResult',
					{
						drawEventResult:drawEvent.drawResultCardList,
						waiterId:drawEvent.waiterId,
						isCardProduction:drawEvent.isCardProduction
					}
				)
				break
			}
			case('researchPhaseResult'):{
				resultEvent = EventFactory.createCardSelector(
					'researchPhaseResult',
					{
						cardSelector:{
							selectFrom: this.projectCardInfoService.getProjectCardList(drawEvent.drawResultCardList),
							selectedList: [],
							selectionQuantity: drawEvent.keepCardNumber,
						},
						waiterId:drawEvent.waiterId
					}
				)
				break
			}
			case('scanKeepResult'):{
				if(drawEvent.keepCardNumber===undefined){break}
				resultEvent = EventFactory.createCardSelectorComplex(
					'scanKeepResult',
					{
						cardSelector:{
							selectFrom:this.projectCardInfoService.getProjectCardList(drawEvent.drawResultCardList),
							selectionQuantity: drawEvent.keepCardNumber,
						},
						scanKeepOptions:drawEvent.scanKeepOptions,
						waiterId:drawEvent.waiterId,
					}
				)
				break
			}
			case('drawResultThenDiscard'):{
				resultEvent = EventFactory.createGeneric(
					'drawResultThenDiscard',
					{
						drawEventResult:drawEvent.drawResultCardList,
						thenDiscard: drawEvent.discardAfterDraw,
						waiterId:drawEvent.waiterId
					}
				)
				break
			}
		}
		if(resultEvent===undefined){return}
		this.gameStateService.addEventQueue(resultEvent,'first')
	}
}

class PhaseResolveHandler {
	private currentUpgradedPhaseCards!: PhaseCardModel[]
	private clientPlayerId: myUUID = ''

	constructor(
		private gameStateService: GameStateFacadeService,
		private gameParam: GameParamService
	){

	}

	private getPhaseCards(): PhaseCardModel[] {
		return this.gameStateService.getClientPhaseCards(true)
	}
	private refreshCurrentUpgradedPhaseCard(): void {
		this.currentUpgradedPhaseCards = this.getPhaseCards()
	}
	private shouldReceivePhaseCardSelectionBonus(phaseResolved: SelectablePhaseEnum): boolean {
		return this.gameStateService.getClientCurrentSelectedPhase()===phaseResolved
	}
	resolveDevelopment(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let builderType: BuilderType = this.currentUpgradedPhaseCards[0].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.development)){
			builderType = 'developmentAbilityOnly'
		}
		this.gameStateService.addEventQueue(EventFactory.createCardBuilder('developmentPhaseBuilder',builderType),'second')
	}
	resolveConstruction(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let builderType: BuilderType = this.currentUpgradedPhaseCards[1].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.construction)){
			builderType = 'constructionAbilityOnly'
		}
		this.gameStateService.addEventQueue(EventFactory.createCardBuilder('constructionPhaseBuilder',builderType),'second')

		if(builderType==='construction_draw_card'){
			this.gameStateService.addEventQueue(EventFactory.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:1}}),'second')
		}
	}
	resolveProduction(event: EventPhase): void {
		this.refreshCurrentUpgradedPhaseCard()

		let clientState = this.gameStateService.getClientState()
		let production: RessourceStock[] = []
		let newEvents: EventBaseModel[] = []
		let currentClientRessources: RessourceInfo[] = clientState.getRessources()

		for(let i=0; i<currentClientRessources.length; i++){
			let ressourceGain: number = 0
			let ressource = currentClientRessources[i]
			switch(ressource.name){
				case('megacredit'):{
						ressourceGain= ressource.valueProd
						+ clientState.getTR()
						+ this.getProductionPhaseCardSelectionBonus()
					break
				}
				case('plant'):case('heat'):{
					ressourceGain = ressource.valueProd
					break
				}
			}
			if(ressourceGain>0){
				production.push({name:ressource.name, valueStock:ressourceGain})
			}
		}

		event.productionMegacreditFromPhaseCard = this.getProductionPhaseCardSelectionBonus()
		if(this.shouldApplyDoubleProduction(event)){
			newEvents.push(EventFactory.createCardSelector('doubleProduction'))
		}

		if(production.length>0){
			newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: production}))
			this.gameStateService.addEventQueue(newEvents, 'first')
		}
	}
	public getProductionPhaseCardSelectionBonus(): number {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.production)){return 0}

		let bonus: number = 0
		let productionPhaseCard = this.currentUpgradedPhaseCards[3]

		switch(productionPhaseCard.phaseType){
			case('production_base'):{bonus=4;break}
			case('production_7mc'):{bonus=7;break}
			case('production_1mc_activate_card'):{bonus=1;break}
		}

		return bonus
	}
	public shouldApplyDoubleProduction(event: EventPhase): boolean {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.production)){return false}
		return this.currentUpgradedPhaseCards[3].phaseType === 'production_1mc_activate_card'
	}
	resolveResearch(): void {
		this.refreshCurrentUpgradedPhaseCard()
		let baseScanKeep: ScanKeep = {scan:2,keep:1}
		let clientState = this.gameStateService.getClientState()
		let modScanKeep: ScanKeep = clientState.getResearch()
		let bonusScanKeep: ScanKeep = this.getResearchPhaseCardSelectionBonus()
		let totalScanKeep = {
			scan: baseScanKeep.scan + modScanKeep.scan + bonusScanKeep.scan,
			keep: baseScanKeep.keep + modScanKeep.keep + bonusScanKeep.keep,
		}
		this.gameStateService.addEventQueue(EventFactory.createDeckQueryEvent(
			'researchPhaseQuery',
			{scanKeep:totalScanKeep}
		),'first')

	}
	private getResearchPhaseCardSelectionBonus(): ScanKeep {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.research)){return {scan:0, keep:0}}

		let bonus: ScanKeep = {scan:0, keep:0}
		let researchPhaseCard = this.currentUpgradedPhaseCards[4]

		switch(researchPhaseCard.phaseType){
			case('research_base'):{bonus={scan:3, keep:1};break}
			case('research_scan6_keep1'):{bonus={scan:6, keep:1};break}
			case('research_scan2_keep2'):{bonus={scan:2, keep:2};break}
		}
		return bonus
	}
	resolveAction(): void {
		let activatorEvent = EventFactory.createCardActivator('actionPhaseActivator')
		this.refreshCurrentUpgradedPhaseCard()
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.action)){
			this.gameStateService.addEventQueue(activatorEvent,'first')
			return
		}

		let events: EventBaseModel[] = []
		let actionPhaseCard = this.currentUpgradedPhaseCards[2]
		switch(actionPhaseCard.phaseType){
			case('action_base'):{
				activatorEvent.doubleActivationMaxNumber = 1
				events.push(activatorEvent)
				break
			}
			case('action_scan_cards'):{
				activatorEvent.doubleActivationMaxNumber = 1
				activatorEvent.hasScan = true
				events.push(activatorEvent)
				break
			}
			case('action_repeat_two'):{
				activatorEvent.doubleActivationMaxNumber = 2
				events.push(activatorEvent)
				break
			}
		}
		this.gameStateService.addEventQueue(events,'first')
	}
}
