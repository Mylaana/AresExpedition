import { Component, Input, OnInit, Output, inject, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { TextWithImageComponent } from '../../../tools/text-with-image/text-with-image.component';
import { LayoutCardBackgroundHexagonsComponent } from '../../../tools/layouts/layout-card-background-hexagons/layout-card-background-hexagons.component';
import { CardCost } from '../../../../models/cards/card-cost.model';
import { BaseCardComponent } from '../../base/base-card/base-card.component';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { GlobalInfo } from '../../../../services/global/global-info.service';
import { ProjectListSubType, ProjectListType } from '../../../../types/project-card.type';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { ButtonDesigner } from '../../../../services/designers/button-designer.service';
import { ProjectCardActivatedEffectService } from '../../../../services/cards/project-card-activated-effect.service';
import { expandCollapseVertical } from '../../../../animations/animations';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    TextWithImageComponent,
    LayoutCardBackgroundHexagonsComponent,
	NonEventButtonComponent
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  providers: [CardCost],
  animations: [expandCollapseVertical]
})
export class ProjectCardComponent extends BaseCardComponent implements OnInit, OnDestroy {
	@Output() cardActivated: EventEmitter<{card: ProjectCardModel, twice: boolean}> = new EventEmitter<{card: ProjectCardModel, twice: boolean}>()
	@Input() projectCard!: ProjectCardModel;
	@Input() buildDiscount: number = 0
	@Input() parentListType: ProjectListType = 'none'
	@Input() parentListSubType: ProjectListSubType = 'none'
	@Input() activableTwice: boolean = false
	private megacreditAvailable: number = 0
	private readonly cardCost = inject(CardCost);
	readonly tagNumber = 3;

	_hovered: boolean = false
	_activateOnce = ButtonDesigner.createNonEventButton('activateProjectOnce')
	_activateTwice = ButtonDesigner.createNonEventButton('activateProjectTwice')
	//_activated: number = 0
	_maximumActivation: boolean = false

	private destroy$ = new Subject<void>()

	constructor(
		private gameStateService: GameState,
	){
		super();
	}

	override ngOnInit() {
		super.ngOnInit()
		this.projectCard.tagsUrl = []
		this.cardCost.initialize(this.projectCard.costInitial)

		this.projectCard.tagsId = this.fillTagId(this.projectCard.tagsId)
		// fills tagUrl
		for(let i = 0; i < this.projectCard.tagsId.length; i++) {
			this.projectCard.tagsUrl.push(GlobalInfo.getUrlFromID(this.projectCard.tagsId[i]))
		}

		// subscribe to gameState
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateClientState(state))
		this.checkPlayable()
		this.checkMaximumActivation()

		if(this.state.isActivable()){
			this.updateActivationButtonsState()
		}
		this._loaded = true
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	resetCardState(): void {
		if(this.megacreditAvailable===0){return}
		this.updateCost()
		this.checkPlayable()
	}

	private fillTagId(tagsId:number[]): number[] {
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
		if(this.state.isSelectable()!=true){return}
		if(this.state.isBuildable()===false && this.state.isIgnoreCost()!=true){return}
		this.state.setSelected(this.state.isSelected()===false)
		this.cardStateChange.emit({card:this.projectCard, state: this.state})
	}
	private updateClientState(state: PlayerStateModel): void {
		if(state===undefined){return}
		this.megacreditAvailable = state.getRessourceInfoFromType('megacredit')?.valueStock??0
		this.updateCost(state)
	}
	public updateCost(state?: PlayerStateModel): void {
		if(!state){
			this.projectCard.cost = this.projectCard.costInitial
			return
		}
		this.projectCard.cost = this.cardCost.updateCost({
			tagList: this.projectCard.tagsId,
			steelState: state.getRessourceInfoFromType('steel'),
			titaniumState: state.getRessourceInfoFromType('titanium'),
			playedTriggersList: state.getTriggerCostMod(),
			buildDiscount: this.buildDiscount
		})
		this.checkPlayable()
	}
	checkPlayable(): void {
		this.state.setBuildable(this.megacreditAvailable >= this.projectCard.cost)
	}
	public onActivate(): void {
		this.projectCard.activated += 1

		this.updateActivationButtonsState()
		this.checkMaximumActivation()

		this.cardActivated.emit({card: this.projectCard, twice: this.projectCard.activated>1})
	}
	private updateActivationButtonsState(): void {
		let payable = ProjectCardActivatedEffectService.isActivationCostPayable(this.projectCard, this.gameStateService.getPlayerStateFromId(this.gameStateService.clientPlayerId))
		this._activateOnce.updateEnabled(this.projectCard.activated<1 && payable)
		this._activateTwice.updateEnabled(this.projectCard.activated===1 && this.activableTwice && payable)
	}
	private checkMaximumActivation(): void {
		this._maximumActivation = (this.projectCard.activated>1) || (this.projectCard.activated>=1 && this.activableTwice === false)
	}
}
