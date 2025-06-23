// main.ts
import './assets/primeng-theme.css';
import './assets/primeicons.css';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Add withFetch
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(
      withFetch() // Enable Fetch API support
    ),
    // Other providers...
  ]
}).catch(err => console.error(err));