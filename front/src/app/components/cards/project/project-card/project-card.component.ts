import { Component, Input, OnInit, Output, inject, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardModel } from '../../../../models/cards/project-card.model';
import { CardBackgroundComponent } from '../card-blocks/card-background/card-background.component';
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
import { CardActivationComponent } from '../card-blocks/card-activation/card-activation.component';
import { CardCostComponent } from '../card-blocks/card-cost/card-cost.component';
import { CardEffectComponent } from '../card-blocks/card-effect/card-effect.component';
import { CardHighlightComponent } from '../card-blocks/card-highlight/card-highlight.component';
import { CardTagsComponent } from '../card-blocks/card-tags/card-tags.component';
import { CardVpComponent } from '../card-blocks/card-vp/card-vp.component';
import { CardPlayedInfoComponent } from '../card-blocks/card-played/card-played-info.component';
import { CardPrerequisiteComponent } from '../card-blocks/card-prerequisite/card-prerequisite.component';
import { CardStockComponent } from '../card-blocks/card-stock/card-stock.component';
import { CardTagsZoneComponent } from '../card-blocks/card-tags-background/card-tags-zone.component';


@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    CardBackgroundComponent,
	CardActivationComponent,
	CardCostComponent,
	CardEffectComponent,
	CardHighlightComponent,
	CardTagsComponent,
	CardVpComponent,
	CardPlayedInfoComponent,
	CardPrerequisiteComponent,
	CardStockComponent,
	CardTagsZoneComponent
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
	_maximumActivation: boolean = false
	_buttonIndexEnabled: number = 0

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
	public onActivation(twice: boolean): void {
		this.projectCard.activated += 1

		this.updateActivationButtonsState()
		this.checkMaximumActivation()

		this.cardActivated.emit({card: this.projectCard, twice: this.projectCard.activated>1})
	}
	private updateActivationButtonsState(): void {
		if(!ProjectCardActivatedEffectService.isActivationCostPayable(this.projectCard, this.gameStateService.getClientState())){
			this._buttonIndexEnabled = 0
		}

	}
	private checkMaximumActivation(): void {
		this._maximumActivation = (this.projectCard.activated>1) || (this.projectCard.activated>=1 && this.activableTwice === false)
	}

	public isDisabled(): boolean{
		if (this.state.isBuildable()===false && this.state.isIgnoreCost()!=false && this.state.isSelectable()===false && this.state.isActivable()===false && this.parentListSubType!='research'){
			return true
		}
		if(this.state.isActivable()===true && this._maximumActivation){
			return true
		}
		return false
	}
}
