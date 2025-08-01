import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AwardsEnum } from '../../../enum/global.enum';
import { AwardCardComponent } from '../award-card/award-card.component';
import { VpComponent } from '../../tools/vp/vp.component';
import { AwardCard } from '../../../interfaces/global.interface';

@Component({
  selector: 'app-award-pannel',
  imports: [
	CommonModule,
	AwardCardComponent,
  ],
  templateUrl: './award-pannel.component.html',
  styleUrl: './award-pannel.component.scss'
})
export class AwardPannelComponent {
	@Input() awards!: AwardCard[]
}
