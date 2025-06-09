import { Component, Input, OnInit, Output, inject, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { CardBackgroundComponent } from '../card-blocks/card-background/card-background.component';
import { CardCost } from '../../../../models/cards/card-cost.model';
import { BaseCardComponent } from '../../base/base-card/base-card.component';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { GlobalInfo } from '../../../../services/global/global-info.service';
import { ActivationOption, ProjectListSubType, ProjectListType } from '../../../../types/project-card.type';
import { expandCollapseVertical } from '../../../../animations/animations';
import { Subject, takeUntil } from 'rxjs';
import { CardCostComponent } from '../card-blocks/card-cost/card-cost.component';
import { CardEffectComponent } from '../card-blocks/card-effect/card-effect.component';
import { CardHighlightComponent } from '../card-blocks/card-highlight/card-highlight.component';
import { CardTagsComponent } from '../card-blocks/card-tags/card-tags.component';
import { CardVpComponent } from '../card-blocks/card-vp/card-vp.component';
import { CardPlayedInfoComponent } from '../card-blocks/card-played/card-played-info.component';
import { CardPrerequisiteComponent } from '../card-blocks/card-prerequisite/card-prerequisite.component';
import { CardStockComponent } from '../card-blocks/card-stock/card-stock.component';
import { CardTagsZoneComponent } from '../card-blocks/card-tags-background/card-tags-zone.component';
import { CardTitleComponent } from '../card-blocks/card-title/card-title.component';
import { CardStartingMegacreditsComponent } from '../card-blocks/card-starting-megacredits/card-starting-megacredits.component';
import { GAME_CARD_DEFAULT_TAG_NUMBER } from '../../../../global/global-const';
import { CardStatusComponent } from '../card-blocks/card-status/card-status.component';
import { CardBuildable } from '../../../../interfaces/card.interface';
import { CardActivationListComponent } from '../card-blocks/card-activation-list/card-activation-list.component';
import { ProjectFilter } from '../../../../interfaces/global.interface';
import { PlayableCard } from '../../../../services/cards/playable-card';

@Component({
    selector: 'app-playable-card',
    imports: [
        CommonModule,
        CardBackgroundComponent,
        CardActivationListComponent,
        CardCostComponent,
        CardEffectComponent,
        CardHighlightComponent,
        CardTagsComponent,
        CardVpComponent,
        CardPlayedInfoComponent,
        CardPrerequisiteComponent,
        CardStockComponent,
        CardTagsZoneComponent,
        CardTitleComponent,
        CardStartingMegacreditsComponent,
		CardStatusComponent
    ],
    templateUrl: './playable-card.component.html',
    styleUrl: './playable-card.component.scss',
    providers: [CardCost],
    animations: [expandCollapseVertical]
})
export class PlayableCardComponent extends BaseCardComponent implements OnInit, OnDestroy {
	@Output() cardActivated: EventEmitter<{card: PlayableCardModel, option: ActivationOption, twice: boolean}> = new EventEmitter<{card: PlayableCardModel, option: ActivationOption, twice: boolean}>()
	@Input() projectCard!: PlayableCardModel;
	@Input() buildDiscount: number = 0
	@Input() parentListType: ProjectListType = 'none'
	@Input() parentListSubType: ProjectListSubType = 'none'
	@Input() activableTwice: boolean = false
	@Input() filter?: ProjectFilter
	private megacreditAvailable: number = 0
	private readonly cardCost = inject(CardCost);
	private clientState!: PlayerStateModel

	_hovered: boolean = false
	_maximumActivation: boolean = false
	_activationCostPayable: boolean = false
	_buildableCheckList!: CardBuildable

	private destroy$ = new Subject<void>()

	constructor(
		private gameStateService: GameState,
	){
		super();
	}

	override ngOnInit() {
		super.ngOnInit()
		this.projectCard.tagsUrl = []
		this.cardCost.initialize(this.projectCard.costInitial, this.projectCard)

		this.projectCard.tagsId = this.fillTagId(this.projectCard.tagsId)
		// fills tagUrl
		for(let i = 0; i < this.projectCard.tagsId.length; i++) {
			this.projectCard.tagsUrl.push(GlobalInfo.getUrlFromID(this.projectCard.tagsId[i]))
		}

		// subscribe to gameState
		if(this.parentListType!='played' || this.projectCard.scalingVp){
			this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateClientState(state))
		}
		this.setBuildable()
		this.setMaximumActivation()
		this._loaded = true
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	resetCardState(): void {
		if(this.megacreditAvailable===0){return}
		this.updateCost()
		this.setBuildable()
	}
	private fillTagId(tagsId:number[]): number[] {
		// ensures having 3 tags id in tagId
		let newTagsId = this.projectCard.tagsId.slice();

		let targetTagsNumber
		switch(this.projectCard.cardType){
			case('corporation'):{
				targetTagsNumber = 1
				break
			}
			default:{
				targetTagsNumber = GAME_CARD_DEFAULT_TAG_NUMBER
			}
		}

		for (let i = this.projectCard.tagsId.length; i < targetTagsNumber; i++) {
		newTagsId.push(-1)
		}
		return newTagsId
	}
	cardClick(){
		if(this.state.isSelectable()!=true){return}
		if(this.isDisabled()){return}
		if(this.state.isBuildable()===false && this.state.isIgnoreCost()!=true){return}
		this.state.setSelected(this.state.isSelected()===false)
		this.cardStateChange.emit({card:this.projectCard, state: this.state})
	}
	private updateClientState(state: PlayerStateModel): void {
		if(!state){return}
		this.clientState = state
		if(this.parentListType==='played' && this.projectCard.scalingVp && this.projectCard.cardCode){
			this.projectCard.vpNumber=this.clientState.getCardScaledVp(this.projectCard.cardCode).toString()
		}
		this.updateCost()
	}
	public updateCost(): void {
		if(!['hand', 'builderSelector'].includes(this.parentListType)){
			return
		}
		this.megacreditAvailable = this.clientState.getRessourceInfoFromType('megacredit')?.valueStock??0
		this.projectCard.cost = this.cardCost.updateCost({
			tagList: this.projectCard.tagsId,
			steelState: this.clientState.getRessourceInfoFromType('steel'),
			titaniumState: this.clientState.getRessourceInfoFromType('titanium'),
			playedTriggersList: this.clientState.getTriggersIdActive(),
			buildDiscount: this.buildDiscount
		})
		this.setBuildable()
	}
	public setBuildable(): void {
		if(this.parentListType != 'builderSelector'){return}
		this.setBuildableCheckList()
		this.state.setBuildable(this.isBuildable())
	}
	private setBuildableCheckList() {
		this._buildableCheckList = {
			costOk: this.megacreditAvailable >= this.projectCard.cost,
			prerequisiteOk: PlayableCard.prerequisite.canBePlayed(this.projectCard, this.clientState)
		}
	}
	private isBuildable(): boolean {
		if(!this._buildableCheckList.costOk){return false}
		if(!this._buildableCheckList.prerequisiteOk){return false}

		return true
	}
	public onActivation(activation: {option: ActivationOption, twice: boolean}): void {
		this.setMaximumActivation()
		this.cardActivated.emit({card: this.projectCard, option: activation.option, twice: activation.twice})
	}
	private setMaximumActivation(): void {
		this._maximumActivation = (this.projectCard.activated>=2) || (this.projectCard.activated>=1 && this.activableTwice === false)
	}
	public isDisabled(): boolean{
		if(this.filter && !this.projectCard.isFilterOk(this.filter)){return true}
		if (this.state.isBuildable()===false
			&& this.state.isIgnoreCost()!=false
			&& this.parentListType==='builderSelector'){
			return true
		}
		if(this.state.isActivable()===true && this._maximumActivation){
			return true
		}
		if(this._buildableCheckList && !(this._buildableCheckList.costOk && this._buildableCheckList.prerequisiteOk)){return true}
		return false
	}
	public isSelectable(): boolean {
		if(this.isDisabled()){return false}
		return this.state.isSelectable()
	}
	public isGreyedWhenSelected(): boolean {
		if(this.parentListSubType==='none'){return false}
		return true
	}
}
