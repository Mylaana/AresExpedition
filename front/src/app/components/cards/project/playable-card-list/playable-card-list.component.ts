import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NonSelectablePhaseEnum } from '../../../../enum/phase.enum';
import { CardState } from '../../../../interfaces/card.interface';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { EventCardBuilder, EventCardSelector } from '../../../../models/core-game/event.model';
import { PlayableCardComponent } from '../playable-card/playable-card.component';
import { ActivationOption, ListBehavior, ProjectListSubType, ProjectListType } from '../../../../types/project-card.type';
import { EventUnionSubTypes } from '../../../../types/event.type';
import { GameParamService } from '../../../../services/core-game/game-param.service';
import { Subject, takeUntil } from 'rxjs';
import { MinMaxEqualType, SettingCardSize } from '../../../../types/global.type';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';

const selectorTypes: ProjectListType[] = ['selector', 'playedSelector', 'builderSelector']

@Component({
    selector: 'app-playable-card-list',
    imports: [
        CommonModule,
        PlayableCardComponent
    ],
    templateUrl: './playable-card-list.component.html',
    styleUrl: './playable-card-list.component.scss'
})
export class PlayableCardListComponent implements OnChanges, OnDestroy, OnInit{
	@Input() cardList!: PlayableCardModel[]
	@Input() listBehavior: ListBehavior = 'display'
	@Input() listType: ProjectListType = 'none'
	@Input() listSubType: ProjectListSubType = 'none'
	@Input() notClientState!: PlayerStateModel | undefined
	@Input() initialChildrenCardState!: CardState
	//@Input() currentChildrenCardState!: CardState
	@Input() buildDiscount: number = 0
	@Input() authorizeSelection: boolean = false
	
	//selection related inputs
	@Input() selectionQuantity!: number
	@Input() selectionTresholdType!: MinMaxEqualType

	//display related inputs
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Input() background?: any = ''
	@Input() hovered!: boolean

	@Output() updateSelectedCardList: EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}> = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()
	@Output() projectActivated: EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}> = new EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}>()
	@ViewChildren('projectCardComponent') projectCards!: QueryList<PlayableCardComponent>

	//_childrenCardState!: CardState
	_displayedCards!: PlayableCardModel[] | undefined;
	_activateTwiceRemaining: number = 0
	private selectedCardList: PlayableCardModel[] = [];

	_cardSize!: SettingCardSize
	private destroy$ = new Subject<void>

	constructor(private gameParam: GameParamService){}

	ngOnInit(){
		this.initialize()

		//setup card size
		if(this.listType!='hand'){
			this.gameParam.currentCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
		} else {
			this.gameParam.currentHandCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
		}
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes['cardList'] && changes['cardList'].currentValue) {
			this.updateCardList()
			return
		}
		if (changes['cardList'] && changes['cardList'].currentValue) {
			this.updateCardList()
			return
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	initialize(){
		this.setDisplay()
		this.setBackground()
	}
	private setBackground(): void{
		switch(this.listType){
			case('builderSelector'):{this.background = (this.currentPhase??'').toLowerCase(); break}
			default:{this.background = this.listType}
		}
	}
	private setListSubType(event: EventCardSelector): void {
		let subtype: EventUnionSubTypes = event.subType as EventUnionSubTypes
		switch(subtype){
			case('selectCardForcedSell'):case('selectCardOptionalSell'):{this.listSubType = 'sell'; break}
			case('researchPhaseResult'):{this.listSubType = 'research'; break}
			case('discardCards'):{this.listSubType='discard'; break}
			case('addRessourceToSelectedCard'):{this.listSubType='addRessource';break}
			case('scanKeepResult'):{this.listSubType='scanKeepResult';break}
		}
	}
	public cardStateChange(cardChange: {card: PlayableCardModel, state:CardState}): void {
		this.resetSelectedCardList()
		for(let card of this.projectCards){
			if(card.state.isSelected()===true){
				this.selectedCardList.push(card.projectCard)
			}
		}
		this.updateSelectedCardList.emit({selected:this.selectedCardList, listType: this.listType})
	}
	private setDisplay(): void {
		if(this.buildDiscount){
			this.applyDiscount()
		}
		this._displayedCards = this.cardList
	}
	
	private applyDiscount(): void {
		this.childrenUpdateCost()
	}
	private childrenUpdateCost(): void {
		if(this.projectCards===undefined){return}
		for(let card of this.projectCards){
			card.buildDiscount = this.buildDiscount
			card.updateDiscount()
		}
	}
	public updateDiscount(event: EventCardBuilder): void {
		this.applyDiscount()
	}
	public updateCardList(): void {
		this.setDisplay()
	}
	private resetSelectedCardList(): void {
		this.selectedCardList = []
	}
	public onProjectActivated(input: {card: PlayableCardModel, option:ActivationOption, twice: boolean}): void {
		this.projectActivated.emit(input)
	}
	public selectAll(){
		for(let card of this.projectCards){
			card.selectFromParent()
		}
	}
	public selectNone(){
		for(let card of this.projectCards){
			card.unselectFromParent()
		}
	}
}

