import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck} from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { CardState } from '../../../../models/cards/card-cost.model';
import { CardSelector, ProjectFilter } from '../../../../interfaces/global.interface';
import { EventBaseModel, EventCardSelector, EventCardSelectorPlayZone } from '../../../../models/core-game/event.model';
import { ProjectCardInfoService } from '../../../../services/cards/project-card-info.service';
import { deepCopy } from '../../../../functions/global.functions';
import test from 'node:test';

@Component({
  selector: 'app-project-card-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent],
  templateUrl: './project-card-list.component.html',
  styleUrl: './project-card-list.component.scss'
})
export class ProjectCardListComponent implements OnChanges, DoCheck{
	@Input() event?: EventBaseModel;
	@Input() eventId?: number;
	@Input() playZoneId!: number; //this indicates whitch playZone this component should read
	@Input() cardList!: ProjectCardModel[] //takes display priority
	@Output() updateSelectedCardList: EventEmitter<ProjectCardModel[]> = new EventEmitter<ProjectCardModel[]>()
	@Input() cardListId!: string
	
	_eventId!: number | undefined
	cardSelector!: CardSelector
	displayedCards!: ProjectCardModel[] | undefined;
	selectedCardList: ProjectCardModel[] = [];
	loaded: boolean = false

	testState!: CardState | undefined

	constructor(private cardInfoService: ProjectCardInfoService){}

	ngOnInit(){
		this.updateCardList()
		this._eventId = this.eventId
		this.loaded = true
	}
	resetSelector(): void {
		this.cardSelector = {
			selectFrom: [],
			selectedList: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal'
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if(this.loaded===false){return}
		if (changes['event'] && changes['event'].currentValue) {
			this.updateCardList()
		}
		if (changes['eventId'] && changes['eventId'].currentValue) {
			this.updateCardList()
		}
		if (changes['playCardZone'] && changes['playCardZone'].currentValue) {
			this.updateCardList()
		}
		if (changes['cardList'] && changes['cardList'].currentValue) {
			this.updateCardList()
		}
	}
	ngDoCheck(): void {
		if(this.loaded===false){return}
		if(this.event?.hasSelector()){this.checkUpdateSelector(this.event as EventCardSelector)}
		if(this._eventId!=this.eventId){
			this.resetCardList()
			this.updateCardList()
			this.updateSelectedCardList.emit(this.selectedCardList)
		}
	}
	checkUpdateSelector(event: EventCardSelector){
		if(deepCopy(event.cardSelector)!=deepCopy(this.cardSelector)){
			this.updateCardList()
		}
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

	public cardStateChange(cardState: {card: ProjectCardModel, state:CardState}): void {

		if(cardState.state.selected===true){
			this.selectedCardList.push(cardState.card)
		} else {
			//remove card from selected card list
			for(let i=0; i<this.selectedCardList.length; i++){
				if(this.selectedCardList[i]===cardState.card){
					this.selectedCardList.splice(i, 1)
					break
				}
			}
		}
		this.updateSelectedCardList.emit(this.selectedCardList)
	}
	getSelectorFromEvent(event: EventCardSelector): void {
		this.cardSelector = event.cardSelector
	}
	getSelectorFromPlayZone(event: EventCardSelectorPlayZone): void {
		//will root the cards to selected id list, not to selectFrom
		let card = event.playCardZone[this.playZoneId].selectedCard
		if(card===undefined){
			this.cardSelector.selectedList
			this.cardSelector.selectionQuantity = 0
		} else {
			this.cardSelector.selectedList = [card]
			this.cardSelector.selectionQuantity = 1
		}
	}
	getSelectorFromCardList(): void {
		this.cardSelector = {
			selectFrom: this.cardList,
			selectedList: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
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
		if(this.event?.hasSelector()){
			this.resetCardList()
			this.getSelectorFromEvent(this.event as EventCardSelector)
			return
		}
	}
	updateCardList(): void {
		this.getSelectorRouter()

		if(this.playZoneId!=undefined){
			this.displayedCards = this.getDisplayFromSelected()
		} else {
			this.displayedCards = this.getDisplayFromSelectable()
		}
		
		if(this.displayedCards.length===0){this.displayedCards=undefined}
		if(this.cardSelector.cardInitialState===undefined){this.cardSelector.cardInitialState={selected:false, selectable:false}}
	}
	getDisplayFromSelectable(): ProjectCardModel[] {
		return this.filterCards(
			this.cardSelector.selectFrom? this.cardSelector.selectFrom:[],
			this.cardSelector.filter
		)
	}
	getDisplayFromSelected(): ProjectCardModel[] {
		return this.cardSelector.selectedList
	}
	resetCardList(): void {
		this.selectedCardList = []
	}
}

