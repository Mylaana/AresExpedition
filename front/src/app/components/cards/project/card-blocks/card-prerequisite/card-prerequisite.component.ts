import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TextWithImageComponent } from '../../../../tools/text-with-image/text-with-image.component';

@Component({
  selector: 'app-card-prerequisite',
  standalone: true,
  imports: [
	CommonModule,
	TextWithImageComponent
	],
  templateUrl: './card-prerequisite.component.html',
  styleUrl: './card-prerequisite.component.scss'
})
export class CardPrerequisiteComponent {
	@Input() prerequisiteText!: string
	@Input() prerequisiteSummary?: string
	@Input() prerequisiteTresholdType!: any
}
