import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CarouselButton, NonEventButton } from '../../../../models/core-game/button.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';
import { ButtonDesigner } from '../../../../factory/button-designer.service';

@Component({
  selector: 'app-button-carousel',
  imports: [
	CommonModule,
	ButtonComponent
  ],
  templateUrl: './button-carousel.component.html',
  styleUrl: './button-carousel.component.scss'
})
export class ButtonCarouselComponent implements OnInit{
	@Input() button!: CarouselButton
	@Output() valueChanged = new EventEmitter<string>()

	_left!: NonEventButton
	_right!: NonEventButton

	ngOnInit(): void {
		this._left = ButtonDesigner.createNonEventButton('carouselLeft')
		this._right = ButtonDesigner.createNonEventButton('carouselRight')
	}
	onLeftClick(){
		this.changeValue(-1)
	}
	onRightClick(){
		this.changeValue(1)
	}
	private changeValue(change: number){
		let currentIndex: number = this.getCurrentIndex()
		this.button.value = this.getNewValue(currentIndex + change)
		this.valueChanged.emit(this.button.value)
	}
	private getNewValue(newIndex: number): string {
		switch(true){
			case(newIndex < 0):{
				return this.button.valueList[this.button.valueList.length - 1]
			}
			case(newIndex > this.button.valueList.length - 1):{
				return this.button.valueList[0]
			}
			default:{
				return this.button.valueList[newIndex]
			}
		}
	}
	private getCurrentIndex(): number {
		for(let i=0; i<this.button.valueList.length; i++){
			if(this.button.value===this.button.valueList[i]){
				return i
			}
		}
		return 0
	}
}
