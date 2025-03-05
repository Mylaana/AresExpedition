import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, DoCheck, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStateModel } from '../../../../models/cards/card-state.model';
import { CardState } from '../../../../interfaces/card.interface';

@Component({
  selector: 'app-base-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-card.component.html',
  styleUrl: './base-card.component.scss'
})
export abstract class BaseCardComponent implements OnInit, OnChanges{
	@Input() initialState?: Partial<CardState>
	@Input() stateFromParent?: Partial<CardState>
	state = new CardStateModel
	@Output() cardStateChange: EventEmitter<any> = new EventEmitter<any>()

	private _loaded: boolean = false

	ngOnInit(): void {
		if(this.initialState){
			this.state.setInitialState(this.initialState)
			this.state.resetStateToInitial()
		}
		if(this.stateFromParent){
			this.state.setCurrentState(this.stateFromParent)
			this.changeStateFromParent()
		}
		this._loaded = true
	}
	ngOnChanges(changes: SimpleChanges) {
		if(!this._loaded){return}
		if (changes['initialState'] && changes['initialState'].currentValue) {
			this.state.resetStateToInitial()
		}
		if (changes['stateFromParent'] && changes['stateFromParent'].currentValue) {
			this.changeStateFromParent()
		}
	}
	changeStateFromParent():void{
		if(!this.stateFromParent){return}
		this.state.setCurrentState(this.stateFromParent)
	}
}
