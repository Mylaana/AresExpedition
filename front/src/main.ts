import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppConfigService } from './app/services/app-config.service';


const configService = new AppConfigService();

configService.loadConfig().then(() => {
  bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...appConfig.providers ?? [],
      { provide: AppConfigService, useValue: configService },
    ]
  });
}).catch((err) => console.error('Erreur chargement config.json :', err));
