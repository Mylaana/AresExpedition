import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SelfInfoComponent } from './self-info/self-info.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SelfInfoComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front';
}
