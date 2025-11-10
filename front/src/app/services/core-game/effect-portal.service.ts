import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../game-state/game-state-facade.service";
import { EffectPortalEnum } from "../../enum/global.enum";
import { EffectPortalButton} from "../../models/core-game/button.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { ButtonDesigner } from "../../factory/button-designer.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";
import { EFFECT_PORTAL, EFFECT_PORTAL_ENUM_TO_CARD_CODE, EFFECT_PORTAL_ENUM_TO_EFFECT_CODE } from "../../maps/playable-card-portal-maps";


@Injectable()
export class EffectPortalService {
    buttons!: EffectPortalButton[]
    private portal!: EffectPortalEnum
    private portalCard!: PlayableCardModel

	private clientState!: PlayerStateModel

    constructor(
        private gameStateService: GameStateFacadeService
    ){}
    initialize(portal: EffectPortalEnum): void{
        this.portal = portal
        let cards = this.gameStateService.getClientProjectPlayedModelList()
        if(!cards){return}
        this.portalCard =  cards.filter((e) => e.cardCode===EFFECT_PORTAL_ENUM_TO_CARD_CODE[portal])[0]
		this.updateButtons()
    }
	updateButtons(){
		if(this.portal===undefined){return}
		this.buttons = ButtonDesigner.createPortalButtonSet(EFFECT_PORTAL_ENUM_TO_EFFECT_CODE[this.portal], this.clientState)
	}
	onStateUpdate(state: PlayerStateModel){
		this.clientState = state
		this.updateButtons()
	}
    getPortalCard(): PlayableCardModel | undefined {
        return this.portalCard
    }
    getButtons(): EffectPortalButton[]{
        return this.buttons
    }
    resolveButtonClicked(button: EffectPortalButton){
        let newEvents: EventBaseModel[] = EFFECT_PORTAL[this.portalCard.cardCode](button.effect)
        if(newEvents.length===0){return}
        this.gameStateService.addEventQueue(newEvents, 'first')
    }
}
