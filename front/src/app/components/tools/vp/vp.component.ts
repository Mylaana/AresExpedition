import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vp',
  imports: [CommonModule],
  templateUrl: './vp.component.html',
  styleUrl: './vp.component.scss'
})
export class VpComponent {
	@Input() vpNumber!: string
  	@Input() shape: 'round' | 'square' = 'round'
}
