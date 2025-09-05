import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputRuleType } from '../../../types/global.type';
import { InputRule } from '../../../interfaces/global.interface';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [
	CommonModule,
	FormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements OnInit{
	@Input() inputRule!: InputRule
	@Output() inputValue = new EventEmitter<any>()
	_valueString: string = ''
	_valueNumber: number = 0
	_minValue!: number
	_maxValue!: number
	_inputType!: InputRuleType
	ngOnInit(): void {
		this._inputType = this.inputRule.type
		switch(this._inputType){
			case('number'):{
				this.intitializeNumericType()
				break
			}
		}
	}
	private intitializeNumericType(){
		this._minValue = this.inputRule.numberMin??0
		this._maxValue = this.inputRule.numberMax??10000
		this._valueNumber = this._minValue
	}
	onFieldUpdate(){
		switch(this._inputType){
			case('number'):{
				let v: number = Number(isNaN(this._valueNumber)?0:this._valueNumber)
				this._valueNumber = Math.max(Math.min(this._maxValue, v), this._minValue)
				this.inputValue.emit(this._valueNumber)
				break
			}
			default:{return}
		}
	}
}
