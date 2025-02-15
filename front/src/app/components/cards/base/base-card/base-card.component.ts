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
export abstract class BaseCardComponent implements OnInit, OnChanges, DoCheck {
	@Input() initialState?: Partial<CardState>
	@Input() stateFromParent?: Partial<CardState>
	state = new CardStateModel
	@Output() cardStateChange: EventEmitter<any> = new EventEmitter<any>()

	ngOnInit(): void {}
	ngOnChanges(changes: SimpleChanges) {
		if (changes['initialState'] && changes['initialState'].currentValue) {
			this.state.resetStateToInitial()
		}
	}
	ngDoCheck(): void {
		if(this.initialState!=undefined){this.state.resetStateToInitial()}
		if(this.stateFromParent!=undefined){this.changeStateFromParent()}
	}

	changeStateFromParent():void{
		if(!this.stateFromParent){return}
		this.state.setCurrentState(this.stateFromParent)
	}
}
