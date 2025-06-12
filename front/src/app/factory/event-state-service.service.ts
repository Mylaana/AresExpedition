import { Injectable } from "@angular/core";
import { EventStateBuilderContentDTO, EventStateContentDiscardDTO, EventStateContentDrawQueryDTO, EventStateContentDrawResultDTO, EventStateContentDTO, EventStateContentOceanFlippedDTO, EventStateContentResearchCardsQueriedDTO, EventStateContentScanKeepQueriedDTO, EventStateContentScanKeepUnqueriedDTO, EventStateContentTargetCardDTO, EventStateDTO } from "../interfaces/event-state.interface";
import { EventStateTypeEnum } from "../enum/eventstate.enum";
import { EventBaseModel, EventCardBuilder } from "../models/core-game/event.model";
import { OceanBonus } from "../interfaces/global.interface";
import { EventFactory } from "./event factory/event-factory";
import { ProjectCardInfoService } from "../services/cards/project-card-info.service";
import { PlayableCardModel } from "../models/cards/project-card.model";

		/*
	override fromJson(dto: EventStateDTO): void {
		this.activationLog = dto.v??{}
	}

	if(EventSerializer.shouldLoadEventFromThisSavedState(event, eventState)){
					console.log('loading eventState:',eventState, event)
					//specific cases
					switch(true){
						case(event.type==='cardActivator'):{
							clientState.loadEventStateActivator(eventState)
							break
						}
						case(event.subType==='productionPhase'):{
							let productionEvent = event as EventPhase
							let cardList = this.projectCardService.getProjectCardList(eventState.v)
							productionEvent.productionCardList = cardList
							if(eventState.v){
								clientState.addCardsToHand(eventState.v)
								this.addCardsToClientHand(eventState.v)
							}
						}
					}

					//generic cases applied from event function
					event.fromJson(eventState)
					eventStates = eventStates.filter((ele) => ele!==eventState)
					break
				}

	return event
}
*/
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
	constructor(private projectCardInfoService: ProjectCardInfoService){
	}
	public shouldLoadEvent(event: EventBaseModel, eventState: EventStateDTO) : boolean {
		return shouldLoadEvent(event,eventState)
	}
	public loadFromJson(event: EventBaseModel, dto: EventStateDTO) {
		switch(dto.t){
			case(EventStateTypeEnum.builderConstructionLocked):{
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
			}
		}
	}
	public createFromJson(eventStateList: EventStateDTO[]): EventBaseModel[] {
		let newEvents: EventBaseModel[] = []
		let treated: boolean

		console.log(eventStateList)
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
				default:{treated = false}
			}
			if(treated){eventStateList.splice(i, 1)}
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
