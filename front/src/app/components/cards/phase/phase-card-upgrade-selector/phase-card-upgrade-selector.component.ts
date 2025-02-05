import { Component, Input, QueryList, ViewChildren} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PhaseCardUpgradeListComponent } from '../phase-card-upgrade-list/phase-card-upgrade-list.component';
import { EventBaseModel, EventGeneric } from '../../../../models/core-game/event.model';
import { PhaseCardGroupModel } from '../../../../models/cards/phase-card.model';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';

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
export class PhaseCardUpgradeSelectorComponent {
	@Input() event!: EventBaseModel
	phaseGroups!: PhaseCardGroupModel[]
	upgradeNumber: number = 0
	phaseList!: number[]
	private _currentEvent!: EventGeneric
	@ViewChildren('phaseUpgradeList') phaseUpgradeList!: QueryList<PhaseCardUpgradeListComponent>

	constructor(private gameStateService: GameState){}

	ngOnInit():void{
		this._currentEvent = this.event as EventGeneric
		this.phaseList =  this._currentEvent.phaseCardUpgradeList??[0,1,2,3,4]
		this.upgradeNumber = this._currentEvent.phaseCardUpgradeQuantity??0
		this.gameStateService.clientState.subscribe(
			state => this.stateUpdated(state)
		)
	}
	stateUpdated(clientState: PlayerStateModel){
		this.phaseGroups = clientState.getPhaseGroups()
		console.log(this.phaseGroups)
		if(this.phaseUpgradeList===undefined){return}
		for(let list of this.phaseUpgradeList){
			list.refreshPhaseGroup()
		}
	}
	public cardUpgraded(): void {
		if(this._currentEvent.phaseCardUpgradeQuantity===undefined){return}
		this._currentEvent.phaseCardUpgradeQuantity -= 1
		if(this._currentEvent.phaseCardUpgradeQuantity>0){return}
		for(let list of this.phaseUpgradeList){
			list.setUpgradeFinished()
		}
		console.log(this._currentEvent.phaseCardUpgradeQuantity)
	}
}
