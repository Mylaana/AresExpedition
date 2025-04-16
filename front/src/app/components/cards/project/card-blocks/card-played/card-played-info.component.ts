import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';

@Component({
  selector: 'app-card-played-info',
  standalone: true,
  imports: [
	CommonModule,
	TextWithImageComponent
  ],
  templateUrl: './card-played-info.component.html',
  styleUrl: './card-played-info.component.scss'
})
export class CardPlayedInfoComponent {
	@Input() playedText!: string
}
