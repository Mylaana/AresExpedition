import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, DoCheck, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStateModel } from '../../../../models/cards/card-state.model';
import { CardState } from '../../../../interfaces/card.interface';
import { SettingCardSize } from '../../../../types/global.type';
import { GameParamService } from '../../../../services/core-game/game-param.service';

@Component({
    selector: 'app-base-card',
    imports: [CommonModule],
    templateUrl: './base-card.component.html',
    styleUrl: './base-card.component.scss'
})
export abstract class BaseCardComponent implements OnInit, OnChanges{
	@Input() size!: SettingCardSize
	@Input() initialState?: Partial<CardState>
	@Input() stateFromParent?: Partial<CardState>
	state = new CardStateModel
	@Output() cardStateChange: EventEmitter<any> = new EventEmitter<any>()

	protected _loaded: boolean = false

	ngOnInit(): void {
		if(this.initialState){
			this.state.setInitialState(this.initialState)
			this.state.resetStateToInitial()
		}
		if(this.stateFromParent){
			this.state.setCurrentState(this.stateFromParent)
			this.changeStateFromParent()
		}
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
