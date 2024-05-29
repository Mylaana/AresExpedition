import { Component } from '@angular/core';
import { RessourcePannelComponent } from '../ressource-pannel/ressource-pannel.component';
import { TagPannelComponent } from '../tag-pannel/tag-pannel.component';

@Component({
  selector: 'app-player-pannel',
  standalone: true,
  imports: [
    RessourcePannelComponent,
    TagPannelComponent
  ],
  templateUrl: './player-pannel.component.html',
  styleUrl: './player-pannel.component.scss'
})
export class PlayerPannelComponent {

}
