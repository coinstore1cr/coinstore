import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from '../app/custom-route-reuse-strategy/custom-route-reuse-strategy.component'; // Import your custom strategy

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy } // Add this line
  ]
};