import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { GameState } from "./game-state.service";
import { EffectPortalEnum } from "../../enum/global.enum";
import { EffectPortalButton} from "../../models/core-game/button.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { EFFECT_ENUM_TO_CODE, EFFECT_PORTAL } from "../../maps/playable-card-maps";
import { ButtonDesigner } from "../../factory/button-designer.service";
import { PlayerStateModel } from "../../models/player-info/player-state.model";


@Injectable()
export class EffectPortalService {
    buttons!: EffectPortalButton[]
    private portal!: EffectPortalEnum
    private portalCard!: PlayableCardModel

	private clientState!: PlayerStateModel

    constructor(
        private gameStateService: GameState
    ){}
    initialize(portal: EffectPortalEnum): void{
        this.portal = portal
        let cards = this.gameStateService.getClientProjectPlayedModelList()
        if(!cards){return}
        this.portalCard =  cards.filter((e) => e.cardCode===EFFECT_ENUM_TO_CODE[portal])[0]
		this.updateButtons()
    }
	updateButtons(){
		if(this.portal===undefined){return}
		this.buttons = ButtonDesigner.createPortalButtonSet(EFFECT_ENUM_TO_CODE[this.portal], this.clientState)
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
