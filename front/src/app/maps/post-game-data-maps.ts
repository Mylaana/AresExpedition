import { GlobalParameterNameEnum } from "../enum/global.enum";
import { SelectablePhaseEnum } from "../enum/phase.enum";
import { PlayerStateModel } from "../models/player-info/player-state.model";
import { GameContentName, PostGameDataTitle } from "../types/global.type";

function getSelectedPhaseCount(phase: SelectablePhaseEnum, state: PlayerStateModel): number {
    let phases = state.getStatState().getSelectedPhaseOnRound()
    let result = 0
    for(let key of phases.keys()){
        if(phases.get(key)===phase){
            result++
        }
    }
    return result
}
function isContentActive(content: GameContentName, activeContent: GameContentName[]): boolean{
    return activeContent.includes(content)
}
export const POST_GAME_DATA: Partial<Record<PostGameDataTitle, (playerState: PlayerStateModel) => string>> = {
    'cardSeen': (state) => {return state.getStatState().getCardSeen().toString()},
    'phaseTotalDevelopment': (state) => {return getSelectedPhaseCount(SelectablePhaseEnum.development, state).toString()},
    'phaseTotalConstruction': (state) => {return getSelectedPhaseCount(SelectablePhaseEnum.construction, state).toString()},
    'phaseTotalAction': (state) => {return getSelectedPhaseCount(SelectablePhaseEnum.action, state).toString()},
    'phaseTotalProduction': (state) => {return getSelectedPhaseCount(SelectablePhaseEnum.production, state).toString()},
    'phaseTotalResearch': (state) => {return getSelectedPhaseCount(SelectablePhaseEnum.research, state).toString()},
    'contributionOcean': (state) => {return (state.getStatState().getIncreasedParameters().get(GlobalParameterNameEnum.ocean)??0).toString()},
    'contributionTemperature': (state) => {return (state.getStatState().getIncreasedParameters().get(GlobalParameterNameEnum.temperature)??0).toString()},
    'contributionOxygen': (state) => {return (state.getStatState().getIncreasedParameters().get(GlobalParameterNameEnum.oxygen)??0).toString()},
    'contributionInfrastructure': (state) => {return (state.getStatState().getIncreasedParameters().get(GlobalParameterNameEnum.infrastructure)??0).toString()},
    'contributionMoonStructure': (state) => {return (state.getStatState().getIncreasedParameters().get(GlobalParameterNameEnum.moon)??0).toString()},
    'totalAwards': (state) => state.getAwardsVp().toString(),
    'totalMilestones': (state) => state.getMilestonesVp().toString(),
}
export const POST_GAME_ROW_TITLE: Partial<Record<PostGameDataTitle, string>> = {
    'cardSeen': 'Seen (draw + scan)',
    'phaseTotalDevelopment': '$other_phase_development$',
    'phaseTotalConstruction': '$other_phase_construction$',
    'phaseTotalAction': '$other_phase_action$',
    'phaseTotalProduction': '$other_phase_production$',
    'phaseTotalResearch': '$other_phase_research$',
    'contributionOcean': '$other_ocean$',
    'contributionTemperature': '$other_temperature$',
    'contributionOxygen': '$other_oxygen$',
    'contributionInfrastructure': '$other_infrastructure$',
    'contributionMoonStructure': '$other_moonparameter$',
    'totalAwards': '$other_award$',
    'totalMilestones': '$other_milestone$'
}
export const POST_GAME_ROW_RELEVANCY: Partial<Record<PostGameDataTitle,(activeContent: GameContentName[]) => boolean>> = {
    'contributionInfrastructure':(content) => isContentActive('expansionFoundations', content),
    'contributionMoonStructure': (content) => isContentActive('expansionMoon', content),
    'totalAwards': (content) => isContentActive('expansionDiscovery', content),
    'totalMilestones': (content) => isContentActive('expansionDiscovery', content),
}
export const POST_GAME_CATEGORY_TITLE: Partial<Record<PostGameDataTitle, string>> = {
    'titleCards': 'Total Cards:',
    'titlePhaseSelected': 'Total Phase selected:',
    'titleParameterContribution': 'Terraforming Contribution:',
    'titleAwardsMilestones': 'Total Victory Point from:'
}