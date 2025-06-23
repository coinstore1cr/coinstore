import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from '../app/custom-route-reuse-strategy/custom-route-reuse-strategy.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(), // Using async animations provider for Angular 19
    // { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
};