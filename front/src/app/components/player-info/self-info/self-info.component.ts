import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlayerPannelComponent } from '../player-pannel/player-pannel.component';

@Component({
  selector: 'app-self-info',
  standalone: true,
  imports: [
    CommonModule,
    PlayerPannelComponent    
  ],
  templateUrl: './self-info.component.html',
  styleUrl: './self-info.component.scss'
})
export class SelfInfoComponent {

}
