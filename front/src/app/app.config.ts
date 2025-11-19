import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { GAME_EVENT_HANDLERS } from './services/events/event-processor.service';
import { EventBuilderHandler } from './services/events/handlers/event-builder-handler';
import { EventSelectorHandler } from './services/events/handlers/event-selector-handler';
import { EventComplexSelectorHandler } from './services/events/handlers/event-complex-selector-handler';
import { EventGenericHandler } from './services/events/handlers/event-generic-handler';
import { EventPhaseHandler } from './services/events/handlers/event-phase-handler';

export const appConfig: ApplicationConfig = {
  providers: [
	provideRouter(routes),
	provideClientHydration(),
	provideAnimations(),
	provideHttpClient(),
	{
		provide: GAME_EVENT_HANDLERS,
		useClass: EventBuilderHandler,
		multi: true
	},
	{
		provide: GAME_EVENT_HANDLERS,
		useClass: EventSelectorHandler,
		multi: true
	},
	{
		provide: GAME_EVENT_HANDLERS,
		useClass: EventComplexSelectorHandler,
		multi: true
	},
	{
		provide: GAME_EVENT_HANDLERS,
		useClass: EventGenericHandler,
		multi: true
	},
		{
		provide: GAME_EVENT_HANDLERS,
		useClass: EventPhaseHandler,
		multi: true
	}
]
};
