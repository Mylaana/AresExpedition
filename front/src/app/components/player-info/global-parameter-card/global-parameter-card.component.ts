import { Component, Input, OnInit } from '@angular/core';
import { TextWithImageComponent } from '../../tools/text-with-image/text-with-image.component';
import { GlobalParameterColor } from '../../../types/global.type';
import { CommonModule } from '@angular/common';
import { GlobalParameterNameEnum } from '../../../enum/global.enum';

@Component({
    selector: 'app-global-parameter-card',
    imports: [
        CommonModule,
        TextWithImageComponent
    ],
    templateUrl: './global-parameter-card.component.html',
    styleUrl: './global-parameter-card.component.scss'
})
export class GlobalParameterCardComponent implements OnInit {
	@Input() parameter!: GlobalParameterNameEnum
	@Input() currentStep!: number
	@Input() addEop = 0
	_maxStep!: number
	_progressionList!: number[]

	ngOnInit(): void {
		switch(this.parameter){
			case(GlobalParameterNameEnum.ocean):{
				this._progressionList = [1, 2, 3, 4, 5, 6, 7, 8, 9]
				this._maxStep = this._progressionList.length
				break
			}
			case(GlobalParameterNameEnum.oxygen):{
				this._progressionList = [0, .01, .02, .03, .04, .05, .06, .07, .08, .09, .1, .11, .12, .13, .14]
				this._maxStep = this._progressionList.length
				break
			}
			case(GlobalParameterNameEnum.infrastructure):{
				this._progressionList = [0, .07, .14, .27, .28, .35, .42, .49, .56, .63, .70, .77, .85, .92, 1]
				this._maxStep = this._progressionList.length
				break
			}
			case(GlobalParameterNameEnum.temperature):{
				this._progressionList = [-30, -28, -26, -24, -22, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8]
				this._maxStep = this._progressionList.length
			}
		}
	}
	getStepColor(stepCount: number): GlobalParameterColor {
		switch(this.parameter){
			case(GlobalParameterNameEnum.oxygen):{
				switch(true){
					case(stepCount <= .02):{return 'purple'}
					case(stepCount <= .06):{return 'red'}
					case(stepCount <= .11):{return 'yellow'}
					default:{return 'white'}
				}
			}
			case(GlobalParameterNameEnum.infrastructure):{
				switch(true){
					case(stepCount <= .14):{return 'purple'}
					case(stepCount <= .49):{return 'red'}
					case(stepCount <= .77):{return 'yellow'}
					default:{return 'white'}
				}
			}
			case(GlobalParameterNameEnum.temperature):{
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
		return this.getStepColor(this._progressionList[this.currentStep])
	}
	isCurrentStep(bubble: number): boolean {
		return bubble===this._progressionList[this.currentStep]
	}
	isCurrentAddEOP(bubble: number): boolean {
		return this.addEop>0 && bubble===this._progressionList[Math.min(this.currentStep+this.addEop, this._maxStep-1)]
	}
	isFirstOfColor(bubble: number): boolean {
		switch(this.parameter){
			case(GlobalParameterNameEnum.oxygen):{
				switch(bubble){
					case(0):{return true}
					case(0.03):{return true}
					case(0.07):{return true}
					case(0.12):{return true}
					default:{return false}
				}
			}
			case(GlobalParameterNameEnum.infrastructure):{
				switch(bubble){
					case(0):{return true}
					case(.27):{return true}
					case(.56):{return true}
					case(.85):{return true}
					default:{return false}
				}
			}
			case(GlobalParameterNameEnum.temperature):{
				switch(bubble){
					case(-18):{return true}
					case(-8):{return true}
					case(2):{return true}
					default:{return false}
				}
			}
			default:{return false}
		}
	}
	isLastOfColor(bubble: number): boolean {
		switch(this.parameter){
			case(GlobalParameterNameEnum.oxygen):{
				switch(bubble){
					case(0.02):{return true}
					case(0.06):{return true}
					case(0.11):{return true}
					case(0.14):{return true}
					default:{return false}
				}
			}
			case(GlobalParameterNameEnum.infrastructure):{
				switch(bubble){
					case(.14):{return true}
					case(.49):{return true}
					case(.77):{return true}
					case(1):{return true}
					default:{return false}
				}
			}
			case(GlobalParameterNameEnum.temperature):{
				switch(bubble){
					case(-20):{return true}
					case(-10):{return true}
					case(0):{return true}
					case(8):{return true}
					default:{return false}
				}
			}
			default:{return false}
		}
	}
}
