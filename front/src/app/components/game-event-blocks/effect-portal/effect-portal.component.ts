import { Component, Input, OnInit } from '@angular/core';
import { EffectPortalEnum } from '../../../enum/global.enum';
import { EventBaseModel, EventGeneric } from '../../../models/core-game/event.model';
import { CommonModule } from '@angular/common';
import { PlayableCardListComponent } from '../../cards/project/playable-card-list/playable-card-list.component';
import { PlayableCardModel } from '../../../models/cards/project-card.model';
import { EffectPortalButton, NonEventButton } from '../../../models/core-game/button.model';
import { EffectPortalService } from '../../../services/core-game/effect-portal.service';
import { PortalEffectButtonComponent } from '../../tools/button/portal-effect-button.component';

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
export class EffectPortalComponent implements OnInit{
	@Input() event!: EventBaseModel

	_portal!: EffectPortalEnum
	_portalCard!: PlayableCardModel | undefined
	_buttons!: EffectPortalButton[]

	constructor(private portalService: EffectPortalService){}
	ngOnInit(): void {
		let event: EventGeneric = this.event as EventGeneric
		if(!event.effectPortal){return}
		this._portal = event.effectPortal
		this.portalService.initialize(this._portal)
		this.loadPortal()
	}
	loadPortal(){
		this._portalCard = this.portalService.getPortalCard()
		this._buttons = this.portalService.getButtons()
	}
	onButtonClicked(button: EffectPortalButton){
		this.event.finalized = true
		this.portalService.resolveButtonClicked(button)
	}
}
