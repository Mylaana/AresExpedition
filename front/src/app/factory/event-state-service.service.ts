import { Injectable } from "@angular/core";
import { EventStateAddProduction, EventStateAddRessourceToPlayer, EventStateBuilderContentDTO, EventStateCardProduction, EventStateContentDiscardDTO, EventStateContentDrawQueryDTO, EventStateContentDrawResultDTO, EventStateContentDTO, EventStateContentOceanFlippedDTO, EventStateContentResearchCardsQueriedDTO, EventStateContentScanKeepQueriedDTO, EventStateContentScanKeepUnqueriedDTO, EventStateContentTargetCardDTO, EventStateDTO, EventStateIncreaseResearchScanKeep, EventStateUpgradePhase } from "../interfaces/event-state.interface";
import { EventStateOriginEnum, EventStateTypeEnum } from "../enum/eventstate.enum";
import { EventBaseModel, EventCardActivator, EventCardBuilder } from "../models/core-game/event.model";
import { OceanBonus } from "../interfaces/global.interface";
import { EventFactory } from "./event factory/event-factory";
import { ProjectCardInfoService } from "../services/cards/project-card-info.service";
import { PlayableCardModel } from "../models/cards/project-card.model";
import { GameState } from "../services/core-game/game-state.service";
import { PlayerStateModel } from "../models/player-info/player-state.model";

function shouldLoadEvent(event: EventBaseModel, eventState: EventStateDTO) : boolean {
	switch(true){
		case(event.subType==='actionPhaseActivator' && eventState.t===EventStateTypeEnum.cardActivator):{break}
		case(event.subType==='developmentPhaseBuilder'  && eventState.t===EventStateTypeEnum.builderDevelopemntLocked):{break}
		case(event.subType==='constructionPhaseBuilder'  && eventState.t===EventStateTypeEnum.builderConstructionLocked):{break}
		case(event.subType==='productionPhase' && eventState.t===EventStateTypeEnum.productionCards):{break}
		default:{return false}
	}
	return true
}

function toContentDto<T>(json: any): T {
  return json as T;
}

@Injectable({
	providedIn: 'root'
})
export class EventStateService{
	constructor(private projectCardInfoService: ProjectCardInfoService){}
	public shouldLoadEvent(event: EventBaseModel, eventState: EventStateDTO) : boolean {
		return shouldLoadEvent(event,eventState)
	}
	public loadFromJson(event: EventBaseModel, dto: EventStateDTO, clientState: PlayerStateModel) {
		switch(dto.t){
			case(EventStateTypeEnum.builderConstructionLocked):case(EventStateTypeEnum.builderDevelopemntLocked):{
				let content = toContentDto<EventStateBuilderContentDTO>(dto.v);
				let eventBuilder: EventCardBuilder = event as EventCardBuilder
				for(let i=0; i<content.s.length; i++){
					if(content.s[i]){
						let cardCode = content.s[i].cc
						if(cardCode){
							let card = this.projectCardInfoService.getCardById(cardCode)
							card?eventBuilder.cardBuilder[i].setSelectedCard(card):null
						}
						eventBuilder.cardBuilder[i].setBSuilderIsLocked(content.s[i].l)
					}
				}
				break
			}
			case(EventStateTypeEnum.cardActivator):{
				let eventActivator: EventCardActivator = event as EventCardActivator
				eventActivator.activationLog = dto.v
				clientState.loadEventStateActivator(dto)
				break
			}
			default:{
				console.error('UNTREATED LOAD EVENTSTATE: ', event, dto)
			}
		}
	}
	public createFromJson(eventStateList: EventStateDTO[]): EventBaseModel[] {
		let newEvents: EventBaseModel[] = []
		let treated: boolean

		//loops backwards to preserve saved order of events
		for (let i = eventStateList.length - 1; i >= 0; i--) {
			let state = eventStateList[i]
			treated = true
			switch (state.t){
				case(EventStateTypeEnum.oceanFlipped):{
					newEvents = newEvents.concat(this.createEventOceanFlipped(state.v as EventStateContentOceanFlippedDTO))
					break
				}
				case(EventStateTypeEnum.drawCards):{
					let content: EventStateContentDrawResultDTO =  {
						cl: state.v
					}
					newEvents.push(EventFactory.createGeneric('drawResult', {drawEventResult:content.cl}))
					break
				}
				case(EventStateTypeEnum.discard):{
					let content: EventStateContentDiscardDTO =  {
						d: state.v
					}
					newEvents.push(EventFactory.simple.discard(content.d))
					break
				}
				case(EventStateTypeEnum.researchCardsQueried):{
					let content = state.v as EventStateContentResearchCardsQueriedDTO
					newEvents.push(EventFactory.createCardSelector('researchPhaseResult', {cardSelector:{
						selectFrom: this.projectCardInfoService.getProjectCardList(content.cards),
						selectionQuantity: content.keep
					}}))
					break
				}
				case(EventStateTypeEnum.scanKeepQueried):{
					let content = state.v as EventStateContentScanKeepQueriedDTO
					newEvents.push(EventFactory.simple.scanKeepResult(
						this.projectCardInfoService.getProjectCardList(content.cards),
						content.keep,
						content.options))
					break
				}
				case(EventStateTypeEnum.scanKeepUnQueried):{
					let content = state.v as EventStateContentScanKeepUnqueriedDTO
					newEvents.push(EventFactory.createDeckQueryEvent('scanKeepQuery', {
						scanKeep: content.scanKeep,
						scanKeepOptions: content.options
					}))
					break
				}
				case(EventStateTypeEnum.targetCardAddRessource):{
					let content = state.v as EventStateContentTargetCardDTO
					newEvents.push(EventFactory.createTargetCard('addRessourceToCardId',
						content.cardId,
						{advancedRessource: content.ressources}
					))
					break
				}
				case(EventStateTypeEnum.specialBuilder):{
					let content = state.v as EventStateBuilderContentDTO
					let event = EventFactory.simple.specialBuilder(content.o) as EventCardBuilder
					for(let i=0; i<content.s.length; i++){
						let cardCode = content.s[i].cc
						if(cardCode){
							event.cardBuilder[i].setSelectedCard(this.projectCardInfoService.getCardById(cardCode)??new PlayableCardModel)
							event.cardBuilder[i].setBSuilderIsLocked(content.s[i].l)
						}
					}
					newEvents.push(event)
					break
				}
				case(EventStateTypeEnum.drawCardsUnqueried):{
					let content = state.v as EventStateContentDrawQueryDTO
					newEvents.push(EventFactory.simple.draw(content.d))
					break
				}
				case(EventStateTypeEnum.addProduction):{
					let content = state.v as EventStateAddProduction
					newEvents.push(EventFactory.simple.addProduction(content.p))
					break
				}
				case(EventStateTypeEnum.increaseResearchScanKeep):{
					let content = state.v as EventStateIncreaseResearchScanKeep
					newEvents.push(EventFactory.simple.increaseResearchScanKeep(content.s))
					break
				}
				case(EventStateTypeEnum.productionCards):{
					let content: EventStateCardProduction = {
						cl:state.v
					}
					newEvents.push(EventFactory.createGeneric('loadProductionPhaseCards', {loadProductionCardList: content.cl}))
					break
				}
				case(EventStateTypeEnum.upgradePhase):{
					let content: EventStateUpgradePhase = {
						u: state.v['u'],
						l: state.v['l']??undefined
					}
					newEvents.push(EventFactory.simple.upgradePhaseCard(content.u, content.l))
					break
				}
				case(EventStateTypeEnum.addRessourceToPlayer):{
					let content: EventStateAddRessourceToPlayer = {
						r: state.v['r']
					}
					newEvents.push(EventFactory.simple.addRessource(content.r))
					break
				}
				default:{treated = false}
			}
			if(treated){eventStateList.splice(i, 1)}
		}
		for(let e of eventStateList.filter((el) => el.o===EventStateOriginEnum.create)){
			console.error('UNTREATED CREATE EVENTSTATE: ', e)
		}
		return newEvents
	}
	private createEventOceanFlipped(content: EventStateContentOceanFlippedDTO): EventBaseModel[] {
		let newEvents: EventBaseModel[] = []
		let oceanBonus: OceanBonus = {
			megacredit: 0,
			plant: 0,
			card: 0
		}
		if (content.MEGACREDIT) {
			newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', { baseRessource: { name: 'megacredit', valueStock: content.MEGACREDIT?? 0 } }))
			oceanBonus.megacredit = content.MEGACREDIT??0
		}
		if (content.PLANT) {
			newEvents.push(EventFactory.createGeneric('addRessourceToPlayer', { baseRessource: { name: 'plant', valueStock: content.PLANT?? 0 } }))
			oceanBonus.plant = content.PLANT??0
		}
		if (content.CARD) {
			oceanBonus.card = content.CARD??0
		}
		return newEvents
		/*
		clientState.addOceanFlippedBonus(oceanBonus)
		eventStateList.splice(i, 1)
		*/
	}
}
