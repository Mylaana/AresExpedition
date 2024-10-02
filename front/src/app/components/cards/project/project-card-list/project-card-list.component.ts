import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { CardState } from '../../../../models/cards/card-cost.model';
import { CardSelector, ProjectFilter } from '../../../../interfaces/global.interface';
import { EventBaseModel, EventCardSelector, EventCardSelectorPlayZone } from '../../../../models/core-game/event.model';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';

@Component({
  selector: 'app-project-card-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent],
  templateUrl: './project-card-list.component.html',
  styleUrl: './project-card-list.component.scss'
})
export class ProjectCardListComponent implements OnChanges{
	@Input() event?: EventBaseModel;
	@Input() eventId?: number;
	@Input() playZoneId!: number; //this indicates whitch playZone this component should read
	@Input() cardList!: ProjectCardModel[] //takes display priority
	@Output() updateSelectedCardList: EventEmitter<number[]> = new EventEmitter<number[]>()
	
	cardSelector!: CardSelector
	displayedCards!: ProjectCardModel[];
	selectedCardList: number[] = [];
	loaded: boolean = false

	constructor(private cardInfoService: ProjectCardInfoService){}

	ngOnInit(){
		this.updateCardList()
		this.loaded = true
	}
	resetSelector(): void {
		this.cardSelector = {
			selectFrom: [],
			selectedIdList: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal'
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if(this.loaded===false){return}
		if (changes['event'] && changes['event'].currentValue) {
			console.log('update from event')
			this.updateCardList()
		}
		if (changes['eventId'] && changes['eventId'].currentValue) {
			console.log('update from eventId')
			this.updateCardList()
		}
		if (changes['playCardZone'] && changes['playCardZone'].currentValue) {
			console.log('update from zone')
			this.updateCardList()
		}
		if (changes['cardList'] && changes['cardList'].currentValue) {
			console.log('update from cardList')
			this.updateCardList()
		}
	}
	playCardZoneChange() : void {

	}

	filterCards(cards:ProjectCardModel[], filter: ProjectFilter | undefined): ProjectCardModel[] {
		if(filter === undefined){return cards}

		let result: ProjectCardModel[] = [];
		for(let card of cards){
			if(card.isFilterOk(filter)===true){
				result.push(card)
			}
		}

		return result
	}

	public cardStateChange(cardState: {cardId: number, state:CardState}): void {
		if(cardState.state.selected===true){
			this.selectedCardList.push(cardState.cardId)
		} else {
			//remove card from selected card list
			for(let i=0; i<this.selectedCardList.length; i++){
				if(this.selectedCardList[i]===cardState.cardId){
					this.selectedCardList.splice(i, 1)
					break
				}
			}
		}
		this.updateSelectedCardList.emit(this.selectedCardList)
	}
	getSelectorFromEvent(event: EventCardSelector): void {
		this.cardSelector = event.cardSelector
		console.log('selector from event: ',event)
	}
	getSelectorFromPlayZone(event: EventCardSelectorPlayZone): void {
		let selectedCardListId: number[] = []
		for(let card of event.playCardZone[this.playZoneId].cardList){
			selectedCardListId.push(card.id)
		}
		this.cardSelector.selectedIdList = selectedCardListId
		this.cardSelector.selectionQuantity = selectedCardListId.length
	}
	getSelectorFromCardList(): void {
		this.cardSelector = {
			selectFrom: this.cardList,
			selectedIdList: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal'
		}
	}
	getSelectorRouter(): void {
		this.resetSelector()
		//will set up project list variables by priority order
		if(this.cardList){
			this.getSelectorFromCardList()
			return
		}
		if(this.playZoneId!=undefined && this.event?.hasCardBuilder()===true){
			this.getSelectorFromPlayZone(this.event as EventCardSelectorPlayZone)
			return
		}
		if(this.event?.hasSelector()===true){
			this.getSelectorFromEvent(this.event as EventCardSelector)
			return
		}
		console.log('no update could be routed')
	}
	updateCardList(): void {
		this.getSelectorRouter()

		this.displayedCards = this.filterCards(
			this.cardSelector.selectFrom? this.cardSelector.selectFrom:[],
			this.cardSelector.filter
		)
		if(this.cardSelector.cardInitialState===undefined){this.cardSelector.cardInitialState={selected:false, selectable:false}}

		//this.selectedCardList = []
	}
}

