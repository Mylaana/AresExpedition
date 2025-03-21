import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NonEventButton } from '../../../../models/core-game/button.model';
import { ButtonDesigner } from '../../../../services/designers/button-designer.service';
import { NonEventButtonComponent } from '../../../tools/button/non-event-button.component';
import { HexedBackgroundComponent } from '../../../tools/layouts/hexed-tooltip-background/hexed-background.component';
import { fadeIn, fadeInFadeOut } from '../../../../animations/animations';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
	NonEventButtonComponent,
	HexedBackgroundComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeIn]
})
export class HomeComponent {

	_newGameButton: NonEventButton = ButtonDesigner.createNonEventButton('routeNewGame')
	_cardOverviewButton: NonEventButton = ButtonDesigner.createNonEventButton('routeCardOverview')
	_buyGame: NonEventButton = ButtonDesigner.createNonEventButton('routeBuy')

	constructor(private router: Router){}

	onClick(button: NonEventButton): void {
		console.log(button)
		switch(button.name){
			case('routeNewGame'):{
				this.router.navigate(['new-game'])
				break
			}
			case('routeCardOverview'):{
				this.router.navigate(['card-overview'])
				break
			}
			case('routeBuy'):{
				window.location.href = 'https://fryxgames.se/'
			}
		}
	}
}
