import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WebsocketHandler } from './models/core-game/websocket-handler';
import { expandCollapseVertical, fadeIn, fadeInFadeOut } from './animations/animations';

import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
    CommonModule,
	RouterOutlet
],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	animations: [expandCollapseVertical, fadeIn, fadeInFadeOut],
	providers: [
		WebsocketHandler
	]
})
export class AppComponent {
	title = 'AresExpedition';

}
