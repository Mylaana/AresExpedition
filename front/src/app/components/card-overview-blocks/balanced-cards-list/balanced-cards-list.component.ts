import { Component, Input, OnInit } from '@angular/core';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { CommonModule } from '@angular/common';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-balanced-cards-list',
  imports: [
    CommonModule,
    PlayableCardListComponent,
    FormsModule
],
  templateUrl: './balanced-cards-list.component.html',
  styleUrl: './balanced-cards-list.component.scss'
})
export class BalancedCardsListComponent implements OnInit {
	@Input() cardList!: PlayableCardModel[]

	_balancedCardPairList: PlayableCardModel[][] = []
	ngOnInit(): void {
		this.generateBalancedPairs()
	}
	generateBalancedPairs(){
		//this._balancedCardList = this.cardList.filter((el) => el.balancedVersion)
		for(let c of this.cardList){
			if(c.balancedVersion!='remove'){continue}
			console.log(c.getTitle(), c.cardCode)
			let pair: PlayableCardModel[] = []
			let cardCode = c.cardCode
			pair.push(c)
			let balanced = this.cardList.filter((el) => (
				el.balancedVersion==='add'
				&& el.cardCode===(cardCode + 'B')
			))
			if(balanced.length!=1){continue}
			pair.push(balanced[0])
			this._balancedCardPairList.push(pair)
		}
	}
}
