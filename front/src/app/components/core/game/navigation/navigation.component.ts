import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GameState } from '../../../../services/core-game/game-state.service';
import { PlayerPannelComponent } from '../../../player-info/player-pannel/player-pannel.component';
import { expandCollapseVertical, fadeIn } from '../../../../animations/animations';
import { AnimationEvent } from '@angular/animations';
import { GlobalParameterPannelComponent } from '../../../player-info/global-parameter-pannel/global-parameter-pannel.component';
import { Subject, takeUntil } from 'rxjs';
import { GameContentName, myUUID } from '../../../../types/global.type';
import { MilestoneAndAwardComponent } from '../../../player-info/milestone-and-award/milestone-and-award.component';
import { NavigationGameInfoComponent } from '../navigation-game-info/navigation-game-info.component';
import { GameActiveContentService } from '../../../../services/core-game/game-active-content.service';

@Component({
    selector: 'app-navigation',
    imports: [
        CommonModule,
        PlayerPannelComponent,
        GlobalParameterPannelComponent,
		MilestoneAndAwardComponent,
		NavigationGameInfoComponent
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    animations: [expandCollapseVertical, fadeIn]
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy{
	@Input() isScrolled: boolean = false
	@Input() clientPlayerId!: myUUID
	@Input() gameOver!: boolean
	_playerIdList: myUUID[] = []
	_playerPannelIsHovered: boolean = false
	private destroy$ = new Subject<void>()

	constructor(
		private elRef: ElementRef,
		private gameStateService: GameState,
		private gameContentService: GameActiveContentService
	){}

	ngOnInit(): void {
		this.gameStateService.currentPlayerCount.pipe(takeUntil(this.destroy$)).subscribe(playerCount => this.updatePlayerList(playerCount))
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
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
	updatePlayerList(playerIdList: myUUID[]){
		this._playerIdList = playerIdList
		this.updateNavHeight()
	}
	isClient(playerId: string): boolean {
		return playerId === this.clientPlayerId
	}
	setHovered(hovered: boolean){
		if(this._playerIdList.length===1){this._playerPannelIsHovered=false; return}
		this._playerPannelIsHovered=hovered
	}
	isContentActive(name: GameContentName): boolean {
		return this.gameContentService.isContentActive(name)
	}
}
