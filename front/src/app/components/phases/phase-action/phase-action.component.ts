import { AfterViewInit, Component, EventEmitter, Input, input, OnDestroy, OnInit, Output } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { EventMainButton, NonEventButton } from '../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../services/designers/button-designer.service';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { EventBaseModel, EventCardSelector } from '../../../models/core-game/event.model';
import { EventDesigner } from '../../../services/designers/event-designer.service';

@Component({
  selector: 'app-phase-action',
  standalone: true,
  imports: [
	NonEventButtonComponent
],
  templateUrl: './phase-action.component.html',
  styleUrl: './phase-action.component.scss'
})
export class PhaseActionComponent implements OnInit, OnDestroy, AfterViewInit{
	@Input() event!: EventBaseModel
	@Output() actionPhaseButtonUpdate: EventEmitter<boolean> = new EventEmitter<boolean>()
	_convertForest: NonEventButton = ButtonDesigner.createNonEventButton('convertForest')
	_buyForest: NonEventButton = ButtonDesigner.createNonEventButton('buyForest')
	_convertTemperature: NonEventButton = ButtonDesigner.createNonEventButton('convertTemperature')
	_buyTemperature: NonEventButton = ButtonDesigner.createNonEventButton('buyTemperature')
	_convertInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('convertInfrastructure')
	_buyInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('buyInfrastructure')
	_buyOcean: NonEventButton = ButtonDesigner.createNonEventButton('buyOcean')

	private _mcStock: number = 0
	private _plantStock: number = 0
	private _heatStock: number = 0
	private _actionEvent!: EventCardSelector
	private _loaded = false
	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(
			state => {this.onStateUpdate(state[this.gameStateService.clientPlayerId])})
		this._actionEvent = this.event as EventCardSelector
		this.updateButtonState()
	}
	ngAfterViewInit(): void {
		if(this.event.button){this.updateEndPhaseButton(this.event.button as EventMainButton)}
		this._loaded = true
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onStateUpdate(state: PlayerStateModel): void {
		this._mcStock = state.getRessourceInfoFromType('megacredit')?.valueStock??0
		this._plantStock = state.getRessourceInfoFromType('plant')?.valueStock??0
		this._heatStock = state.getRessourceInfoFromType('heat')?.valueStock??0
		if(!this._loaded){return}
		this.updateButtonState()
		if(this.event.button){this.updateEndPhaseButton(this.event.button as EventMainButton)}

		let finishPhaseButtonEnabled = (this._heatStock>=8  || this._plantStock>=8 || (this._heatStock>=5  && this._plantStock>=3)) === false

		//this._actionEvent.button?.updateEnabled(finishPhaseButtonEnabled)
		//this.actionPhaseButtonUpdate.emit(finishPhaseButtonEnabled)
	}
	updateButtonState(): void {
		this._convertForest.updateEnabled(this._plantStock>=8)
		this._buyForest.updateEnabled(this._mcStock>=16)
		this._convertTemperature.updateEnabled(this._heatStock>=8)
		this._buyTemperature.updateEnabled(this._mcStock>=14)
		this._convertInfrastructure.updateEnabled(this._heatStock>=5 && this._plantStock>=3)
		this._buyInfrastructure.updateEnabled(this._mcStock>=15)
		this._buyOcean.updateEnabled(this._mcStock>=16)
	}
	updateEndPhaseButton(button: EventMainButton){
		let finishPhaseButtonEnabled = (this._heatStock>=8  || this._plantStock>=8 || (this._heatStock>=5  && this._plantStock>=3)) === false
		button.updateEnabled(finishPhaseButtonEnabled)
	}
	onClick(button: NonEventButton): void {
		let newEvents: EventBaseModel[] = []
		switch(button.name){
			case('convertForest'):{
				newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource: {name:'plant', valueStock: -8}}))
				newEvents.push(EventDesigner.createGeneric('addForestPoint', {addForestPoint: 1}))
				newEvents.push(EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter: {name:'oxygen', steps:1}}))
				break
			}
			case('buyForest'):{
				newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -16}}))
				newEvents.push(EventDesigner.createGeneric('addForestPoint', {addForestPoint: 1}))
				newEvents.push(EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter: {name:'oxygen', steps:1}}))
				break
			}
			case('convertTemperature'):{
				newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource: {name:'heat', valueStock: -8}}))
				newEvents.push(EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter: {name:'temperature', steps:1}}))
				break
			}
			case('buyTemperature'):{
				newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -14}}))
				newEvents.push(EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter: {name:'temperature', steps:1}}))
				break
			}
			case('convertInfrastructure'):{
				newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource: [{name:'heat', valueStock: -5}, {name:'plant', valueStock: -3}]}))
				newEvents.push(EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter: {name:'infrastructure', steps:1}}))
				newEvents.push(EventDesigner.createDeckQueryEvent('drawQuery', {drawDiscard:{draw: 1}}))
				break
			}
			case('buyInfrastructure'):{
				newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -15}}))
				newEvents.push(EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter: {name:'infrastructure', steps:1}}))
				newEvents.push(EventDesigner.createDeckQueryEvent('drawQuery', {drawDiscard:{draw: 1}}))
				break
			}
			case('buyOcean'):{
				newEvents.push(EventDesigner.createGeneric('addRessourceToPlayer', {baseRessource: {name:'megacredit', valueStock: -16}}))
				newEvents.push(EventDesigner.createGeneric('increaseGlobalParameter', {increaseParameter: {name:'ocean', steps:1}}))
				break
			}
		}
		this.gameStateService.addEventQueue(newEvents, 'first')
	}
}
