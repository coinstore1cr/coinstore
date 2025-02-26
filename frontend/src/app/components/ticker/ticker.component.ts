import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface TickerData {
  symbol: string;
  price: string;
  change: string;
}

@Component({
  selector: 'app-ticker',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="ticker-container">
      <div *ngFor="let item of tickerData" class="ticker-item">
        <div class="symbol">{{item.symbol}}</div>
        <div class="price">{{item.price}}</div>
        <div class="change negative">{{item.change}}</div>
      </div>
    </div>
  `,
  styles: [`
    .ticker-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background-color: #2a2f3a;
    }
    .ticker-item {
      background-color: #1a1f2a;
      padding: 1rem;
      text-align: center;
    }
    .symbol {
      font-size: 1.2rem;
      color: #ffffff;
    }
    .price {
      font-size: 1.1rem;
      color: #ffffff;
      margin: 0.5rem 0;
    }
    .change.negative {
      color: #ff4d4d;
    }
  `]
})
export class TickerComponent {
  tickerData: TickerData[] = [
    { symbol: 'BTC', price: '95559.98', change: '-1.49%' },
    { symbol: 'XRP', price: '2.40055', change: '-2.81%' },
    { symbol: 'ETH', price: '2596.54', change: '-2.48%' }
  ];
} 