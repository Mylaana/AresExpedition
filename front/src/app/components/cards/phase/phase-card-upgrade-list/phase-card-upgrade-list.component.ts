import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../phase-card/phase-card.component';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PhaseCardGroupModel, PhaseCardModel } from '../../../../models/cards/phase-card.model';
import { PhaseCardUpgradeType } from '../../../../types/phase-card.type';
import { CardStateModel } from '../../../../models/cards/card-state.model';
import { CardState } from '../../../../interfaces/card.interface';
import { Utils } from '../../../../utils/utils';
import { myUUID, SettingCardSize } from '../../../../types/global.type';
import { GameParamService } from '../../../../services/core-game/game-param.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
    selector: 'app-phase-card-upgrade-list',
    imports: [
        CommonModule,
        PhaseCardComponent
    ],
    templateUrl: './phase-card-upgrade-list.component.html',
    styleUrl: './phase-card-upgrade-list.component.scss'
})
export class PhaseCardUpgradeListComponent implements OnInit, OnDestroy{
	@Input() phaseGroup!: PhaseCardGroupModel
	@Input() upgradeFinished: boolean = false
	cardInitialState!: CardState
	stateFromParent!: CardState
	@Output() cardUpgraded: EventEmitter<any> = new EventEmitter<any>()

	phaseCardLevelList!: number[];
	phaseCardState: CardState[] = [];
	@ViewChildren('phaseCards') phaseCards!: QueryList<PhaseCardComponent>
	phaseCardModels:PhaseCardModel[] = []

	clientPlayerPhaseCardGroupState!: PhaseCardGroupModel;

	loaded: boolean = false
	_cardSize!: SettingCardSize
	private destroy$ = new Subject<void>

	constructor(
		private gameStateService: GameState,
		private gameParam: GameParamService
	){}

	ngOnInit(): void {
		this.gameParam.currentCardSize.pipe(takeUntil(this.destroy$)).subscribe(size => this._cardSize = size)
		this.phaseCardLevelList = [0, 1, 2]
		this.phaseCardModels = this.phaseGroup.phaseCards

		this.loaded = true
		this.cardInitialState = Utils.toFullCardState({upgradable: this.canUpgrade()})
		this.setState()
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	refreshPhaseGroup(): void {
		for(let card of this.phaseCards){
			card.refreshState()
		}
	}
	setUpgradeFinished(): void {
		this.upgradeFinished = true
		this.stateFromParent = Utils.toFullCardState({upgradable: this.canUpgrade()})
	}
	canUpgrade(): boolean {
		if(this.upgradeFinished){return false}
		if(this.phaseGroup.getPhaseIsUpgraded()){return false}
		return true
	}
	private setState(): void {
		if(this.loaded===false){return}
		this.stateFromParent = Utils.toFullCardState({upgradable: this.canUpgrade()})
	}
	public phaseCardUpgraded(upgradeType: PhaseCardUpgradeType): void {
		this.cardUpgraded.emit()

		this.gameStateService.setClientPhaseCardUpgraded(upgradeType)
		this.setState()
	}
}
