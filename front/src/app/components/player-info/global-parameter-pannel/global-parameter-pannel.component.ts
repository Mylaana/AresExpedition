import { Component } from '@angular/core';
import { GlobalParameterCardComponent } from '../global-parameter-card/global-parameter-card.component';
import { CommonModule } from '@angular/common';
import { OceanCardComponent } from '../ocean-card/ocean-card.component';

@Component({
	selector: 'app-global-parameter-pannel',
	standalone: true,
	imports: [
		CommonModule,
		GlobalParameterCardComponent,
		OceanCardComponent
	],
	templateUrl: './global-parameter-pannel.component.html',
	styleUrl: './global-parameter-pannel.component.scss'
})
export class GlobalParameterPannelComponent {
	_dummyId = [0, 1, 2, 3]
}
