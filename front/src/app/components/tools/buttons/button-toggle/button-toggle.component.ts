import { Component, Input } from '@angular/core';
import { ToggleButton } from '../../../../models/core-game/button.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-toggle',
  imports: [CommonModule],
  templateUrl: './button-toggle.component.html',
  styleUrl: './button-toggle.component.scss'
})
export class ButtonToggleComponent {
	@Input() button!: ToggleButton

	onClick(){
		this.button.value = !this.button.value
	}
	getToggleClass(): string {
		return 'toggle-' + this.button.value
	}
}
