// src/app/core/services/app-config.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  loadConfig(): Promise<void> {
	//dev
	if (!environment.production) {
      this.config = {
        apiUrl: environment.apiUrl,
        wsUrl: environment.wsUrl,
        production: false
      };
      return Promise.resolve();
    }

    //prod
    return fetch('/assets/config/config.json')
      .then((response) => response.json())
      .then((configData) => {
        this.config = configData;
      });
  }

  get apiUrl(): string {
	if(this.config?.production===false){return environment.apiUrl}
    return this.config?.apiUrl ?? '';
  }

  get wsUrl(): string {
	if(this.config?.production===false){return environment.wsUrl}
    return this.config?.wsUrl ?? '';
  }
}
