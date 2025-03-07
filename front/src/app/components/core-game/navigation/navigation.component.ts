import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerPannelComponent } from '../../player-info/player-pannel/player-pannel.component';
import { expandCollapseVertical, fadeIn } from '../../animations/animations';
import { AnimationEvent } from '@angular/animations';
import { GlobalParameterPannelComponent } from '../../player-info/global-parameter-pannel/global-parameter-pannel.component';

@Component({
	selector: 'app-navigation',
	standalone: true,
	imports: [
		CommonModule,
		PlayerPannelComponent,
		GlobalParameterPannelComponent
	],
	templateUrl: './navigation.component.html',
	styleUrl: './navigation.component.scss',
	animations: [expandCollapseVertical, fadeIn]
})
export class NavigationComponent implements OnInit, AfterViewInit{
	@Input() isScrolled: boolean = false
	@Input() clientPlayerId!: number
	_playerIdList: number[] = []
	_playerPannelIsHovered: boolean = false

	constructor(
				private elRef: ElementRef,
				private gameStateService: GameState
			){}

	ngOnInit(): void {
		this.gameStateService.currentPlayerCount.subscribe(
			playerCount => this.updatePlayerList(playerCount)
		)
	}

	ngAfterViewInit(): void {
		const navbar = this.elRef.nativeElement.querySelector('animated')
		if (navbar) {
			navbar.addEventListener('transitionend', () => {
			  	this.updateNavHeight()
			});

			this.updateNavHeight();
		}

	}
	onAnimationDone(event: AnimationEvent) {
		this.updateNavHeight();
	  }

	updateNavHeight(): void {
		const navbar = this.elRef.nativeElement.querySelector('#nav')
		if (navbar && navbar.offsetHeight) {
		  const navbarHeight = navbar.offsetHeight;
		  document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
		}
	}
	updatePlayerList(playerIdList: number[]){
		this._playerIdList = playerIdList
		this.updateNavHeight()
	}
}
