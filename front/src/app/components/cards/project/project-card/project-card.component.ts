import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { GlobalTagInfoService } from '../../../../services/global/global-tag-info.service';
import { TextWithImageComponent } from '../../../tools/text-with-image/text-with-image.component';
import { LayoutCardBackgroundHexagonsComponent } from '../../../tools/layouts/layout-card-background-hexagons/layout-card-background-hexagons.component';
import { CardCost } from '../../../../models/cards/card-cost.model';
import { BaseCardComponent } from '../../base/base-card/base-card.component';
import { deepCopy } from '../../../../functions/global.functions';
import { GameState } from '../../../../services/core-game/game-state.service';
import { ProjectCardState, RessourceState } from '../../../../interfaces/global.interface';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';


@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    TextWithImageComponent,
    LayoutCardBackgroundHexagonsComponent,
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  providers: [CardCost],
})
export class ProjectCardComponent extends BaseCardComponent implements OnInit {
	@Input() projectCard!: ProjectCardModel;
	clientPlayerId!: number
	ressourceState: RessourceState[] = []
	cardState!: ProjectCardState
	private readonly cardCost = inject(CardCost);

	readonly tagNumber = 3;

	constructor(
		private globalTagInfoService: GlobalTagInfoService,
		private gameStateService: GameState,
	){
		super();
	}

	override ngOnInit() {
		super.ngOnInit()
		this.projectCard.tagsUrl = []
		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.cardCost.initialize(this.projectCard.costInitial)

		this.projectCard.tagsId = this.fillTagId(this.projectCard.tagsId)
		// fills tagUrl
		for(let i = 0; i < this.projectCard.tagsId.length; i++) {
			this.projectCard.tagsUrl.push(this.globalTagInfoService.getTagUrlFromID(this.projectCard.tagsId[i]))
		}

		// subscribe to gameState
		this.gameStateService.currentGroupPlayerState.subscribe(
			state => this.updatePlayerState(state[this.clientPlayerId])
		)
		this.checkPlayable()
	}
	override resetCardState(): void {
		super.resetCardState()
		if(this.ressourceState.length===0){return}
		this.updateCost()
		this.checkPlayable()
	}

	fillTagId(tagsId:number[]): number[] {
		// ensures having 3 tags id in tagId
		// gets number array
		// returns number array
		var newTagsId = this.projectCard.tagsId.slice();
		for (let i = this.projectCard.tagsId.length; i < this.tagNumber; i++) {
		newTagsId.push(-1)
		}
		return newTagsId
	}
	cardClick(){
		if(this.state.selectable!=true){return}
		if(this.state.playable===false && this.state.ignoreCost!=true){return}
		this.state.selected = this.state.selected===false
		this.cardStateChange.emit({cardId:this.projectCard.id, state: this.state})
	}

	play(): void {
		console.log('Played: ', this.projectCard.title)
	}
	updatePlayerState(state: PlayerStateModel): void {
		this.updateRessourceState(state.ressource)
		this.updateCardState(state.cards)
		this.checkPlayable()
	}
	updateRessourceState(ressourceState: RessourceState[]):void{
		if(this.ressourceState===ressourceState){return}
		this.ressourceState = deepCopy(ressourceState)
	}
	updateCardState(cardState: ProjectCardState): void {
		if(!this.cardState===undefined && deepCopy(this.cardState)===deepCopy(cardState)){return}
		this.cardState=deepCopy(cardState)
		console.log(deepCopy(this.cardState))
		console.log(deepCopy(cardState))
		console.log('update card state: ', cardState, this.cardState)
		this.updateCost()
	}
	updateCost():void{
		this.projectCard.cost = this.cardCost.updateCost({
			tagList: this.projectCard.tagsId,
			steelState: this.ressourceState[3],
			titaniumState: this.ressourceState[4],
			playedTriggersList: this.cardState.playedTriggers
		})
	}

	checkPlayable(): void {
		this.state.playable = this.ressourceState[0].valueStock >= this.projectCard.cost
	}

	activate(activationCount: number): void {
		console.log('Activated: ', this.projectCard.title)
	}
}
