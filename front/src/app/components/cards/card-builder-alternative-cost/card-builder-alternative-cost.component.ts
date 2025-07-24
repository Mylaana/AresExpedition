import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../models/core-game/button.model';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PlayableCard } from '../../../factory/playable-card.factory';
import { ButtonDesigner } from '../../../factory/button-designer.service';
import { CardBuilder, EventBaseModel, EventCardBuilder } from '../../../models/core-game/event.model';
import { ButtonNames, NonEventButtonNames } from '../../../types/global.type';

@Component({
  selector: 'app-card-builder-alternative-cost',
  imports: [
	CommonModule,
	NonEventButtonComponent
  ],
  templateUrl: './card-builder-alternative-cost.component.html',
  styleUrl: './card-builder-alternative-cost.component.scss'
})
export class CardBuilderAlternativeCostComponent implements OnInit, OnChanges{
	@Input() event!: EventBaseModel
	@Input() locked!: boolean //should be true when first builder isnt locked
	@Output() buttonClicked = new  EventEmitter<any>()
	@Input() builder!: CardBuilder
	_buttons: NonEventButton[] = []
	_used: NonEventButtonNames[] = []

	private destroy$ = new Subject<void>
	private clientState!: PlayerStateModel

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onClientStateUpdate(state))
	}
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['locked'] && changes['locked'].currentValue){
			this.updateButtonEnabled()
		}
	}
	updateButtonList(){
		this._buttons = []
		let alternativeCardCode: string[] = PlayableCard.getAlternativePayActiveCodeList(this.clientState)
		if(alternativeCardCode.length===0){return}
		for(let code of alternativeCardCode){
			let caption = PlayableCard.getAlternativePayCaption(code)
			if(!caption){continue}
			this._buttons.push(ButtonDesigner.createNonEventButton(caption))
		}
		this.updateButtonEnabled()
	}
	public updateButtonEnabled(){
		console.log(this.locked, this._used)
		for(let b of this._buttons){
			b.enabled = this.getButtonEnabled(b)
		}
	}
	private getButtonEnabled(button: NonEventButton): boolean {
		//if(this.locked){return false}
		if(this._used.includes(button.name)){return false}
		//return true
		return PlayableCard.prerequisite.canBeAlternativePaid(button.name, this.clientState)
	}
	onClientStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.updateButtonList()
	}
	onButtonClicked(button: NonEventButton){
		console.log(button)
		let events = PlayableCard.getAlternativePayButtonClickedEvents(button.name)
		if(events.length===0){return}
		this.gameStateService.addEventQueue(events, 'first')
		let builderEvent: EventCardBuilder = this.event as EventCardBuilder
		switch(button.name){
			case('alternativePayAnaerobicMicroorganisms'):{
				console.log(builderEvent)
				builderEvent.buildDiscountValue += 10
				this._used.push(button.name)
				break
			}
			case('alternativePayRestructuredResources'):{
				console.log(builderEvent)
				builderEvent.buildDiscountValue += 5
				this._used.push(button.name)
				break
			}
		}
		this.updateButtonEnabled()
		this.buttonClicked.emit(button)
	}
}
