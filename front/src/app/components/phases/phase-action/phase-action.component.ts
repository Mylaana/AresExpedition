import { Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import { NonEventButtonComponent } from '../../tools/button/non-event-button.component';
import { NonEventButton } from '../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../services/designers/button-designer.service';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { EventBaseModel } from '../../../models/core-game/event.model';

@Component({
  selector: 'app-phase-action',
  standalone: true,
  imports: [
	NonEventButtonComponent
],
  templateUrl: './phase-action.component.html',
  styleUrl: './phase-action.component.scss'
})
export class PhaseActionComponent implements OnInit, OnDestroy{
	@Input() event!: EventBaseModel
	_convertForest: NonEventButton = ButtonDesigner.createNonEventButton('convertForest')
	_buyForest: NonEventButton = ButtonDesigner.createNonEventButton('buyForest')
	_convertTemperature: NonEventButton = ButtonDesigner.createNonEventButton('convertTemperature')
	_buyTemperature: NonEventButton = ButtonDesigner.createNonEventButton('buyTemperature')
	_convertInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('convertInfrastructure')
	_buyInfrastructure: NonEventButton = ButtonDesigner.createNonEventButton('buyInfrastructure')
	_buyOcean: NonEventButton = ButtonDesigner.createNonEventButton('buyOcean')

	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit(): void {
		this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(state => this.updateButtonState(state[0]))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}

	updateButtonState(state: PlayerStateModel): void {
		let mc = state.getRessourceInfoFromType('megacredit')?.valueStock??0
		let plant = state.getRessourceInfoFromType('plant')?.valueStock??0
		let heat = state.getRessourceInfoFromType('heat')?.valueStock??0

		this._convertForest.updateEnabled(plant>=8)
		this._buyForest.updateEnabled(mc>=16)
		this._convertTemperature.updateEnabled(heat>=8)
		this._buyTemperature.updateEnabled(mc>=14)
		this._convertInfrastructure.updateEnabled(heat>=5 && plant>=3)
		this._buyInfrastructure.updateEnabled(mc>=15)
		this._buyOcean.updateEnabled(mc>=16)
	}
}
