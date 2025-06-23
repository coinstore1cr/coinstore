import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
            <h1>{{symbol}}/USDT</h1>
            <span class="change" [class.positive]="isPositiveChange" [class.negative]="!isPositiveChange">{{change}}</span>
          </div>
          <div class="current-price">{{price}}</div>
        </div>
      </div>

      <app-market-stats />
      <app-trading-view />
      <app-trading-controls />
    </div>
  `,
  styles: [`
    .trade-container {
      position: relative;
      z-index: 1;
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
      z-index: 999;
      display: none;
    }

    .trade-container.popup-active::before {
      display: block;
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

    .change.negative {
      color: #ff4d4d;
    }

    .current-price {
      font-size: 2rem;
      color: #ffffff;
      margin-top: 0.5rem;
    }
  `]
})
export class TradeComponent implements OnInit {
  activeTab: 'secondContract' | 'futuresTrading' = 'secondContract';
  symbol: string = 'BTC';
  name: string = 'Bitcoin';
  price: string = '0';
  change: string = '0%';
  isPositiveChange: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['symbol']) {
        this.symbol = params['symbol'];
        this.name = params['name'];
        this.price = params['price'];
        this.change = params['change'];
        this.isPositiveChange = this.change.startsWith('+');
      }
    });
  }

  setActiveTab(tab: 'secondContract' | 'futuresTrading'): void {
    this.activeTab = tab;
  }
}