import { Component, Input, OnInit } from '@angular/core';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { GlobalParameterColor, GlobalParameterName } from '../../../types/global.type';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-global-parameter-card',
	standalone: true,
	imports: [
		CommonModule,
		TextWithImageComponent
	],
	templateUrl: './global-parameter-card.component.html',
	styleUrl: './global-parameter-card.component.scss'
})
export class GlobalParameterCardComponent implements OnInit {
	@Input() parameter!: GlobalParameterName
	_maxStep: number = 0
	_currentStep: number = 5
	_progressionList!: number[]

	ngOnInit(): void {
		switch(this.parameter){
			case('ocean'):{
				this._progressionList = [1, 2, 3, 4, 5, 6, 7, 8, 9]
				this._maxStep = this._progressionList.length
				break
			}
			case('oxygen'):{
				this._progressionList = [0, .01, .02, .03, .04, .05, .06, .07, .08, .09, .1, .11, .12, .13, .14]
				this._maxStep = this._progressionList.length
				break
			}
			case('infrastructure'):{
				this._progressionList = [0, .07, .14, .27, .28, .35, .42, .49, .56, .63, .70, .77, .85, .92, 1]
				this._maxStep = this._progressionList.length
				break
			}
			case('temperature'):{
				this._progressionList = [-30, -28, -26, -24, -22, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8]
				this._maxStep = this._progressionList.length
			}
		}
	}
	getStepColor(stepCount: number): GlobalParameterColor {
		switch(this.parameter){
			case('oxygen'):{
				switch(true){
					case(stepCount <= .02):{return 'purple'}
					case(stepCount <= .06):{return 'red'}
					case(stepCount <= .11):{return 'yellow'}
					default:{return 'white'}
				}
			}
			case('infrastructure'):{
				switch(true){
					case(stepCount <= .14):{return 'purple'}
					case(stepCount <= .49):{return 'red'}
					case(stepCount <= .77):{return 'yellow'}
					default:{return 'white'}
				}
			}
			case('temperature'):{
				switch(true){
					case(stepCount <= -20):{return 'purple'}
					case(stepCount <= -10):{return 'red'}
					case(stepCount <= 0):{return 'yellow'}
					default:{return 'white'}
				}
			}
			default:{return 'purple'}
		}
	}
	getCurrentStepColor(): GlobalParameterColor {
		return this.getStepColor(this._progressionList[this._currentStep])
	}
}
