import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NonSelectablePhaseEnum } from '../../../../enum/phase.enum';
import { CardState } from '../../../../interfaces/card.interface';
import { CardSelector } from '../../../../interfaces/global.interface';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { EventBaseModel, EventCardBuilder, EventCardSelector } from '../../../../models/core-game/event.model';
import { Utils } from '../../../../utils/utils';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectListType } from '../../../../types/project-card.type';

const selectorTypes: ProjectListType[] = ['selector', 'playedSelector', 'builderSelector']

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
	@Input() cardList!: ProjectCardModel[]
	@Input() listType: ProjectListType = 'none'
	@Input() selectedDiscount: number = 0

	//display related inputs
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Input() background?: any = ''
	@Input() hovered!: boolean

	@Output() updateSelectedCardList: EventEmitter<{selected: ProjectCardModel[], listType: ProjectListType}> = new EventEmitter<{selected: ProjectCardModel[], listType: ProjectListType}>()
	@ViewChildren('projectCardComponent') projectCards!: QueryList<ProjectCardComponent>

	_buildDiscount: number = 0
	_cardSelector!: CardSelector
	_displayedCards!: ProjectCardModel[] | undefined;
	private _selectedCardList: ProjectCardModel[] = [];

	ngOnInit(){
		this.resetSelector()
		this.updateCardList()
		this.setBackground()
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes['event'] && changes['event'].currentValue) {this.updateCardList(); return}
		if (changes['eventId'] && changes['eventId'].currentValue) {this.updateCardList(); return}
		if (changes['cardList'] && changes['cardList'].currentValue) {
			this.updateCardList()
			return
		}
	}
	private setBackground(): void{
		switch(this.listType){
			case('builderSelector'):{this.background = (this.currentPhase).toLowerCase(); break}
			default:{this.background = this.listType}
		}
	}
	private resetSelector(): void {
		this._cardSelector = {
			selectFrom: [],
			selectedList: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
			cardInitialState: Utils.toFullCardState({selected:false, selectable:false}),
			stateFromParent : Utils.toFullCardState({selected:false, selectable:false})
		}
	}
	public cardStateChange(cardChange: {card: ProjectCardModel, state:CardState}): void {
		this.resetSelectedCardList()
		for(let card of this.projectCards){
			if(card.state.isSelected()===true){
				this._selectedCardList.push(card.projectCard)
			}
		}
		this.updateSelectedCardList.emit({selected:this._selectedCardList, listType: this.listType})
	}
	private setSelector(): void {
		this.resetSelector()
		if(selectorTypes.includes(this.listType)){
			this.setSelectorFromEvent(this.event as EventCardSelector)
		}
	}
	private setSelectorFromEvent(event: EventCardSelector): void {
		this._cardSelector = event.cardSelector
	}
	private setDisplay(): void {
		switch(this.listType){
			case('builderSelector'):{
				this.applyDiscount(this.event as EventCardBuilder)
				this._displayedCards = this._cardSelector.selectFrom
				break
			}
			case('builderSelectedZone'):{
				this.applyDiscount()
				this._displayedCards = this.cardList
				break
			}
			case('selector'):case('playedSelector'):{
				this._displayedCards = this._cardSelector.selectFrom
				break
			}
			default:{
				this._displayedCards = this.cardList
			}
		}
	}
	private applyDiscount(event?: EventCardBuilder): void {
		this._buildDiscount = event?.buildDiscountValue??0 + this.selectedDiscount??0
		this.childrenUpdateCost()
	}
	private childrenUpdateCost(): void {
		if(this.projectCards===undefined){return}
		for(let card of this.projectCards){
			card.updateCost()
		}
	}
	public updateDiscount(event: EventCardBuilder): void {
		this.applyDiscount(event)
	}
	private updateCardList(): void {
		if(selectorTypes.includes(this.listType)){this.setSelector()}
		this.setDisplay()

		if(this._displayedCards!=undefined && this._displayedCards.length===0){this._displayedCards=undefined}
	}
	private resetSelectedCardList(): void {
		this._selectedCardList = []
	}

}

