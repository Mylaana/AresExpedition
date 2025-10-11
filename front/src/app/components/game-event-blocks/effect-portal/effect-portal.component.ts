import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EffectPortalEnum } from '../../../enum/global.enum';
import { EventBaseModel, EventGeneric } from '../../../models/core-game/event.model';
import { CommonModule } from '@angular/common';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { EffectPortalButton, NonEventButton } from '../../../models/core-game/button.model';
import { EffectPortalService } from '../../../services/core-game/effect-portal.service';
import { PortalEffectButtonComponent } from '../../tools/button/portal-effect-button.component';
import { GameState } from '../../../services/core-game/game-state.service';
import { PlayerStateModel } from '../../../models/player-info/player-state.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-effect-portal',
	imports: [
		CommonModule,
		PlayableCardListComponent,
		PortalEffectButtonComponent,
	],
	providers: [EffectPortalService],
	templateUrl: './effect-portal.component.html',
	styleUrl: './effect-portal.component.scss'
})
export class EffectPortalComponent implements OnInit, OnChanges{
	@Input() event!: EventBaseModel

	_portal!: EffectPortalEnum
	_portalCard!: PlayableCardModel | undefined
	_buttons!: EffectPortalButton[]
	private eventId!: number
	private destroy$ = new Subject<void>

	constructor(
		private portalService: EffectPortalService,
		private gameStateService: GameState
	){}
	ngOnInit(): void {
		this.gameStateService.currentClientState.pipe(takeUntil(this.destroy$)).subscribe((state) => this.updateClientState(state))
		this.initializePortal()
	}
	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes['event'] && changes['event'].currentValue) {
			if(this.event.id===this.eventId || !this.eventId){return}
			this.initializePortal()
		}
	}
	private initializePortal(){
		if(!this.event){return}
		let event: EventGeneric = this.event as EventGeneric
		if(event.effectPortal===undefined){return}
		this._portal = event.effectPortal
		this.portalService.initialize(this._portal)
		this.loadPortal()
		this.eventId = event.id
	}
	updateClientState(state: PlayerStateModel){
		this.portalService.onStateUpdate(state)
		this._buttons = this.portalService.buttons
	}
	loadPortal(){
		this._portalCard = this.portalService.getPortalCard()
		this._buttons = this.portalService.buttons
	}
	onButtonClicked(button: EffectPortalButton){
		this.event.finalized = true
		this.portalService.resolveButtonClicked(button)
	}
}
