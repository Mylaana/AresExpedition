import { TestBed } from '@angular/core/testing'
import { Injector } from "@angular/core"
import { PhaseCardInfoService } from "../cards/phase-card-info.service"
import { ProjectCardInfoService } from "../cards/project-card-info.service"
import { RxStompService } from "../websocket/rx-stomp.service"
import { GameState } from "./game-state.service"
import { GameParamService } from './game-param.service'
import { ProjectCardScalingVPService } from '../cards/project-card-scaling-VP.service'
import { EventStateService } from '../../factory/event-state-service.service'
import { of } from 'rxjs'


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
		let gameState: GameState
		let gameParam: GameParamService
		let eventStateService: EventStateService
		let scalingVp: ProjectCardScalingVPService

		beforeAll(() => {
			TestBed.configureTestingModule({
				providers: [
					ProjectCardInfoService,
					PhaseCardInfoService,
					{ provide: RxStompService, useClass: MockRxStompService }, // << ici
					EventStateService,
					ProjectCardScalingVPService
				]
			})

			injector = TestBed.inject(Injector)

			projectCardService = injector.get(ProjectCardInfoService)
			rxStompService = injector.get(RxStompService)
			gameParam = injector.get(GameParamService)
			eventStateService = injector.get(EventStateService)
			scalingVp = injector.get(ProjectCardScalingVPService)

			gameState = new GameState(
				projectCardService,
				rxStompService,
				gameParam,
				scalingVp,
				eventStateService,
				injector
			)
		})
        it('should evaluate getClientState', () => {
            let state = gameState.getClientState()
            expect(state).toBeDefined()
        })
    })
})
