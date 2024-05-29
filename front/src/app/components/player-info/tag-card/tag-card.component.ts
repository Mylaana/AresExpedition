import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCardModel } from '../../../models/player-info/tag-card.model';


@Component({
  selector: 'app-tag-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-card.component.html',
  styleUrl: './tag-card.component.scss'
})
export class TagCardComponent {
  @Input() tagCard!: TagCardModel;
}
