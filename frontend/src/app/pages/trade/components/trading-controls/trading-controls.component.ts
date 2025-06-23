import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trading-controls',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="controls-container">
      <button class="control-button up" (click)="placeTrade('up')">
        Up
      </button>
      <button class="control-button down" (click)="placeTrade('down')">
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
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  placeTrade(direction: 'up' | 'down') {
    // Get the current coin parameters from the route
    this.route.queryParams.subscribe(params => {
      this.router.navigate(['/tradingpopup'], {
        queryParams: { 
          direction,
          symbol: params['symbol'] || 'BTC',
          name: params['name'] || 'Bitcoin',
          price: params['price'],
          change: params['change']
        }
      });
    });
  }
}