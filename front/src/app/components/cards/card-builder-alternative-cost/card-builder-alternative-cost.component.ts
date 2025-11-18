import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../models/core-game/button.model';
import { Subject, takeUntil } from 'rxjs';
import { GameStateFacadeService } from '../../../services/game-state/game-state-facade.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PlayableCard } from '../../../factory/playable-card.factory';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { NonEventButtonNames, SettingCardSize } from '../../../types/global.type';
import { CardBuilder } from '../../../models/core-game/card-builder.model';
import { EventBuilderHandlerService } from '../../../services/core-game/components-services/card-builder.service';

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
	@Input() locked!: boolean //should be true when first builder isnt locked
	@Output() buttonClicked = new  EventEmitter<any>()
	@Input() builder!: CardBuilder
	@Input() cardSize!: SettingCardSize

	_buttons: NonEventButton[] = []
	_used: NonEventButtonNames[] = []

	private alreadyUsedButtons: NonEventButtonNames[] = []
	private destroy$ = new Subject<void>
	private clientState!: PlayerStateModel

	constructor(
		private gameStateService: GameStateFacadeService,
		private cardBuilderEventService: EventBuilderHandlerService
	){}

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onClientStateUpdate(state))
		this.cardBuilderEventService.currentAlternativeCostUnlocked.pipe(takeUntil(this.destroy$)).subscribe(e => this.onAlternativePayListUpdate(e))
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
	public updateButtonEnabled(){
		if(this._buttons.length===0){return}
		this.alreadyUsedButtons = this.builder.getAlternativeCostUsed()
		for(let b of this._buttons){
			b.setEnabled(this.getButtonEnabled(b))
		}
	}
	private getButtonEnabled(button: NonEventButton): boolean {
		if(this._used.includes(button.name)){return false}
		if(this.alreadyUsedButtons.includes(button.name)){return false}
		return PlayableCard.prerequisite.canBeAlternativePaid(button.name, this.clientState)
	}
	private onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.updateButtonEnabled()
	}
	private onAlternativePayListUpdate(buttonNames: NonEventButtonNames[]){
		this._buttons = []
		for(let b of buttonNames){
			this._buttons.push(ButtonDesigner.createNonEventButton(b))
		}
		this.updateButtonEnabled()
	}
	onButtonClicked(button: NonEventButton){
		this._used.push(button.name)
		this.cardBuilderEventService.onAlternativePayButtonClicked(button)
	}
}
