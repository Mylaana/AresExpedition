import { Injectable } from "@angular/core";
import { GameStateFacadeService } from "../../game-state/game-state-facade.service";
import { GameEventHandler } from "../../../interfaces/services.interface";
import { EventBaseModel, EventGeneric } from "../../../models/core-game/event.model";
import { Logger } from "../../../utils/utils";
import { EventFactory } from "../../../factory/event/event-factory";
import { InputRuleEnum } from "../../../enum/global.enum";
import { SelectablePhaseEnum } from "../../../enum/phase.enum";
import { RessourceStock } from "../../../interfaces/global.interface";
import { RxStompService } from "../../websocket/rx-stomp.service";

@Injectable()
export class EventGenericHandler implements GameEventHandler<EventGeneric> {
    constructor(
        private gameStateFacade: GameStateFacadeService,
        private rxStompService: RxStompService
    ){}
    supports(event: EventBaseModel): boolean {
        return event.type==='generic'
    }
    onSwitchEvent(event: EventGeneric){
		if(event.subType==='planificationPhase' && event.button){
			event.button.resetStartEnabled()
		}
    }
    onFinalizeEvent(event: EventGeneric) {   
        Logger.logEventResolution('resolving event: ','EventGeneric ', event.subType)

        if(event.subType!='buildCard'){event.finalized = true}

        switch(event.subType){
            case('endOfPhase'):{
                this.gameStateFacade.setClientReady(true)
                this.gameStateFacade.endOfPhase()
                break
            }
            case('buildCard'):{
                let card = event.cardIdToBuild
                if(!card){break}
                this.gameStateFacade.playCardFromClientHand(card, 'project')
                break
            }
            case('drawResult'):{
                if(event.drawResultList===undefined){break}
                if(event.isCardProduction){
                    this.gameStateFacade.addCardProduction(event.drawResultList, false)
                } else {
                    this.gameStateFacade.addCardsToClientHand(event.drawResultList)
                }
                break
            }
            case('drawResultThenDiscard'):{
                if(event.drawResultList===undefined){break}
                this.gameStateFacade.addCardsToClientHand(event.drawResultList)
                if(event.thenDiscard && event.thenDiscard>0){
                    this.gameStateFacade.addEventQueue(EventFactory.simple.discard(event.thenDiscard), 'first')
                }
                break
            }
            case('increaseGlobalParameter'):{
                if(!event.increaseParameter){break}
                this.gameStateFacade.addGlobalParameterStepsEOPtoClient(event.increaseParameter)
                break
            }
            case('increaseResearchScanKeep'):{
                if(!event.increaseResearchScanKeep){break}
                if(event.increaseResearchScanKeep.scan!=undefined && event.increaseResearchScanKeep.scan>0){
                    this.gameStateFacade.addClientResearchScanValue(event.increaseResearchScanKeep.scan)
                }
                if(event.increaseResearchScanKeep.keep!=undefined && event.increaseResearchScanKeep.keep>0){
                    this.gameStateFacade.addClientResearchKeepValue(event.increaseResearchScanKeep.keep)
                }
                break
            }
            case('addRessourceToPlayer'):{
                if(event.baseRessource===undefined){break}
                let baseRessources: RessourceStock[] = []

                if(Array.isArray(event.baseRessource)){
                    baseRessources = event.baseRessource
                } else {
                    baseRessources.push(event.baseRessource)
                }

                this.gameStateFacade.addRessourceToClient(baseRessources)
                break
            }
            case('planificationPhase'):{
                this.gameStateFacade.clientSelectPhase(event.selectedPhase?.toUpperCase() as SelectablePhaseEnum)
                this.gameStateFacade.clientPlayerValidateSelectedPhase()
                break
            }
            case('oceanQuery'):{
                if(!event.gainOceanNumber){break}
                this.rxStompService.publishOceanQuery(event.gainOceanNumber, this.gameStateFacade.getClientStateDTO())
                break
            }
            case('upgradePhaseCards'):{break}
            case('waitingGroupReady'):{break}
            case('addForestPointAndOxygen'):{
                if(event.addForestPoint){
                    this.gameStateFacade.addForestPointAndOxygen(event.addForestPoint)
                }
                break
            }
            case('addProduction'):{
                if(!event.baseRessource){break}
                this.gameStateFacade.addProductionToClient(event.baseRessource)
                break
            }
            case('addTr'):{
                if(!event.increaseTr){break}
                this.gameStateFacade.addTr(event.increaseTr)
                break
            }
            case('loadProductionPhaseCards'):{
                if(!event.loadProductionCardList || event.loadProductionCardList.length===0){break}
                break
            }
            case('loadProductionPhaseCardDouble'):{
                if(!event.loadProductionCardList || event.loadProductionCardList.length===0){break}
                break
            }
            case('resourceConversion'):{
                switch(event.resourceConversionInputRule){
                    case(InputRuleEnum.powerInfrastructure):{
                        let conversion: number = event.resourceConversionQuantity??0
                        this.gameStateFacade.addEventQueue(EventFactory.simple.addRessource([{name:'heat', valueStock:-conversion},{name:'megacredit', valueStock:conversion}]), 'first')
                        break
                    }
                }
                break
            }
            case('addMoonTile'):{
                if(!event.addMoonTile){break}
                this.gameStateFacade.addMoonTiles(event.addMoonTile)
                break
            }
            default:{Logger.logError('Non mapped event in handler.finishEventGeneric: ', event)}
        }
    }
}