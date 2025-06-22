import { Injectable } from "@angular/core";
import { GameState } from "./game-state.service";
import { EffectPortalEnum } from "../../enum/global.enum";
import { EffectPortalButton} from "../../models/core-game/button.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { EFFECT_ENUM_TO_CODE, EFFECT_PORTAL } from "../../maps/playable-card-maps";
import { ButtonDesigner } from "../../factory/button-designer.service";


@Injectable()
export class EffectPortalService {
    private buttons!: EffectPortalButton[]
    private portal!: EffectPortalEnum
    private portalCard!: PlayableCardModel
    constructor(
        private gameStateService: GameState
    ){}
    initialize(portal: EffectPortalEnum){
        this.portal = portal
        let cards = this.gameStateService.getClientProjectPlayedModelList()
        if(!cards){return new PlayableCardModel}
        this.portalCard =  cards.filter((e) => e.cardCode===EFFECT_ENUM_TO_CODE[portal])[0]
        this.buttons = ButtonDesigner.createPortalButtonSet(EFFECT_ENUM_TO_CODE[portal]) 
        return
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