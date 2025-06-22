import { Injectable } from "@angular/core";
import { ProjectCardInfoService } from "../cards/project-card-info.service";
import { GameState } from "./game-state.service";
import { EffectPortalButtonEnum, EffectPortalEnum } from "../../enum/global.enum";
import { EffectPortalButton, NonEventButton } from "../../models/core-game/button.model";
import { PlayableCardModel } from "../../models/cards/project-card.model";
import { EventBaseModel } from "../../models/core-game/event.model";
import { EventFactory } from "../../factory/event factory/event-factory";
import { EFFECT_PORTAL } from "../../maps/playable-card-maps";
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
        this.buttons = ButtonDesigner.createPortalButtonSet(portal)
        let cards = this.gameStateService.getClientProjectPlayedModelList()
        if(!cards){return new PlayableCardModel}
        switch(portal){
            case(EffectPortalEnum.decomposers):{
                this.portalCard =  cards.filter((e) => e.cardCode==='19')[0]
            }
        }
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