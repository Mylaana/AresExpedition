import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalParameterCardComponent } from '../global-parameter-card/global-parameter-card.component';
import { CommonModule } from '@angular/common';
import { OceanCardComponent } from '../ocean-card/ocean-card.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { Subject, takeUntil } from 'rxjs';
import { PlayerGlobalParameterStateModel } from '../../../models/player-info/player-state-global-parameter.model';
import { GlobalParameter } from '../../../interfaces/global.interface';
import { Utils } from '../../../utils/utils';
import { GlobalParameterNameEnum } from '../../../enum/global.enum';

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

	_oceanState: GlobalParameter = {name:GlobalParameterNameEnum.ocean, step: 0, addEndOfPhase: 0}
	_infrastructureState: GlobalParameter = {name:GlobalParameterNameEnum.infrastructure, step: 0, addEndOfPhase: 0}
	_temperatureState: GlobalParameter = {name:GlobalParameterNameEnum.temperature, step: 0, addEndOfPhase: 0}
	_oxygenState: GlobalParameter = {name:GlobalParameterNameEnum.oxygen, step: 0, addEndOfPhase: 0}

	constructor(private gameStateService: GameState){}
	ngOnInit(): void {
		this.gameStateService.currentGroupPlayerState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onStateUpdate())

	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onStateUpdate(): void {
		let globalState = this.gameStateService.getClientState().getGlobalParameters()
		console.log('global pannel state update:', globalState)
		for(let state of globalState){
			console.log(Utils.jsonCopy(state))
			switch(state.name){
				case(GlobalParameterNameEnum.ocean):{this._oceanState = Utils.jsonCopy(state); break}
				case(GlobalParameterNameEnum.infrastructure):{this._infrastructureState = Utils.jsonCopy(state); break}
				case(GlobalParameterNameEnum.oxygen):{this._oxygenState= Utils.jsonCopy(state); break}
				case(GlobalParameterNameEnum.temperature):{this._temperatureState = Utils.jsonCopy(state); break}
			}
		}
	}
}
