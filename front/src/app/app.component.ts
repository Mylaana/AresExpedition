import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WebsocketHandler } from './models/core-game/websocket-handler';
import { expandCollapseVertical, fadeIn, fadeInFadeOut } from './animations/animations';
import { RouterOutlet } from '@angular/router';
import { ButtonDesigner } from './factory/button-designer.service';
import { NonEventButtonComponent } from './components/tools/button/non-event-button.component';
import { NonEventButton } from './models/core-game/button.model';
import { Router } from '@angular/router';
import {} from '@angular/common/http';
import { ROUTE_CARD_OVERVIEW, ROUTE_CREATEGAME, ROUTE_NEWGAMELINKS } from './global/global-const';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        NonEventButtonComponent
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
	_home = ButtonDesigner.createNonEventButton('routeHome')

	constructor(private router: Router){}

	onClick(button: NonEventButton): void {
		console.log(button)
		if(button===this._home){
			this.router.navigate([''])
		}
	}
	displayHomeButton(): boolean {
		switch(this.router.url.substring(1)){
			case(ROUTE_CARD_OVERVIEW):case(ROUTE_CREATEGAME):case(ROUTE_NEWGAMELINKS):{return true}
			default:{return false}
		}
	  }
}
