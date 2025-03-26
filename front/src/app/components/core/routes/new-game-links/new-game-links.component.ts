import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-game-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-game-links.component.html',
  styleUrl: './new-game-links.component.scss'
})
export class NewGameLinksComponent {
	links: any[] = [];
	options: any
	constructor(private route: ActivatedRoute) {
		this.route.queryParams.subscribe(params => {
		  this.links = params['links'] ? JSON.parse(params['links']) : [];
		  this.options = params['options'] ? JSON.parse(params['options']) : [];
		  console.log('loaded:',this.links, this.options)
		});
	  }
}
