import { TestBed } from '@angular/core/testing'
import { Injector } from "@angular/core"
import { PhaseCardInfoService } from "../cards/phase-card-info.service"
import { ProjectCardInfoService } from "../cards/project-card-info.service"
import { ProjectCardPlayedEffectService } from "../cards/project-card-played-effect.service"
import { ProjectCardScalingProductionsService } from "../cards/project-card-scaling-productions.service"
import { RxStompService } from "../websocket/rx-stomp.service"
import { GameState } from "./game-state.service"
import { GameParamService } from './game-param.service'

describe('Services - Core game - Game state', () => {
    describe('UNIT TEST', () => {
		let injector: Injector
		let projectCardService: ProjectCardInfoService
		let phaseCardService: PhaseCardInfoService
		let scalingProdService: ProjectCardScalingProductionsService
		let playedCardService: ProjectCardPlayedEffectService
		let rxStompService: RxStompService
		let gameState: GameState
		let gameParam: GameParamService

		beforeAll(() => {
			TestBed.configureTestingModule({
				providers: [
					ProjectCardInfoService,
					PhaseCardInfoService,
					ProjectCardScalingProductionsService,
					ProjectCardPlayedEffectService,
					RxStompService
				]
			})

			injector = TestBed.inject(Injector)

			projectCardService = injector.get(ProjectCardInfoService)
			scalingProdService = injector.get(ProjectCardScalingProductionsService)
			playedCardService = new ProjectCardPlayedEffectService()
			rxStompService = injector.get(RxStompService)
			gameParam = injector.get(GameParamService)

			gameState = new GameState(
				projectCardService,
				playedCardService,
				rxStompService,
				gameParam,
				injector
			)
		})
        it('should evaluate getClientState', () => {
            let state = gameState.getClientState()
            expect(state).toBeDefined()
        })
    })
})
