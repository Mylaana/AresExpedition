import { Component, Output, Input, EventEmitter, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonBase, ColorButton, ImageButton } from '../../../models/core-game/button.model';
import { TextWithImageComponent } from '../text-with-image/text-with-image.component';
import { PlayerColor } from '../../../types/global.type';

type shape = 'hex' | 'hex_floating'| 'small' | 'large' | 'left' | 'right' | 'action' | 'selection_rounded_square'
type style = 'plain' | 'floating'  | 'transparent'

@Component({
    selector: 'app-button',
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
	@Input() selected!: boolean;
	_imageUrl!: string
	_caption!: string
	private hovered: boolean = false
	_style: style ='plain'
	_color: PlayerColor

	ngOnInit(): void {
		switch(this.shape){
			case('hex_floating'):case('action'):{this._style='floating'; break}
			case('selection_rounded_square'):{this._style='transparent'; break}
			default:{this._style='plain'}
		}
	}
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['button'] && changes['button'].currentValue){
			this._caption =  this.button.caption??''
			switch(this.button.type){
				case('image'):{
					this.handleImageButtonChange()
					break
				}
				case('color'):{
					this.handleColorButtonChange()
					break
				}
			}
		}
	}
	onClick(button: ButtonBase){
		this.buttonClicked.emit(button)
	}
	isHovered(): boolean {
		if(this.button.locked){return false}
		return this.hovered
	}
	setHovered(hovered: boolean){
		this.hovered = hovered
	}
	isEnabled(): boolean {
		if(this.button.locked){return false}
		return this.button.enabled
	}
	private handleImageButtonChange(){
		let imageButton = this.button as ImageButton
		this._imageUrl = imageButton.imageUrl
	}
	private handleColorButtonChange(){
		let ColorButton = this.button as ColorButton
		this._color = ColorButton.color
	}
}
