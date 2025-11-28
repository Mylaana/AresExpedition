import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventTagSelector } from "../../../models/core-game/event.model";
import { Logger, Utils } from "../../../utils/utils";
import { EventFactory } from "../../../factory/event/event-factory";
import { WildTagResolutionEnum } from "../../../enum/global.enum";
import { GameParamService } from "../../core-game/game-param.service";
import { GameActiveContentService } from "../../core-game/game-active-content.service";
import { TagType } from "../../../types/global.type";
import { CardSelectorService } from "../../core-game/components-services/card-selector.service";

@Injectable()
export class EventTagSelectorHandler implements GameEventHandler<EventTagSelector> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
        private activeContentService: GameActiveContentService,
        private selectorService: CardSelectorService
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='tagSelector'
    }
    onSwitchEvent(event: EventTagSelector){
        let validTagList = this.activeContentService.getTagListFromActiveContent()
        let authorizedTagList: TagType[] = []
        switch(event.tagResolutionMode){
            case(WildTagResolutionEnum.anyValidTag):{
                authorizedTagList = validTagList
                break
            }
            case(WildTagResolutionEnum.anyValidTagNotAlreadyStocked):{
                let alreadyGottenTagStock = this.gameStateFacade.getClientState().getPlayedProjectWithId(event.targetCardId)?.tagStock??[]
                authorizedTagList = validTagList
                if(alreadyGottenTagStock.length===0){break}

                for(let t of alreadyGottenTagStock){
                    authorizedTagList = authorizedTagList.filter((el) => el!=Utils.toTagType(t))
                }
                break
            }
            case(WildTagResolutionEnum.specifiedTagList):{
                break
            }
        }
        event.authorizedTagList = authorizedTagList
        this.selectorService.notifyRecalculateSelector()
    }
    onFinalizeEvent(event: EventTagSelector) {   
        Logger.logEventResolution('resolving event: ','finishEventTagSelector', event.subType)
		switch(event.subType){
			case('tagSelector'):{
				event.finalized=true
				this.gameStateFacade.addEventQueue(EventFactory.simple.addTagToCard(event.targetCardId, event.selectedTag), 'first')
				break
			}
			default:{Logger.logError('Non mapped event in handler.finishEventPhase: ', event)}
		}
    }
}