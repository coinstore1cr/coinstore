import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="app-container">
      
      <router-outlet />
      <app-bottom-nav />
    </div>
  `,
  styles: [`
    .app-container {
      background-color: #1a1f2a;
      min-height: 100vh;
      color: #ffffff;
      padding-bottom: 60px; 
    }
  `]
})
export class AppComponent {
  title = 'coinstore';
}