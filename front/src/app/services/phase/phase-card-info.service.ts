import { Injectable } from "@angular/core";
import { PhaseCardType } from "../../types/phase-card.type";
import { PhaseCardGroupModel, PhaseCardModel, PhaseCardHolderModel } from "../../models/core-game/phase-card.model";

@Injectable({
    providedIn: 'root'
})
export class PhaseCardInfoService {
	getPhaseCardTypeFromIds(phaseIndex: number, phaseCardLevel: number): PhaseCardType {
		let phaseType: PhaseCardType

		switch(phaseIndex){
			case(1):{switch(phaseCardLevel){
					case(0):{return 'development_base'}
					case(1):{return 'development_6mc'}
					case(2):{return 'development_second_card'}
				}
				break
			}
			case(2):{switch(phaseCardLevel){
					case(0):{return 'construction_base'}
					case(1):{return 'construction_6mc'}
					case(2):{return 'construction_third_card'}
				}
				break
			}
			case(3):{switch(phaseCardLevel){
					case(0):{return 'action_base'}
					case(1):{return 'action_scan_cards'}
					case(2):{return 'action_repeat_two'}
				}
				break
			}
			case(4):{switch(phaseCardLevel){
					case(0):{return 'production_base'}
					case(1):{return 'production_7mc'}
					case(2):{return 'production_1mc_activate_card'}
				}
				break
			}
			case(5):{switch(phaseCardLevel){
					case(0):{return 'research_base'}
					case(1):{return 'research_scan6_keep1'}
					case(2):{return 'research_scan2_keep2'}
				}
				break
			}
		}


		return phaseType
	}
	getNewPhaseCard(phaseIndex: number, phaseCardLevel: number): PhaseCardModel {
		let newPhaseCard = new PhaseCardModel

		newPhaseCard.phaseType = this.getPhaseCardTypeFromIds(phaseIndex, phaseCardLevel)
		newPhaseCard.phaseCardLevel = phaseCardLevel
		newPhaseCard.phaseCardUpgraded = phaseCardLevel===0
		newPhaseCard.phaseCardSelected = phaseCardLevel===0

		return newPhaseCard
	}
	getNewPhaseGroup(phaseIndex: number, phaseCardNumberPerPhase: number): PhaseCardGroupModel {
		let phaseGroup = new PhaseCardGroupModel

		for(let i=0; i<phaseCardNumberPerPhase; i++){
			phaseGroup.phaseCards.push(this.getNewPhaseCard(phaseIndex, i))
		}

		return phaseGroup
	}
	getNewPhaseHolderModel(phaseNumber:number, phaseCardNumberPerPhase: number): PhaseCardHolderModel {
		let newHolder = new PhaseCardHolderModel

		//create phaseGroups
		for(let i=1; i<=phaseNumber; i++){
			newHolder.phaseGroup.push(this.getNewPhaseGroup(i, phaseCardNumberPerPhase))
		}
		return newHolder
	}
}
