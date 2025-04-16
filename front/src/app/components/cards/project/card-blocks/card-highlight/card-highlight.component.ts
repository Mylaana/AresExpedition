import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProjectListSubType } from '../../../../../types/project-card.type';

@Component({
  selector: 'app-card-highlight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-highlight.component.html',
  styleUrl: './card-highlight.component.scss'
})
export class CardHighlightComponent {
	@Input() highlightStyle: ProjectListSubType = 'none'
}
