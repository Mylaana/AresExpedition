import { Component, Input, OnInit } from '@angular/core';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { GlobalParameterName } from '../../../types/global.type';
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
	_currentStep: number = 7
	_progressionList!: number[]

	ngOnInit(): void {
		switch(this.parameter){
			case('ocean'):{
				this._progressionList = [1, 2, 3, 4, 5, 6, 7, 8, 9]
				this._maxStep = this._progressionList.length
				break
			}
			case('oxygen'):{
				this._progressionList = [.01, .02, .03, .04, .05, .06, .07, .08, .09, .1, .11, .12, .13, .14]
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
}
