// src/app/core/services/app-config.service.ts
import { Injectable } from '@angular/core';



@Injectable({
	providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  loadConfig(): Promise<void> {
    return fetch('/assets/config/config.json')
      .then((response) => response.json())
      .then((configData) => {
        this.config = configData;
      });
  }

  get apiUrl(): string {
    return this.config?.apiUrl ?? '';
  }

  get wsUrl(): string {
    return this.config?.wsUrl ?? '';
  }
}
