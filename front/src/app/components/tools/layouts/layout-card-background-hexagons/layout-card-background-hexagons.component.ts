import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutHexagonsComponent } from '../layout-hexagons/layout-hexagons.component';

@Component({
  selector: 'app-layout-card-background-hexagons',
  standalone: true,
  imports: [
    LayoutHexagonsComponent
  ],
  templateUrl: './layout-card-background-hexagons.component.html',
  styleUrl: './layout-card-background-hexagons.component.scss'
})
export class LayoutCardBackgroundHexagonsComponent {

}
