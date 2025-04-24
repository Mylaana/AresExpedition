import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ocean-card',
    imports: [CommonModule],
    templateUrl: './ocean-card.component.html',
    styleUrl: './ocean-card.component.scss'
})
export class OceanCardComponent {
	@Input() currentStep = 0
	@Input() addEop = 0
	_maxStep = 9
	_progressionList = [1,2,3,4,5,6,7,8,9]
}
