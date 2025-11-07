import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { GlobalParameterCardComponent } from '../global-parameter-card/global-parameter-card.component';
import { CommonModule } from '@angular/common';
import { OceanCardComponent } from '../ocean-card/ocean-card.component';
import { GameState } from '../../../services/game-state/game-state.service';
import { Subject, takeUntil } from 'rxjs';
import { PlayerGlobalParameterStateModel } from '../../../models/player-info/player-state-global-parameter.model';
import { GlobalParameter, OceanBonus } from '../../../interfaces/global.interface';
import { Utils } from '../../../utils/utils';
import { GlobalParameterNameEnum } from '../../../enum/global.enum';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { GameContentName } from '../../../types/global.type';
import { GameActiveContentService } from '../../../services/core-game/game-active-content.service';

@Component({
    selector: 'app-global-parameter-pannel',
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
	_moonState: GlobalParameter = {name:GlobalParameterNameEnum.moon, step: 0, addEndOfPhase: 0}

	_oceanFlippedBonus: OceanBonus[] = []

	constructor(
		private gameStateService: GameState,
		private gameContentService: GameActiveContentService,
		private el: ElementRef
	){}

	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(state => this.onStateUpdate(state))
		const host = this.el.nativeElement as HTMLElement;
		host.style.setProperty('--parameter-count', this.getParameterHeight().toString());
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onStateUpdate(clientState: PlayerStateModel): void {
		for(let state of clientState.getGlobalParameters()){
			switch(state.name){
				case(GlobalParameterNameEnum.ocean):{this._oceanState = Utils.jsonCopy(state); break}
				case(GlobalParameterNameEnum.infrastructure):{this._infrastructureState = Utils.jsonCopy(state); break}
				case(GlobalParameterNameEnum.oxygen):{this._oxygenState= Utils.jsonCopy(state); break}
				case(GlobalParameterNameEnum.temperature):{this._temperatureState = Utils.jsonCopy(state); break}
				case(GlobalParameterNameEnum.moon):{this._moonState = Utils.jsonCopy(state); break}
			}
		}
		this._oceanFlippedBonus = clientState.getOceanFlippedBonus()
	}
	isContentActive(content: GameContentName): boolean {
		return this.gameContentService.isContentActive(content)
	}
	private getParameterHeight(): number {
		let count = 2
		count += this.isContentActive('expansionFoundations')? 1:0
		count += this.isContentActive('expansionMoon')? 1:0

		switch(count){
			case(2):{
				return .35
			}
			case(3):{
				return .25
			}
			case(4):{
				return .19
			}
		}
		return .18
	}
}
