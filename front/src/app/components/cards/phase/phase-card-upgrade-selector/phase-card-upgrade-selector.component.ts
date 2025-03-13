import { Component, Input, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PhaseCardUpgradeListComponent } from '../phase-card-upgrade-list/phase-card-upgrade-list.component';
import { EventBaseModel, EventGeneric } from '../../../../models/core-game/event.model';
import { PhaseCardGroupModel } from '../../../../models/cards/phase-card.model';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-phase-card-upgrade-selector',
  standalone: true,
  imports: [
	CommonModule,
	PhaseCardUpgradeListComponent
],
  templateUrl: './phase-card-upgrade-selector.component.html',
  styleUrl: './phase-card-upgrade-selector.component.scss'
})
export class PhaseCardUpgradeSelectorComponent implements OnDestroy{
	@Input() event!: EventBaseModel
	phaseGroups!: PhaseCardGroupModel[]
	_upgradeNumber: number = 0
	phaseList!: number[]
	private currentEvent!: EventGeneric
	@ViewChildren('phaseUpgradeList') phaseUpgradeList!: QueryList<PhaseCardUpgradeListComponent>

	private destroy$ = new Subject<void>()

	constructor(private gameStateService: GameState){}

	ngOnInit():void{
		this.currentEvent = this.event as EventGeneric
		this.phaseList =  this.currentEvent.phaseCardUpgradeList??[0,1,2,3,4]
		this._upgradeNumber = this.currentEvent.phaseCardUpgradeQuantity??0
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe(
			state => this.onStateUpdate(state)
		)
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	onStateUpdate(clientState: PlayerStateModel){
		this.phaseGroups = clientState.getPhaseGroups()
		console.log(this.phaseGroups)
		if(this.phaseUpgradeList===undefined){return}
		for(let list of this.phaseUpgradeList){
			list.refreshPhaseGroup()
		}
	}
	public cardUpgraded(): void {
		if(this.currentEvent.phaseCardUpgradeQuantity===undefined){return}
		this.currentEvent.phaseCardUpgradeQuantity -= 1
		if(this.currentEvent.phaseCardUpgradeQuantity>0){return}
		for(let list of this.phaseUpgradeList){
			list.setUpgradeFinished()
		}
		console.log(this.currentEvent.phaseCardUpgradeQuantity)
	}
}
