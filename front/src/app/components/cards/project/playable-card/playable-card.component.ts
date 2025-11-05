import { Component, Input, OnInit, Output, inject, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { CardBackgroundComponent } from '../card-blocks/card-background/card-background.component';
import { ProjectCardCostService } from '../../../../services/cards/project-card-cost.service';
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
import { CardActivationListComponent } from '../card-blocks/card-activation-list/card-activation-list.component';
import { ProjectFilter } from '../../../../interfaces/global.interface';
import { CardDisabledForegroundComponent } from '../card-blocks/card-disabled-foreground/card-disabled-foreground.component';
import { SettingCardSize } from '../../../../types/global.type';
import { ProjectCardScalingVPService } from '../../../../services/cards/project-card-scaling-VP.service';
import { CardStatsListComponent } from '../card-blocks/card-stats/card-stats-list.component';
import { CardScalingProductionComponent } from '../card-blocks/card-scaling-prod/card-scaling-production.component';
import { SCALING_PRODUCTION } from '../../../../maps/playable-card-scaling-production-maps';
import { PlayableCard } from '../../../../factory/playable-card.factory';

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
    CardStatusComponent,
    CardDisabledForegroundComponent,
    CardStatsListComponent,
	CardScalingProductionComponent
],
    templateUrl: './playable-card.component.html',
    styleUrl: './playable-card.component.scss',
    providers: [
		ProjectCardCostService,
		ProjectCardScalingVPService
	],
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
	@Input() cardSize!: SettingCardSize
	@Input() notClientState!: PlayerStateModel | undefined
	private megacreditAvailable: number = 0
	private playerState!: PlayerStateModel

	_hovered: boolean = false
	_activationCostPayable: boolean = false
	_hasScalingProduction: boolean = false

	private destroy$ = new Subject<void>()

	constructor(
		private gameStateService: GameState,
		private projectCardCostService: ProjectCardCostService,
		private projectCardVpService: ProjectCardScalingVPService
	){
		super();
	}

	override ngOnInit() {
		super.ngOnInit()
		this.projectCard.tagsUrl = []
		this.projectCardCostService.initialize(this.projectCard)
		this.projectCardVpService.initialize(this.projectCard)
		this.projectCard.tagsId = this.fillTagId(this.projectCard.tagsId)
		this._hasScalingProduction = PlayableCard.hasScalingProduction(this.projectCard.cardCode)

		// fills tagUrl
		for(let i = 0; i < this.projectCard.tagsId.length; i++) {
			this.projectCard.tagsUrl.push(GlobalInfo.getUrlFromID(this.projectCard.tagsId[i]))
		}
		this.initialize()
		this._loaded = true
	}
	override ngOnChanges(changes: SimpleChanges) {
		if(!this._loaded){return}
		if (changes['initialState'] && changes['initialState'].currentValue) {
			this.state.resetStateToInitial()
		}
		if (changes['stateFromParent'] && changes['stateFromParent'].currentValue) {
			this.changeStateFromParent()
		}
		if (changes['buildDiscount'] && changes['buildDiscount'].currentValue) {
			this.updateDiscount()
		}
	}
	private initialize(){
		// subscribe to gameState if card isnt played
		if(this.parentListType!='played'){
			this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateplayerState(state))
			return
		}

		if(!this.projectCard.scalingVp){return}

		// set playerstate as notClientstate so it can display scaled vp on other players played cards
		if(this.notClientState){
			this.playerState = this.notClientState
			this.updateVpScalingServiceState()
			return
		}

		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateplayerState(state))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	resetCardState(): void {
		if(this.megacreditAvailable===0){return}
		this.setBuildable()
	}
	updateDiscount(){
		this.projectCardCostService.setBuilderDiscount(this.buildDiscount)
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
		this.setSelection(this.state.isSelected()===false)
	}
	private updateplayerState(state: PlayerStateModel): void {
		if(!state){return}
		this.playerState = state
		this.projectCardCostService.setBuilderDiscount(this.buildDiscount)
		this.projectCardCostService.onClientStateUpdate(state)
		this.updateVpScalingServiceState()
		this.updateDiscount()
	}
	public setBuildable(): void {
		if(this.parentListType != 'builderSelector'){return}
		this.state.setBuildable(this.projectCardCostService.getCanBePlayed())
	}
	public onActivation(activation: {option: ActivationOption, twice: boolean}): void {
		this.cardActivated.emit({card: this.projectCard, option: activation.option, twice: activation.twice})
	}
	public isActivable(): boolean {
		return !(this.projectCard.activated>=2 || (this.projectCard.activated>=1 && this.activableTwice === false))
	}
	public isDisabled(): boolean{
		if(this.isParentListExcludedFromDisabledCheck()){return false}
		if(this.filter && !this.projectCard.isFilterOk(this.filter)){
			return true
		}
		if(this.parentListType==='builderSelector' && this.state.isBuildable()===false && this.state.isIgnoreCost()!=false){
			return true
		}
		if(this.state.isActivable()===true && !this.isActivable()){
			return true
		}
		if(!this.state.isBuildable() && !this.state.isIgnoreCost()){
			return true
		}
		return false
	}
	private isParentListExcludedFromDisabledCheck(): boolean {
		let excluded: ProjectListType[] = ['none', 'builderSelectedZone', 'hand', 'played', 'statsRoute']
		return excluded.includes(this.parentListType)
	}
	public isSelectable(): boolean {
		if(this.isDisabled()){return false}
		return this.state.isSelectable()
	}
	public isGreyedWhenSelected(): boolean {
		if(this.parentListSubType==='none'){return false}
		return true
	}
	private updateVpScalingServiceState(){
		if(!this.projectCard.scalingVp){return}
		let authorized: ProjectListType[] = ['hand', 'builderSelector', 'builderSelectedZone', 'played', 'playedSelector']
		if(!authorized.includes(this.parentListType)){return}
		this.projectCardVpService.updatePlayerState(this.playerState)
	}
	public isRepeatProduction(): boolean {
		return this.parentListSubType==='repeatProduction'
	}
	public getRepeatProductionCaption(): string {
		return PlayableCard.getRepeatProductionCaption(this.projectCard.cardCode, this.playerState)
	}
	public selectFromParent(){
		this.setSelection(true)
	}
	public unselectFromParent(){
		this.setSelection(false)
	}
	private setSelection(newSelection: boolean){
		this.state.setSelected(newSelection)
		this.cardStateChange.emit({card:this.projectCard, state: this.state})
	}
}
