import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ocean-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ocean-card.component.html',
  styleUrl: './ocean-card.component.scss'
})
export class OceanCardComponent {
	_maxStep = 9
	_currentStep: number = 2
	_progressionList = [1,2,3,4,5,6,7,8,9]
}
