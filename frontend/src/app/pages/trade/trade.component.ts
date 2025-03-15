import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingViewComponent } from './components/trading-view/trading-view.component';
import { TradingControlsComponent } from './components/trading-controls/trading-controls.component';
import { MarketStatsComponent } from './components/market-stats/market-stats.component';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [CommonModule, TradingViewComponent, TradingControlsComponent, MarketStatsComponent],
  template: `
    <div class="trade-container">
      <div class="trade-header">
        <div class="tabs">
          <button 
            class="tab" 
            [class.active]="activeTab === 'secondContract'"
            (click)="setActiveTab('secondContract')"
          >
            Second Contract
          </button>
          <button 
            class="tab" 
            [class.active]="activeTab === 'futuresTrading'"
            (click)="setActiveTab('futuresTrading')"
          >
            Futures Trading
          </button>
        </div>
        
        <div class="trading-pair">
          <div class="pair-header">
            <h1>BTC/USDT</h1>
            <span class="change positive">+0.01%</span>
          </div>
          
        </div>
      </div>

      <app-market-stats />
      <app-trading-view />
      <app-trading-controls />
    </div>
  `,
  styles: [`
    .trade-container {

    position:relative;
    z-index:1;
      background-color: #1a1f2a;
      min-height: 90vh;
      padding-bottom: 60px;
    }

    .trade-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999; /* Behind popup but above parent content */
  display: none;
}

.trade-container.popup-active::before {
  display: block; /* Show overlay only when popup is active */
}

    .trade-header {
      padding: 1rem;
    }

    .tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .tab {
      padding: 0.5rem 1rem;
      border-radius: 1.5rem;
      border: none;
      background: transparent;
      color: #8e98a7;
      cursor: pointer;
    }

    .tab.active {
      background-color: #ffd700;
      color: #1a1f2a;
    }

    .trading-pair {
      margin-top: 1rem;
    }

    .pair-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #ffffff;
    }

    .change {
      font-size: 0.875rem;
    }

    .change.positive {
      color: #4caf50;
    }

    .current-price {
      font-size: 2rem;
      color: #ffffff;
      margin-top: 0.5rem;
    }
  `]
})
export class TradeComponent {
  activeTab: 'secondContract' | 'futuresTrading' = 'secondContract'; // Default active tab

  setActiveTab(tab: 'secondContract' | 'futuresTrading'): void {
    this.activeTab = tab;
  }
}