import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../../models/cards/card-cost.model';
import { deepCopy } from '../../../../functions/global.functions';

@Component({
  selector: 'app-base-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-card.component.html',
  styleUrl: './base-card.component.scss'
})
export abstract class BaseCardComponent implements OnInit, OnChanges {
	@Input() initialState?: CardState;
	@Input() stateFromParent?: CardState
	state!: CardState;
	@Output() cardStateChange: EventEmitter<any> = new EventEmitter<any>()

	initialized = false

	ngOnInit():void{
		this.initializeCardState()
		this.resetCardState()
		this.changeStateFromParent()
		this.initialized = true
	}

	ngOnChanges(changes: SimpleChanges) {
		if(this.initialized===false){return}
		if (changes['initialState'] && changes['initialState'].currentValue) {
			this.resetCardState()
		}
		if (changes['stateFromParent'] && changes['stateFromParent'].currentValue) {
			this.changeStateFromParent()
		}
	}

	initializeCardState():void{
		this.state = {
			activable: false,
			playable:false,
			selectable:false,
			selected:false,
			upgradable:false,
			upgraded:false,
			ignoreCost:false
		}
	}

	resetCardState(): void {
		if(!this.state){return}

		if(this.initialState?.activable){this.state.activable=deepCopy(this.initialState.activable)}else{this.state.activable=false}
		if(this.initialState?.playable){this.state.playable=deepCopy(this.initialState.playable)}else{this.state.playable=false}
		if(this.initialState?.ignoreCost){this.state.ignoreCost=deepCopy(this.initialState.ignoreCost)}else{this.state.ignoreCost=false}

		if(this.initialState?.selectable){this.state.selectable=deepCopy(this.initialState.selectable)}else{this.state.selectable=false}
		if(this.initialState?.selected){this.state.selected=deepCopy(this.initialState.selected)}else{this.state.selected=false}

		if(this.initialState?.upgradable){this.state.upgradable=deepCopy(this.initialState.upgradable)}else{this.state.upgradable=false}
		if(this.initialState?.upgraded){this.state.upgraded=deepCopy(this.initialState.upgraded)}else{this.state.upgraded=false}
	}

	changeStateFromParent():void{
		if(!this.state){return}

		if(this.stateFromParent?.activable){this.state.activable=deepCopy(this.stateFromParent.activable)}
		if(this.stateFromParent?.playable!=undefined){this.state.playable=deepCopy(this.stateFromParent.playable)}
		if(this.stateFromParent?.selectable){this.state.selectable=deepCopy(this.stateFromParent.selectable)}
		if(this.stateFromParent?.selected){this.state.selected=deepCopy(this.stateFromParent.selected)}
		if(this.stateFromParent?.upgradable){this.state.upgradable=deepCopy(this.stateFromParent.upgradable)}
		if(this.stateFromParent?.upgraded){this.state.upgraded=deepCopy(this.stateFromParent.upgraded)}
	}
}
