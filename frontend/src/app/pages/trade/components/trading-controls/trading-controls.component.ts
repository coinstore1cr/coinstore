import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trading-controls',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
    <div class="controls-container">
      <button routerLink="/tradingpopup" class="control-button up" (click)="navigateWithDirection('up');placeTrade('up') " >
        Up
      </button>
      <button routerLink="/tradingpopup" class="control-button down" (click)="navigateWithDirection('down');placeTrade('down')">
        Down
      </button>
    </div>
  `,
  styles: [`
    .controls-container {
      position: relative;
      bottom: 10px;
      left: 0;
      right: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      padding: 1rem;
      background-color: #1a1f2a;
    }

    .control-button {
      padding: 1rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .control-button:active {
      opacity: 0.8;
    }

    .up {
      background-color: #4caf50;
      color: white;
    }

    .down {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class TradingControlsComponent {

  
  
  constructor(private router: Router) {}

  navigateWithDirection(direction: 'up' | 'down') {
    this.router.navigate(['/tradingpopup'], {
      queryParams: { direction }
    });
  }

  placeTrade(direction: 'up' | 'down') {
  }
}