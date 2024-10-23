import { PhaseCardInfoService } from "../cards/phase-card-info.service"
import { ProjectCardInfoService } from "../cards/project-card-info.service"
import { ProjectCardPlayedEffectService } from "../cards/project-card-played-effect.service"
import { ProjectCardScalingProductionsService } from "../cards/project-card-scaling-productions.service"
import { GameState } from "./game-state.service"

describe('Services - Core game - Game state', () => {
    let projectCardService = new ProjectCardInfoService
    let phaseCardService = new PhaseCardInfoService
    let scalingProdService = new ProjectCardScalingProductionsService
    let playedCardService = new ProjectCardPlayedEffectService(scalingProdService)
    let gameState = new GameState(projectCardService, phaseCardService, playedCardService)

    describe('UNIT TEST', () => {
        it('should evaluate getClientPlayerState', () => {
            let state = gameState.getClientPlayerState()
            const spy = spyOn(GameState.prototype, 'getPlayerStateFromId')
            expect(state).toBeUndefined()
            expect(spy).toHaveBeenCalled
        })
    })
})
