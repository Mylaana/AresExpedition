import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalParameterCardComponent } from '../global-parameter-card/global-parameter-card.component';
import { CommonModule } from '@angular/common';
import { OceanCardComponent } from '../ocean-card/ocean-card.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { Subject, takeUntil } from 'rxjs';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { PlayerGlobalParameterStateModel } from '../../../models/player-info/player-state-global-parameter.model';
import { GlobalParameter } from '../../../interfaces/global.interface';

@Component({
	selector: 'app-global-parameter-pannel',
	standalone: true,
	imports: [
		CommonModule,
		GlobalParameterCardComponent,
		OceanCardComponent
	],
	templateUrl: './global-parameter-pannel.component.html',
	styleUrl: './global-parameter-pannel.component.scss'
})
export class GlobalParameterPannelComponent implements OnInit, OnDestroy {
	_dummyId = [0, 1, 2, 3]
	_parameterState!: PlayerGlobalParameterStateModel
	private destroy$ = new Subject<void>()

	_oceanState: GlobalParameter = {name:"ocean", value: 0, addEndOfPhase: 0}
	_infrastructureState: GlobalParameter = {name:"infrastructure", value: 0, addEndOfPhase: 0}
	_temperatureState: GlobalParameter = {name:"temperature", value: 0, addEndOfPhase: 0}
	_oxygenState: GlobalParameter = {name:"oxygen", value: 0, addEndOfPhase: 0}

	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onStateUpdate())

	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onStateUpdate(): void {
		let globalState = this.gameStateService.getClientState().getGlobalParameters()

		for(let state of globalState){
			switch(state.name){
				case('ocean'):{this._oceanState = state; break}
				case('infrastructure'):{this._infrastructureState = state; break}
				case('oxygen'):{this._oxygenState= state; break}
				case('temperature'):{this._temperatureState = state; break}
			}
		}
	}
}
