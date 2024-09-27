import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { CardState } from '../../../../models/cards/card-cost.model';
import { ProjectFilter } from '../../../../interfaces/global.interface';
import { AdvancedRessourceType } from '../../../../types/global.type';

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
	@Input() cardsPhaseFilter?: ProjectFilter;
	@Input() cardList!:ProjectCardModel[];
	@Input() cardInitialState?: CardState;
	@Input() stateFromParent?: CardState;
	@Input() eventId?: number;
	@Output() updateSelectedCardList: EventEmitter<number[]> = new EventEmitter<number[]>()
	projectHand!: ProjectCardModel[];
	displayedCards!: ProjectCardModel[];
	selectedCardList: number[] = [];

	ngOnInit(){
		this.resetCardList()
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['cardList'] && changes['cardList'].currentValue) {
			this.resetCardList()
		}
		if (changes['eventId'] && changes['eventId'].currentValue) {
			this.eventIdChange()
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

	resetCardList(): void {
		this.displayedCards = this.filterCards(this.cardList, this.cardsPhaseFilter)
		if(this.cardInitialState===undefined){this.cardInitialState = {selected:false, selectable:false}}

		this.selectedCardList = []
	}
	eventIdChange(): void {
		this.resetCardList()
	}
}

