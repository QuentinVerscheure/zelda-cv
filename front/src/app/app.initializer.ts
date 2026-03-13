import { inject, provideAppInitializer } from '@angular/core';
import { ConfigService } from './services/config.service';


export function initializeApp(configService: ConfigService) {
  return (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      configService.loadConfig().subscribe(
        () => resolve(),
        (error) => reject(error)
      );
    });
  };
}

export const appInitializerProviders = [
  provideAppInitializer(() => {
        const initializerFn = (initializeApp)(inject(ConfigService));
        return initializerFn();
      })
];
