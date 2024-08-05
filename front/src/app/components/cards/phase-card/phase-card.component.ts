import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-phase-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phase-card.component.html',
  styleUrl: './phase-card.component.scss'
})
export class PhaseCardComponent {
	@Input() phaseCardLevel: number = 0;
	@Input() phaseIndex!: number;

	ngOnInit():void {
		if(this.phaseIndex===undefined){this.phaseIndex=0}
	}

	upgrade(): void{
		console.log('upgrade')
	}
}
