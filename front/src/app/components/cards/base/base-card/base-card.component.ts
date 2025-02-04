import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, DoCheck, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardState } from '../../../../models/cards/card-cost.model';
import { Utils } from '../../../../utils/utils';

@Component({
  selector: 'app-base-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-card.component.html',
  styleUrl: './base-card.component.scss'
})
export abstract class BaseCardComponent implements OnInit, OnChanges, DoCheck {
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
	}
	ngDoCheck(): void {
		if(this.initialized===false){return}
		if(this.initialState!=undefined){this.resetCardState}
		if(this.stateFromParent!=undefined){this.changeStateFromParent()}
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
		console.log("reset card state called")
		if(this.initialState?.activable){this.state.activable=this.initialState.activable}else{this.state.activable=false}
		if(this.initialState?.playable){this.state.playable=this.initialState.playable}else{this.state.playable=false}
		if(this.initialState?.ignoreCost){this.state.ignoreCost=this.initialState.ignoreCost}else{this.state.ignoreCost=false}

		if(this.initialState?.selectable){this.state.selectable=this.initialState.selectable}else{this.state.selectable=false}
		if(this.initialState?.selected){this.state.selected=this.initialState.selected}else{this.state.selected=false}

		if(this.initialState?.upgradable){this.state.upgradable=(this.initialState.upgradable)}else{this.state.upgradable=false}
		if(this.initialState?.upgraded){this.state.upgraded=this.initialState.upgraded}else{this.state.upgraded=false}
	}

	changeStateFromParent():void{
		if(!this.state || !this.stateFromParent){return}

		if(this.stateFromParent.activable!=undefined){this.state.activable=Utils.jsonCopy(this.stateFromParent.activable)}
		if(this.stateFromParent.playable!=undefined){this.state.playable=Utils.jsonCopy(this.stateFromParent.playable)}
		if(this.stateFromParent.selectable!=undefined){this.state.selectable=Utils.jsonCopy(this.stateFromParent.selectable)}
		if(this.stateFromParent.selected!=undefined){this.state.selected=Utils.jsonCopy(this.stateFromParent.selected)}
		if(this.stateFromParent.upgradable!=undefined){this.state.upgradable=Utils.jsonCopy(this.stateFromParent.upgradable)}
		if(this.stateFromParent.upgraded!=undefined){this.state.upgraded=Utils.jsonCopy(this.stateFromParent.upgraded)}
	}
}
