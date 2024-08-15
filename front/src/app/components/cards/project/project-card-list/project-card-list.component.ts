import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { PhaseFilter } from '../../../../types/phase-card.type';
import { CardState } from '../../../../models/cards/card.model';

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
	@Input() cardsPhaseFilter!: PhaseFilter;
	@Input() cardList!:ProjectCardModel[];
	@Input() cardInitialState?: CardState;
	@Input() stateFromParent?: CardState;
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
	}

	filterCards(cards:ProjectCardModel[], filter: PhaseFilter): ProjectCardModel[] {
		if(filter === undefined){
		return cards
		}

		var result: ProjectCardModel[] = [];
		cards.forEach(element => {
			if((element.cardType === "greenProject" && filter === 'development')
				|| (element.cardType != "greenProject" && filter === 'construction')
				|| (element.cardSummaryType === 'action' && filter === 'action')
			){
				result.push(element)
			}
		});
		return result
	}

	public cardStateChange(cardState: {cardId: number, state:CardState}): void {
		console.log('cardstate received: ', cardState.state)
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
}

