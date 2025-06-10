import { TestBed } from '@angular/core/testing'
import { Injector } from "@angular/core"
import { PhaseCardInfoService } from "../cards/phase-card-info.service"
import { ProjectCardInfoService } from "../cards/project-card-info.service"
import { ProjectCardScalingProductionsService } from "../cards/project-card-scaling-productions.service"
import { RxStompService } from "../websocket/rx-stomp.service"
import { GameState } from "./game-state.service"
import { GameParamService } from './game-param.service'
import { ProjectCardScalingVPService } from '../cards/project-card-scaling-VP.service'
import { EventStateFactory } from '../../factory/event-state-service.service'

describe('Services - Core game - Game state', () => {
    describe('UNIT TEST', () => {
		let injector: Injector
		let projectCardService: ProjectCardInfoService
		let scalingProdService: ProjectCardScalingProductionsService
		let rxStompService: RxStompService
		let gameState: GameState
		let gameParam: GameParamService
		let eventStateFactory: EventStateFactory
		let scalingVp: ProjectCardScalingVPService

		beforeAll(() => {
			TestBed.configureTestingModule({
				providers: [
					ProjectCardInfoService,
					PhaseCardInfoService,
					ProjectCardScalingProductionsService,
					RxStompService,
					EventStateFactory,
					ProjectCardScalingVPService
				]
			})

			injector = TestBed.inject(Injector)

			projectCardService = injector.get(ProjectCardInfoService)
			scalingProdService = injector.get(ProjectCardScalingProductionsService)
			rxStompService = injector.get(RxStompService)
			gameParam = injector.get(GameParamService)
			eventStateFactory = injector.get(EventStateFactory)
			scalingVp = injector.get(ProjectCardScalingVPService)

			gameState = new GameState(
				projectCardService,
				rxStompService,
				gameParam,
				scalingVp,
				eventStateFactory,
				injector
			)
		})
        it('should evaluate getClientState', () => {
            let state = gameState.getClientState()
            expect(state).toBeDefined()
        })
    })
})
