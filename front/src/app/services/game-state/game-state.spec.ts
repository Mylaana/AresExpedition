import { TestBed } from '@angular/core/testing'
import { Injector } from "@angular/core"
import { PhaseCardInfoService } from "../cards/phase-card-info.service"
import { ProjectCardInfoService } from "../cards/project-card-info.service"
import { RxStompService } from "../websocket/rx-stomp.service"
import { GameParamService } from '../core-game/game-param.service'
import { ProjectCardScalingVPService } from '../cards/project-card-scaling-VP.service'
import { of } from 'rxjs'
import { GameActiveContentService } from '../core-game/game-active-content.service'
import { GameStateFacadeService } from './game-state-facade.service'
import { GameStateEventService } from './sub-service/game-state-event.service'


class MockRxStompService {
  connect() {}
  disconnect() {}
  send() {}
  watch() {
    return of(); // empty Observable
  }
}

describe('Services - Core game - Game state', () => {
    describe('UNIT TEST', () => {
		let injector: Injector
		let projectCardService: ProjectCardInfoService
		let rxStompService: RxStompService
		let gameState: GameStateFacadeService
		let gameParam: GameParamService
		let gameStateEvent: GameStateEventService
		let scalingVp: ProjectCardScalingVPService
		let gameModeContentService: GameActiveContentService

		beforeAll(() => {
			TestBed.configureTestingModule({
				providers: [
					ProjectCardInfoService,
					PhaseCardInfoService,
					{ provide: RxStompService, useClass: MockRxStompService },
					ProjectCardScalingVPService,
					GameStateEventService,
					GameActiveContentService
				]
			})

			injector = TestBed.inject(Injector)

			projectCardService = injector.get(ProjectCardInfoService)
			rxStompService = injector.get(RxStompService)
			gameParam = injector.get(GameParamService)
			scalingVp = injector.get(ProjectCardScalingVPService)
			gameModeContentService = injector.get(GameActiveContentService)
			gameStateEvent = injector.get(GameStateEventService)

			gameState = new GameStateFacadeService(
				projectCardService,
				rxStompService,
				gameParam,
				gameModeContentService,
				gameStateEvent,
				injector,
			)
		})
        it('should evaluate getClientState', () => {
            let state = gameState.getClientState()
            expect(state).toBeDefined()
        })
    })
})
