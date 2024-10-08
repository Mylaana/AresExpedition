import { Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../../models/cards/card-cost.model';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../../models/player-info/player-state.model';
import { PhaseCardUpgradeListComponent } from '../phase-card-upgrade-list/phase-card-upgrade-list.component';
import { EventBaseModel, EventGeneric } from '../../../../models/core-game/event.model';

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
	phaseList!: number[] 
	cardInitialState: CardState = {selectable: false, upgradable: true};
	clientPlayerId!: number
	upgradeNumber: number = 0
	private _currentEvent!: EventGeneric
	@ViewChildren('phaseUpgradeList') phaseUpgradeList!: QueryList<PhaseCardUpgradeListComponent>

	constructor(private gameStateService: GameState){}

	ngOnInit():void{
		this._currentEvent = this.event as EventGeneric
		this.initialize()

		this.clientPlayerId = this.gameStateService.clientPlayerId
		this.updateChildrenUpgradeRemaining()
	}
	public cardUpgraded(phaseCard: {phaseIndex: number, phaseCardLevel: number}): void {
		//this.gameStateService.removePhaseCardUpgradeNumber(this.clientPlayerId)
		if(this._currentEvent.phaseCardUpgradeQuantity===undefined){return}
		
		this._currentEvent.phaseCardUpgradeQuantity -= 1
		this.updateChildrenUpgradeRemaining()

	}
	updateChildrenUpgradeRemaining(): void {
		//console.log('checks: ',this._currentEvent===undefined , this._currentEvent.phaseCardUpgradeQuantity===undefined , this.phaseUpgradeList===undefined)
		if(this._currentEvent===undefined || this._currentEvent.phaseCardUpgradeQuantity===undefined || this.phaseUpgradeList===undefined){return}
		for(let list of this.phaseUpgradeList){
			list.setUpdateRemaining(this._currentEvent.phaseCardUpgradeQuantity>0)
		}
	}
	initialize(): void {
		this.phaseList =  this._currentEvent.phaseCardUpgradeList?this._currentEvent.phaseCardUpgradeList:[0,1,2,3,4]
		this.upgradeNumber = this._currentEvent.phaseCardUpgradeQuantity?this._currentEvent.phaseCardUpgradeQuantity:0
		console.log(this._currentEvent)
	}
	upgradeNumberUpdate(state: PlayerStateModel[]):void{
		if(state[this.clientPlayerId].phaseCardUpgradeCount!=this.upgradeNumber){
			this.upgradeNumber = state[this.clientPlayerId].phaseCardUpgradeCount
		}

		if(this.upgradeNumber===0){
			this.cardInitialState.selectable = true
			this.cardInitialState.upgradable = false
		}
	}
}
