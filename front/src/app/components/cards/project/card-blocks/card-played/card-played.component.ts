import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';

@Component({
  selector: 'app-card-played',
  standalone: true,
  imports: [
	CommonModule,
	TextWithImageComponent
  ],
  templateUrl: './card-played.component.html',
  styleUrl: './card-played.component.scss'
})
export class CardPlayedComponent {
	@Input() playedText!: string
}
