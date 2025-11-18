import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { GAME_EVENT_HANDLERS } from './services/events/event-processor.service';
import { EventBuilderHandler } from './services/events/handlers/event-builder-handler';

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
	}
]
};
