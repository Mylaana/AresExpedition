import { Component } from '@angular/core';
import { TagCardComponent } from '../tag-card/tag-card.component';

@Component({
  selector: 'app-tag-pannel',
  standalone: true,
  imports: [TagCardComponent],
  templateUrl: './tag-pannel.component.html',
  styleUrl: './tag-pannel.component.scss'
})
export class TagPannelComponent {

}
