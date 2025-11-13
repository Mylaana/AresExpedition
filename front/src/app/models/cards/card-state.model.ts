import { CardState } from "../../interfaces/card.interface"
import { Utils } from "../../utils/utils"

export class CardStateModel {
	private currentState: CardState = this.defaultState()
	private initialState: CardState = this.defaultState()

	private defaultState(): CardState {
		return {
			selectable: false,
			selected: false,
			upgradable: false,
			upgraded: false,
			activable: false,
			ignoreCost: false
		}
	}
	isSelectable(): boolean {return this.currentState.selectable}
	isSelected(): boolean {return this.currentState.selected}
	isUpgradable(): boolean {return this.currentState.upgradable}
	isUpgraded(): boolean {return this.currentState.upgraded}
	isActivable(): boolean {return this.currentState.activable}
	isIgnoreCost(): boolean {return this.currentState.ignoreCost}

	setSelectable(value: boolean): void  {this.currentState.selectable= value}
	setSelected(value: boolean): void  {this.currentState.selected= value}
	setUpgradable(value: boolean): void  {this.currentState.upgradable= value}
	setUpgraded(value: boolean): void  {this.currentState.upgraded= value}
	setActivable(value: boolean): void  {this.currentState.activable= value}
	setIgnoreCost(value: boolean): void  {this.currentState.ignoreCost= value}

	resetStateToInitial(): void {this.currentState = Utils.jsonCopy(this.initialState)}

	getCurrentState(): CardState {return this.currentState}
	setCurrentState(state: Partial<CardState>): void {
		this.currentState = Utils.toFullCardState(state)
	}
	getInitialState(): CardState {return this.initialState}
	setInitialState(state: Partial<CardState>): void {
		this.initialState = Utils.toFullCardState(state)
		this.resetStateToInitial()
	}
}
