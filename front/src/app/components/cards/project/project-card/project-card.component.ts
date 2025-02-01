import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardModel, ProjectCardState } from '../../../../models/cards/project-card.model';
import { TextWithImageComponent } from '../../../tools/text-with-image/text-with-image.component';
import { LayoutCardBackgroundHexagonsComponent } from '../../../tools/layouts/layout-card-background-hexagons/layout-card-background-hexagons.component';
import { CardCost } from '../../../../models/cards/card-cost.model';
import { BaseCardComponent } from '../../base/base-card/base-card.component';
import { GameState } from '../../../../services/core-game/game-state.service';
import { RessourceInfo } from '../../../../interfaces/global.interface';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { Utils } from '../../../../utils/utils';
import { GlobalInfo } from '../../../../services/global/global-info.service';


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
	@Input() buildDiscount!: number
	clientPlayerId!: number
	ressourceState: RessourceInfo[] = []
	projectCardState!: ProjectCardState
	private readonly cardCost = inject(CardCost);

	readonly tagNumber = 3;

	constructor(
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
			this.projectCard.tagsUrl.push(GlobalInfo.getUrlFromID(this.projectCard.tagsId[i]))
		}

		// subscribe to gameState
		this.gameStateService.currentGroupPlayerState.subscribe(
			state => this.updatePlayerState(state)
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
		this.cardStateChange.emit({card:this.projectCard, state: this.state})
	}

	play(): void {
		console.log('Played: ', this.projectCard.title)
	}
	updatePlayerState(state: PlayerStateModel[]): void {
		if(state[this.clientPlayerId]===undefined){return}
		let playerState = state[this.clientPlayerId]
		this.updateRessourceState(playerState.getRessources())
		this.updateCardState(playerState.cards)
		this.checkPlayable()
	}
	updateRessourceState(ressourceState: RessourceInfo[]): void {
		if(this.ressourceState===ressourceState){return}
		this.ressourceState = Utils.jsonCopy(ressourceState)
	}
	updateCardState(cardState: ProjectCardState): void {
		if(!this.projectCardState===undefined &&  Utils.jsonCopy(this.projectCardState)===Utils.jsonCopy(cardState)){return}
		this.projectCardState=cardState
		this.updateCost()
	}
	public updateCost(): void {
		/*
		if(this.state.playable!=true){
			this.projectCard.cost=this.projectCard.costInitial
			return
		}*/
		this.projectCard.cost = this.cardCost.updateCost({
			tagList: this.projectCard.tagsId,
			steelState: this.ressourceState[3],
			titaniumState: this.ressourceState[4],
			playedTriggersList: this.projectCardState.getTriggerCostMod(),
			buildDiscount: this.buildDiscount
		})
		this.checkPlayable()
	}

	checkPlayable(): void {
		this.state.playable = this.ressourceState[0].valueStock >= this.projectCard.cost
	}

	activate(activationCount: number): void {
		console.log('Activated: ', this.projectCard.title)
	}
}
