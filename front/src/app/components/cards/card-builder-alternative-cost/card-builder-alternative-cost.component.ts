import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../models/core-game/button.model';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PlayableCard } from '../../../factory/playable-card.factory';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CardBuilder, EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { NonEventButtonNames, SettingCardSize } from '../../../types/global.type';
import { ALTERNATIVE_PAY_BUTTON_NAME } from '../../../maps/playable-card-maps';

@Component({
  selector: 'app-card-builder-alternative-cost',
  imports: [
	CommonModule,
	NonEventButtonComponent
  ],
  templateUrl: './card-builder-alternative-cost.component.html',
  styleUrl: './card-builder-alternative-cost.component.scss'
})
export class CardBuilderAlternativeCostComponent implements OnInit, OnChanges, OnDestroy{
	@Input() event!: EventBaseModel
	@Input() locked!: boolean //should be true when first builder isnt locked
	@Output() buttonClicked = new  EventEmitter<any>()
	@Input() builder!: CardBuilder
	@Input() cardSize!: SettingCardSize
	_buttons: NonEventButton[] = []
	_used: NonEventButtonNames[] = []

	private alreadyUsedButtons: NonEventButtonNames[] = []
	private destroy$ = new Subject<void>
	private clientState!: PlayerStateModel

	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onClientStateUpdate(state))
		this.gameStateService.currentEventQueue.pipe(takeUntil(this.destroy$)).subscribe(() => this.onEventQueueUpdate())
	}
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['locked'] && changes['locked'].currentValue){
			this.updateButtonEnabled()
		}
		if(changes['event'] && changes['event'].currentValue){
			this.updateButtonEnabled()
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	updateButtonList(){
		if(!this.clientState){return}
		this._buttons = []
		let alternativeCardCode: string[] = PlayableCard.getAlternativePayActiveCodeList(this.clientState)
		if(alternativeCardCode.length===0){return}
		for(let code of alternativeCardCode){
			let caption = PlayableCard.getAlternativePayCaption(code)
			if(!caption){continue}
			this._buttons.push(ButtonDesigner.createNonEventButton(caption))
		}
	}
	public updateButtonEnabled(){
		this.alreadyUsedButtons = (this.event as EventCardBuilder).getAlternativeCostUsed()
		this.updateButtonList()
		for(let b of this._buttons){
			b.setEnabled(this.getButtonEnabled(b))
		}
	}
	private getButtonEnabled(button: NonEventButton): boolean {
		if(this.locked){return false}
		if(this.getAlternativePayLocked()){return false}
		if(this._used.includes(button.name)){return false}
		if(this.alreadyUsedButtons.includes(button.name)){return false}
		return PlayableCard.prerequisite.canBeAlternativePaid(button.name, this.clientState)
	}
	private onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.updateButtonEnabled()
	}
	private onEventQueueUpdate(){
		this.updateButtonEnabled()
	}
	onButtonClicked(button: NonEventButton){
		let events = PlayableCard.getAlternativePayButtonClickedEvents(button.name)
		if(events.length===0){return}
		this.gameStateService.addEventQueue(events, 'first')
		let builderEvent: EventCardBuilder = this.event as EventCardBuilder
		switch(button.name){
			case('alternativePayAnaerobicMicroorganisms'):{
				builderEvent.buildDiscountValue += 10
				builderEvent.onAlternativeCostUse(button.name)
				this._used.push(button.name)
				break
			}
			case('alternativePayRestructuredResources'):{
				builderEvent.buildDiscountValue += 5
				builderEvent.onAlternativeCostUse(button.name)
				this._used.push(button.name)
				break
			}
		}
		this.updateButtonEnabled()
		this.buttonClicked.emit(button)
	}
	getAlternativePayLocked(): boolean {
		let builderEvent: EventCardBuilder = this.event as EventCardBuilder
		if(builderEvent.hasSelectorCardSelected()===true){return true}
		return !builderEvent.cardBuilder[0].getBuilderIsLocked() && builderEvent.cardBuilder[0] != this.builder
	}
}
