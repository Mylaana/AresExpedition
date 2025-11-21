import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventPhase } from "../../../models/core-game/event.model";
import { EventFactory } from "../../../factory/event/event-factory";
import { SelectablePhaseEnum } from "../../../enum/phase.enum";
import { RessourceStock, RessourceInfo, ScanKeep } from "../../../interfaces/global.interface";
import { PhaseCardModel } from "../../../models/cards/phase-card.model";
import { BuilderType } from "../../../types/phase-card.type";
import { Logger } from "../../../utils/utils";
import { RessourceType } from "../../../types/global.type";
import { DeckQueryOptionsEnum } from "../../../enum/global.enum";

@Injectable()
export class EventPhaseHandler implements GameEventHandler<EventPhase> {

    constructor(
        private gameStateFacade: GameStateFacadeService,
    ){}

    supports(event: EventBaseModel): boolean {
        return event.type==='phase'
    }
    onSwitchEvent(event: EventPhase){
        if(event.autoFinalize===true){event.finalized=true}
        switch(event.subType){
            case('developmentPhase'):{this.resolveDevelopment();break}
            case('constructionPhase'):{this.resolveConstruction();break}
            case('actionPhase'):{this.resolveAction(); break}
            case('productionPhase'):{this.resolveProduction(event);
                break
            }
            case('researchPhase'):{this.resolveResearch();break}
            default:{return}
        }

    }
    onFinalizeEvent(event: EventPhase) {   
        Logger.logEventResolution('resolving event: ','finishEventPhase', event.subType)

        switch(event.subType){
            case('developmentPhase'):case('constructionPhase'):case('actionPhase'):case('researchPhase'):{
                break
            }
            case('productionPhase'):{
                event.finalized=true
                break
            }
            default:{Logger.logError('Non mapped event in handler.finishEventPhase: ', event)}
        }
    }
    private getPhaseCards(): PhaseCardModel[] {
		return this.gameStateFacade.getClientPhaseCards(true)
	}
	private shouldReceivePhaseCardSelectionBonus(phaseResolved: SelectablePhaseEnum): boolean {
		return this.gameStateFacade.getClientCurrentSelectedPhase()===phaseResolved
	}
	private resolveDevelopment(): void {
		let builderType: BuilderType = this.getPhaseCards()[0].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.development)){
			builderType = 'developmentAbilityOnly'
		}
		this.gameStateFacade.addEventQueue(EventFactory.createCardBuilder('developmentPhaseBuilder',builderType),'second')
	}
	private resolveConstruction(): void {
		let builderType: BuilderType = this.getPhaseCards()[1].phaseType as BuilderType
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.construction)){
			builderType = 'constructionAbilityOnly'
		}
		this.gameStateFacade.addEventQueue(EventFactory.createCardBuilder('constructionPhaseBuilder',builderType),'second')

		if(this.gameStateFacade.getPhaseBonusCollected(SelectablePhaseEnum.construction)===true){return}
		this.gameStateFacade.setPhaseBonusCollected(SelectablePhaseEnum.construction, true)
		if(builderType==='construction_draw_card'){
			this.gameStateFacade.addEventQueue(EventFactory.createDeckQueryEvent('drawQuery',{drawDiscard:{draw:1}}),'second')
		}
	}
	private resolveProduction(event: EventPhase): void {
		this.resolveBaseProduction(event)
		this.resolveSecondProduction(event)
	}
	private resolveBaseProduction(event: EventPhase){
		if(this.gameStateFacade.getPhaseBonusCollected(SelectablePhaseEnum.production)===true){return}
		this.gameStateFacade.setPhaseBonusCollected(SelectablePhaseEnum.production, true)


		let clientState = this.gameStateFacade.getClientState()
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
				case('card'):{
					ressourceGain = ressource.valueProd
					break
				}
			}
			if(ressourceGain>0){
				production.push({name:ressource.name, valueStock:ressourceGain})
			}
		}

		event.productionMegacreditFromPhaseCard = this.getProductionPhaseCardSelectionBonus()

		newEvents = this.generateProductionEvents(production)
		console.log(newEvents)
		if(newEvents.length===0){return}
		this.gameStateFacade.addEventQueue(newEvents, 'first')
	}
	private resolveSecondProduction(event: EventPhase){
		if(!this.shouldApplyDoubleProduction(event)){return}
		if(this.gameStateFacade.getPhaseBonusCollected('secondProduction')){return}
		this.gameStateFacade.setPhaseBonusCollected('secondProduction', true)
		
		let newEvents: EventBaseModel[] = []
		newEvents.push(EventFactory.createCardSelector('doubleProduction'))
		
		if(newEvents.length===0){return}
		this.gameStateFacade.addEventQueue(newEvents, 'first')
	}
	private generateProductionEvents(resources: RessourceStock[]): EventBaseModel[] {
		if(resources.length===0){return []}
		let newEvents: EventBaseModel[] = []
		let cardProduction: RessourceStock
		let production: RessourceStock[] = []
		let authorizedResourcesName: RessourceType[] = ['megacredit', 'plant', 'heat']

		cardProduction = resources.filter((el) => el.name==='card')[0]
		production = resources.filter((el) => authorizedResourcesName.includes(el.name))

		if(production.length>0){
			newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', {baseRessource: production}))
			this.gameStateFacade.addProductionResourcesObtainedThisRound(production)
		}
		if(cardProduction){
			newEvents.push(EventFactory.createDeckQueryEvent('drawQuery',
				{
					drawDiscard: {discard:0, draw:cardProduction.valueStock},
					isCardProduction: true
				}
			))
		}
		return newEvents
	}
	public getProductionPhaseCardSelectionBonus(): number {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.production)){return 0}

		let bonus: number = 0
		let productionPhaseCard = this.getPhaseCards()[3]

		switch(productionPhaseCard.phaseType){
			case('production_base'):{bonus=4;break}
			case('production_7mc'):{bonus=7;break}
			case('production_1mc_activate_card'):{bonus=1;break}
		}

		return bonus
	}
	private shouldApplyDoubleProduction(event: EventPhase): boolean {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.production)){return false}
		return this.getPhaseCards()[3].phaseType === 'production_1mc_activate_card'
	}
	private resolveResearch(): void {
		console.log('collected bonus research value on entering resolve research :',this.gameStateFacade.getPhaseBonusCollected(SelectablePhaseEnum.research))
		if(this.gameStateFacade.getPhaseBonusCollected(SelectablePhaseEnum.research)){return}
		this.gameStateFacade.setPhaseBonusCollected(SelectablePhaseEnum.research, true)

		let baseScanKeep: ScanKeep = {scan:2,keep:1}
		let clientState = this.gameStateFacade.getClientState()
		let modScanKeep: ScanKeep = clientState.getResearch()
		let bonusScanKeep: ScanKeep = this.getResearchPhaseCardSelectionBonus()
		let totalScanKeep = {
			scan: baseScanKeep.scan + modScanKeep.scan + bonusScanKeep.scan,
			keep: baseScanKeep.keep + modScanKeep.keep + bonusScanKeep.keep,
		}
		this.gameStateFacade.addEventQueue(EventFactory.createDeckQueryEvent(
			'researchPhaseQuery',
			{scanKeep:totalScanKeep}
		),'first')

	}
	private getResearchPhaseCardSelectionBonus(): ScanKeep {
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.research)){return {scan:0, keep:0}}

		let bonus: ScanKeep = {scan:0, keep:0}
		let researchPhaseCard = this.getPhaseCards()[4]

		switch(researchPhaseCard.phaseType){
			case('research_base'):{bonus={scan:3, keep:1};break}
			case('research_scan6_keep1'):{bonus={scan:6, keep:1};break}
			case('research_scan2_keep2'):{bonus={scan:2, keep:2};break}
		}
		return bonus
	}
	private resolveAction(): void {
		if(this.gameStateFacade.getPhaseBonusCollected(SelectablePhaseEnum.action)){return}
		this.gameStateFacade.setPhaseBonusCollected(SelectablePhaseEnum.action, true)
		console.log('collected bonus research value on entering resolve ACTION :',this.gameStateFacade.getPhaseBonusCollected(SelectablePhaseEnum.research))
		
		let activatorEvent = EventFactory.createCardActivator('actionPhaseActivator')
		if(!this.shouldReceivePhaseCardSelectionBonus(SelectablePhaseEnum.action)){
			this.gameStateFacade.addEventQueue(activatorEvent,'first')
			return
		}
		
		let events: EventBaseModel[] = []
		let actionPhaseCard = this.getPhaseCards()[2]
		console.log(actionPhaseCard)
		switch(actionPhaseCard.phaseType){
			case('action_base'):{
				activatorEvent.doubleActivationMaxNumber = 1
				events.push(activatorEvent)
				break
			}
			case('action_scan_cards'):{
				events.push(EventFactory.simple.scanKeep({scan:3, keep:1}, DeckQueryOptionsEnum.actionPhaseScan))
				
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
		this.gameStateFacade.addEventQueue(events,'first')
	}
}
