import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerPannelComponent } from '../../player-info/player-pannel/player-pannel.component';
import { expandCollapseVertical } from '../../animations/animations';
import { AnimationEvent } from '@angular/animations';

@Component({
	selector: 'app-navigation',
	standalone: true,
	imports: [
		CommonModule,
		PlayerPannelComponent
	],
	templateUrl: './navigation.component.html',
	styleUrl: './navigation.component.scss',
	animations: [expandCollapseVertical]
})
export class NavigationComponent implements OnInit, OnChanges, AfterViewInit{
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

	ngOnChanges(changes: SimpleChanges): void {
		return
		if (changes['isScrolled'] && changes['isScrolled'].currentValue) {
			setTimeout(() => {
				this.updateNavHeight();
			  }, 1100)
			}
	}
	ngAfterViewInit(): void {
		const navbar = this.elRef.nativeElement.querySelector('animated')
		console.log('afterviewinit', navbar)
		if (navbar) {
			navbar.addEventListener('transitionend', () => {
				console.log('animation end')
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
		  console.log('nav height:', navbarHeight)
		}
	}
	updatePlayerList(playerIdList: number[]){
		this._playerIdList = playerIdList
		this.updateNavHeight()
	}
}
