import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../../services/designers/button-designer.service';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn } from '../../../../animations/animations';
import { EXTERNAL_LINK_FRYXGAMES, ROUTE_CARD_OVERVIEW, ROUTE_CREATEGAME } from '../../../../global/global-const';


@Component({
    selector: 'app-home',
    imports: [
        NonEventButtonComponent,
        HexedBackgroundComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    animations: [fadeIn]
})
export class HomeComponent {

	_newGameButton: NonEventButton = ButtonDesigner.createNonEventButton('routeCreateGame')
	_cardOverviewButton: NonEventButton = ButtonDesigner.createNonEventButton('routeCardOverview')
	_buyGame: NonEventButton = ButtonDesigner.createNonEventButton('routeBuy')

	constructor(private router: Router){}

	onClick(button: NonEventButton): void {
		switch(button.name){
			case('routeCreateGame'):{
				this.router.navigate([ROUTE_CREATEGAME])
				break
			}
			case('routeCardOverview'):{
				this.router.navigate([ROUTE_CARD_OVERVIEW])
				break
			}
			case('routeBuy'):{
				window.location.href = EXTERNAL_LINK_FRYXGAMES
			}
		}
	}
}
