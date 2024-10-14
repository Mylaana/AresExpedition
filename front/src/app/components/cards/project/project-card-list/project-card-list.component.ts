import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck, ViewChildren, QueryList} from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { CardState } from '../../../../models/cards/card-cost.model';
import { CardSelector, ProjectFilter } from '../../../../interfaces/global.interface';
import { EventBaseModel, EventCardSelector, EventCardBuilder } from '../../../../models/core-game/event.model';
import { deepCopy } from '../../../../functions/global.functions';

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
	playedCardList!: ProjectCardModel[] //takes display priority
	@Output() updateSelectedCardList: EventEmitter<ProjectCardModel[]> = new EventEmitter<ProjectCardModel[]>()
	@Input() cardListId!: string
	@ViewChildren('projectCardComponent') projectCards!: QueryList<ProjectCardComponent>
	
	private _cardList!: ProjectCardModel[] | undefined
	private _eventId!: number | undefined
	cardSelector!: CardSelector
	displayedCards!: ProjectCardModel[] | undefined;
	private selectedCardList: ProjectCardModel[] = [];
	private loaded: boolean = false

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
		if (changes['CardBuilder'] && changes['CardBuilder'].currentValue) {
			this.updateCardList()
		}
		if (changes['cardList'] && changes['cardList'].currentValue) {
			this.updateCardList()
		}
		if (changes['playedCardList'] && changes['playedCardList'].currentValue) {
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

	public cardStateChange(cardChange: {card: ProjectCardModel, state:CardState}): void {
		this.resetCardList()
		for(let card of this.projectCards){
			if(card.state?.selected!=undefined && card.state.selected===true){
				this.selectedCardList.push(card.projectCard)
			}
		}
		this.updateSelectedCardList.emit(this.selectedCardList)
	}
	setSelectorFromPlayedCardList(): void {
		this.cardSelector = {
			selectFrom: [],
			selectedList: this.playedCardList,
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
		}
	}
	setSelectorFromEvent(event: EventCardSelector): void {
		this.cardSelector = event.cardSelector
	}
	setSelectorFromPlayZone(event: EventCardBuilder): void {
		//will root the cards to selected id list, not to selectFrom
		let card = event.CardBuilder[this.playZoneId].selectedCard
		if(card===undefined){
			this.cardSelector.selectedList
			this.cardSelector.selectionQuantity = 0
		} else {
			this.cardSelector.selectedList = [card]
			this.cardSelector.selectionQuantity = 1
		}
	}
	setSelectorFromCardList(): void {
		this._cardList = this.cardList
		this.cardSelector = {
			selectFrom: this.cardList,
			selectedList: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
		}
	}
	setSelector(): void {
		this.resetSelector()
		//will set up project list variables by priority order
		if(this.playedCardList){
			this.setSelectorFromPlayedCardList()
			return
		}
		if(this.cardList){
			this.setSelectorFromCardList()
			return
		}
		if(this.playZoneId!=undefined && this.event?.hasCardBuilder()===true){
			this.setSelectorFromPlayZone(this.event as EventCardBuilder)
			return
		}
		if(this.event?.hasSelector()){
			this.resetCardList()
			this.setSelectorFromEvent(this.event as EventCardSelector)
			return
		}
	}
	setDisplay(): void {
		if(this.playedCardList!=undefined){
			this.displayedCards = this.getDisplayFromPlayed()
			return
		}
		if(this.playZoneId!=undefined){
			this.displayedCards = this.getDisplayFromSelected()
			return
		} 
		this.displayedCards = this.getDisplayFromSelectable()
	}
	updateCardList(): void {
		this.setSelector()
		this.setDisplay()
		
		if(this.displayedCards!=undefined && this.displayedCards.length===0){this.displayedCards=undefined}
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
	getDisplayFromPlayed(): ProjectCardModel[] {
		return this.playedCardList
	}
	resetCardList(): void {
		this.selectedCardList = []
	}
	updatePlayedCardList(cardList: ProjectCardModel[]): void {
		this.playedCardList = cardList
		this.updateCardList()
	}
}

