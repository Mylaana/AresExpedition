import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NonSelectablePhaseEnum } from '../../../../enum/phase.enum';
import { CardState } from '../../../../interfaces/card.interface';
import { CardSelector,  } from '../../../../interfaces/global.interface';
import { PlayableCardModel } from '../../../../models/cards/project-card.model';
import { EventBaseModel, EventCardActivator, EventCardBuilder, EventCardSelector } from '../../../../models/core-game/event.model';
import { Utils } from '../../../../utils/utils';
import { PlayableCardComponent } from '../playable-card/playable-card.component';
import { ActivationOption, ProjectListSubType, ProjectListType } from '../../../../types/project-card.type';
import { EventUnionSubTypes } from '../../../../types/event.type';
import { GameParamService } from '../../../../services/core-game/game-param.service';
import { Subject, takeUntil } from 'rxjs';
import { SettingCardSize } from '../../../../types/global.type';

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
	@Input() event?: EventBaseModel;
	@Input() eventId?: number;
	@Input() cardList!: PlayableCardModel[]
	@Input() listType: ProjectListType = 'none'
	@Input() listSubType: ProjectListSubType = 'none'
	@Input() selectedDiscount: number = 0

	//display related inputs
	@Input() currentPhase!: NonSelectablePhaseEnum
	@Input() background?: any = ''
	@Input() hovered!: boolean

	@Output() updateSelectedCardList: EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}> = new EventEmitter<{selected: PlayableCardModel[], listType: ProjectListType}>()
	@Output() projectActivated: EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}> = new EventEmitter<{card: PlayableCardModel, option:ActivationOption, twice: boolean}>()
	@ViewChildren('projectCardComponent') projectCards!: QueryList<PlayableCardComponent>

	_buildDiscount: number = 0
	_cardSelector!: CardSelector
	_displayedCards!: PlayableCardModel[] | undefined;
	_activateTwiceRemaining: number = 0
	private selectedCardList: PlayableCardModel[] = [];

	_cardSize!: SettingCardSize
	private destroy$ = new Subject<void>

	constructor(private gameParam: GameParamService){}

	ngOnInit(){
		this.resetSelector()
		this.updateCardList()
		this.setBackground()
		if(this.event){this.setListSubType(this.event as EventCardSelector)}
		if(this.event?.hasCardActivator()){
			this.setActivationCount(this.event as EventCardActivator)
		}
		if(this.listType!='hand'){
			this.gameParam.currentCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
		} else {
			this.gameParam.currentHandCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
		}
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes['event'] && changes['event'].currentValue) {this.updateCardList(); return}
		if (changes['eventId'] && changes['eventId'].currentValue) {this.updateCardList(); return}
		if (changes['cardList'] && changes['cardList'].currentValue) {
			this.updateCardList()
			return
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
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
	private resetSelector(): void {
		this._cardSelector = {
			selectFrom: [],
			selectedList: [],
			selectionQuantity: 0,
			selectionQuantityTreshold: 'equal',
			cardInitialState: Utils.toFullCardState({selected:false, selectable:false}),
			stateFromParent : Utils.toFullCardState({selected:false, selectable:false})
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
	private setSelector(): void {
		this.resetSelector()
		if(selectorTypes.includes(this.listType)){
			this.setSelectorFromEvent(this.event as EventCardSelector)
			this.setListSubType(this.event as EventCardSelector)
		}
		if(this.event?.hasCardActivator()){
			this.setActivationCount(this.event as EventCardActivator)
		}
	}
	private setActivationCount(event: EventCardActivator): void {
		this._activateTwiceRemaining = event.doubleActivationMaxNumber - event.doubleActivationCount
	}
	private setSelectorFromEvent(event: EventCardSelector): void {
		this._cardSelector = event.cardSelector
	}
	private setDisplay(): void {
		switch(this.listType){
			case('builderSelector'):{
				this.applyDiscount(this.event as EventCardBuilder)
				this._displayedCards = this._cardSelector.selectFrom
				break
			}
			case('builderSelectedZone'):{
				this.applyDiscount()
				this._displayedCards = this.cardList
				break
			}
			case('selector'):case('playedSelector'):{
				this._displayedCards = this._cardSelector.selectFrom
				break
			}
			default:{
				this._displayedCards = this.cardList
			}
		}
	}
	private applyDiscount(event?: EventCardBuilder): void {
		this._buildDiscount = event?.buildDiscountValue??0 + this.selectedDiscount??0
		this.childrenUpdateCost()
	}
	private childrenUpdateCost(): void {
		if(this.projectCards===undefined){return}
		for(let card of this.projectCards){
			card.buildDiscount = this._buildDiscount
			card.updateCost()
		}
	}
	public updateDiscount(event: EventCardBuilder): void {
		this.applyDiscount(event)
	}
	public updateCardList(): void {
		if(selectorTypes.includes(this.listType)){this.setSelector()}
		this.setDisplay()
		this.setBackground()


		if(this._displayedCards!=undefined && this._displayedCards.length===0){this._displayedCards=undefined}
	}
	private resetSelectedCardList(): void {
		this.selectedCardList = []
	}

	public onProjectActivated(input: {card: PlayableCardModel, option:ActivationOption, twice: boolean}): void {
		this.projectActivated.emit(input)
		this.setSelector()
	}
}

