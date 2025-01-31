import { PhaseCardInfoService } from "../cards/phase-card-info.service"
import { ProjectCardInfoService } from "../cards/project-card-info.service"
import { ProjectCardPlayedEffectService } from "../cards/project-card-played-effect.service"
import { ProjectCardScalingProductionsService } from "../cards/project-card-scaling-productions.service"
import { RxStompService } from "../websocket/rx-stomp.service"
import { GameState } from "./game-state.service"

describe('Services - Core game - Game state', () => {
    describe('UNIT TEST', () => {
		let projectCardService: ProjectCardInfoService
		let phaseCardService: PhaseCardInfoService
		let scalingProdService: ProjectCardScalingProductionsService
		let playedCardService: ProjectCardPlayedEffectService
		let rxStompService: RxStompService
		let gameState: GameState

		beforeAll(() => {
			projectCardService = new ProjectCardInfoService
			phaseCardService = new PhaseCardInfoService
			scalingProdService = new ProjectCardScalingProductionsService
			playedCardService = new ProjectCardPlayedEffectService(scalingProdService)
			rxStompService = new RxStompService
			gameState = new GameState(projectCardService, phaseCardService, playedCardService, rxStompService)

		})
        it('should evaluate getClientPlayerState', () => {
            let state = gameState.getClientPlayerState()
            const spy = spyOn(GameState.prototype, 'getPlayerStateFromId')
            expect(state).toBeUndefined()
            expect(spy).toHaveBeenCalled
        })
    })
})
