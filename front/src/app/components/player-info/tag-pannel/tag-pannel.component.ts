import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCardComponent } from '../tag-card/tag-card.component';
import { TagState } from '../../../interfaces/global.interface';

@Component({
  selector: 'app-tag-pannel',
  standalone: true,
  imports: [
    CommonModule,
    TagCardComponent
  ],
  templateUrl: './tag-pannel.component.html',
  styleUrl: './tag-pannel.component.scss'
})
export class TagPannelComponent {
  @Input() playerId!: number;
  @Input() tagState!: TagState[];
  
  ngOnInit(): void {

  }
}
