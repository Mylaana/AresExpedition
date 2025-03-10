import { Component, Output, Input, EventEmitter, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonBase, ImageButton } from '../../../models/core-game/button.model';
import { TextWithImageComponent } from '../text-with-image/text-with-image.component';

type shape = 'hex' | 'hex_floating'| 'small' | 'large' | 'left' | 'right' | 'action'
type style = 'plain' | 'transparent'

@Component({
	selector: 'app-button',
	standalone: true,
	imports: [
		CommonModule,
		TextWithImageComponent,
	],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnChanges {
	@Output() buttonClicked: EventEmitter<ButtonBase> = new EventEmitter<ButtonBase>()
	@Input() button!: ButtonBase;
	@Input() shape: shape = 'hex'
	_imageUrl!: string
	_caption!: string
	_isHovered: boolean = false
	_style: style ='plain'

	ngOnInit(): void {
		this._style = ['hex_floating','action'].includes(this.shape)?'transparent':'plain'
	}
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['button'] && changes['button'].currentValue){
			this._caption =  this.button.caption??''
			switch(this.button.type){
				case('Image'):{
					this.handleImageButtonChange()
					break
				}
			}
		}
	}
	onClick(button: ButtonBase){
		this.buttonClicked.emit(button)
	}

	private handleImageButtonChange(){
		let imageButton = this.button as ImageButton
		this._imageUrl = imageButton.imageUrl
	}
}
