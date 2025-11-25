import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PlayerPannelComponent } from '../../../player-info/player-pannel/player-pannel.component';
import { expandCollapseVertical, fadeIn, fadeInFadeOut } from '../../../../animations/animations';
import { AnimationEvent } from '@angular/animations';
import { GlobalParameterPannelComponent } from '../../../player-info/global-parameter-pannel/global-parameter-pannel.component';
import { Subject, takeUntil } from 'rxjs';
import { GameContentName, myUUID } from '../../../../types/global.type';
import { MilestoneAndAwardComponent } from '../../../player-info/milestone-and-award/milestone-and-award.component';
import { NavigationGameInfoComponent } from '../navigation-game-info/navigation-game-info.component';
import { GameActiveContentService } from '../../../../services/core-game/game-active-content.service';
import { NonSelectablePhaseEnum } from '../../../../enum/phase.enum';
import { PlayerReadyModel } from '../../../../models/player-info/player-state.model';
import { GroupWaitingComponent } from '../../../game-event-blocks/group-waiting/group-waiting.component';
import { GameStateFacadeService } from '../../../../services/game-state/game-state-facade.service';

@Component({
    selector: 'app-navigation',
    imports: [
        CommonModule,
        PlayerPannelComponent,
        GlobalParameterPannelComponent,
		MilestoneAndAwardComponent,
		NavigationGameInfoComponent,
		GroupWaitingComponent,
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    animations: [expandCollapseVertical, fadeIn, fadeInFadeOut]
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy{
	@Input() isScrolled: boolean = false
	@Input() clientPlayerId!: myUUID
	@Input() gameOver!: boolean
	_playerIdList: myUUID[] = []
	_playerPannelIsHovered: boolean = false
	_groupReady!: PlayerReadyModel[]
	_currentScrollY: number =0
	private destroy$ = new Subject<void>()
	private currentPhase: NonSelectablePhaseEnum = NonSelectablePhaseEnum.planification;

	constructor(
		private elRef: ElementRef,
		private gameStateService: GameStateFacadeService,
		private gameContentService: GameActiveContentService
	){}

	ngOnInit(): void {
		this.gameStateService.currentPlayerCount.pipe(takeUntil(this.destroy$)).subscribe(playerCount => this.updatePlayerList(playerCount))
		this.gameStateService.currentPhase.pipe(takeUntil(this.destroy$)).subscribe(phase => this.currentPhase = phase)
		this.gameStateService.currentGroupPlayerReady.pipe(takeUntil(this.destroy$)).subscribe((groupReady) => this._groupReady = groupReady)
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
	displayGroupReady(): boolean {
		if(this._currentScrollY!=0){return false}
		if(this.currentPhase===NonSelectablePhaseEnum.action){return false}
		if(this.gameStateService.getClientReady()===true){return false}
		for(let p of this._groupReady){
			if(p.isReady){return true}
		}
		return false
	}
	@HostListener('window:scroll')
	onScroll(){
		this._currentScrollY = window.pageYOffset
	}
}
