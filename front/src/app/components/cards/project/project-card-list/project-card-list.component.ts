import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck, ViewChildren, QueryList} from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { CardSelector, ProjectFilter } from '../../../../interfaces/global.interface';
import { EventBaseModel, EventCardSelector, EventCardBuilder } from '../../../../models/core-game/event.model';
import { Utils } from '../../../../utils/utils';
import { CardState } from '../../../../interfaces/card.interface';
import { NonSelectablePhaseEnum } from '../../../../enum/phase.enum';

type ListType = 'hand' | 'played' | 'selector' | 'builderSelector' | 'none'

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
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Input() background?: any = ''
	@Input() listType?: ListType = 'none'
	@Input() hovered!: boolean

	playedCardList!: ProjectCardModel[] //takes display priority
	@Output() updateSelectedCardList: EventEmitter<ProjectCardModel[]> = new EventEmitter<ProjectCardModel[]>()
	@Input() cardListId!: string
	@ViewChildren('projectCardComponent') projectCards!: QueryList<ProjectCardComponent>

	_buildDiscount!: number
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
		this.setBackground()
	}
	setBackground(): void{
		switch(this.listType){
			case('builderSelector'):{
				this.background = (this.currentPhase).toLowerCase()
				break
			}
			default:{
				this.background = this.listType
			}
		}
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
		if (changes['listType'] && changes['listType'].currentValue) {
			this.setBackground()
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
	checkUpdateSelector(event: EventCardSelector): void {
		if(Utils.jsonCopy(event.cardSelector)!=Utils.jsonCopy(this.cardSelector)){
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
			if(card.state.isSelected()===true){
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
		let card = event.cardBuilder[this.playZoneId].getSelectedCard()
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
		if(this.event?.hasCardBuilder()){this.setDiscount(this.event as EventCardBuilder)}

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
	setDiscount(event: EventCardBuilder): void {
		if(!this.loaded){return}
		this._buildDiscount = event.buildDiscountValue

		this.childrenUpdateCost()
	}
	public updateDiscount(event: EventCardBuilder): void {
		this.setDiscount(event)

	}
	childrenUpdateCost(): void {
		if(this.projectCards===undefined){return}

		for(let card of this.projectCards){
			card.updateCost()
		}
	}
	updateCardList(): void {
		this.setSelector()
		this.setDisplay()

		if(this.displayedCards!=undefined && this.displayedCards.length===0){this.displayedCards=undefined}
		if(this.cardSelector.cardInitialState===undefined){
			this.cardSelector.cardInitialState= Utils.toFullCardState({selected:false, selectable:false})
		}
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
	updatePlayedCardList(cardList: ProjectCardModel[] | undefined): void {
		console.log('update played card list called', cardList)
		return
		//this.playedCardList = cardList
		this.updateCardList()
	}
}

