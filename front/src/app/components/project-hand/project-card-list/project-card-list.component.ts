import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../models/player-hand/project-card.model';
import { PhaseFilter } from '../../../types/phase-card.type';
import { CardOptions } from '../../../interfaces/global.interface';
import { CardState } from '../../../types/project-card.type';

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
	@Input() cardOptions?: CardOptions;
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
		switch(cardState.state){
			case('selected'): {
				this.selectedCardList.push(cardState.cardId)
				break
			};
			default: {
				//remove card from selected card list
				for(let i=0; i<this.selectedCardList.length; i++){
				if(this.selectedCardList[i]===cardState.cardId){
					this.selectedCardList.splice(i, 1)
					break
				}
				}
				break
			}
		}
		this.updateSelectedCardList.emit(this.selectedCardList)
	}

	resetCardList(): void {
		this.displayedCards = this.filterCards(this.cardList, this.cardsPhaseFilter)
		if(this.cardOptions===undefined){this.cardOptions = {}}
		if(this.cardOptions.initialState===undefined){this.cardOptions.initialState='default'}
		if(this.cardOptions.selectable===undefined){this.cardOptions.selectable=false}

		this.selectedCardList = []
	}
}

