import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import Router for navigation

interface TickerData {
  symbol: string;
  price: string;
  change: string;
}

@Component({
  selector: 'app-ticker',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="ticker-container">
      <div *ngFor="let item of tickerData" class="ticker-item" (click)="navigateToTrade(item.symbol)" style="cursor: pointer;">
        <div class="symbol">{{item.symbol}}</div>
        <div class="price">{{item.price}}</div>
        <div class="change" [ngClass]="{'positive': item.change.startsWith('+'), 'negative': !item.change.startsWith('+')}">
          {{item.change}}
        </div>
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
    .ticker-item:hover {
      background-color: #2a2f3a; /* Optional: Hover effect */
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
    .change {
      font-size: 1rem;
    }
    .change.positive {
      color: #4caf50; /* Green for positive change */
    }
    .change.negative {
      color: #ff4d4d; /* Red for negative change */
    }
  `]
})
export class TickerComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  tickerData: TickerData[] = [
    { symbol: 'BTC', price: '0', change: '0%' },
    { symbol: 'XRP', price: '0', change: '0%' },
    { symbol: 'ETH', price: '0', change: '0%' }
  ];

  ngOnInit() {
    this.fetchTickerData().subscribe(([priceData, changeData]) => {
      this.updateTickerData(priceData, changeData);
    });

    this.subscription = interval(30000).pipe(
      switchMap(() => this.fetchTickerData())
    ).subscribe(([priceData, changeData]) => {
      this.updateTickerData(priceData, changeData);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchTickerData() {
    const baseUrl = 'https://api.binance.com';
    const price$ = this.http.get<any[]>(`${baseUrl}/api/v3/ticker/price`);
    const change$ = this.http.get<any[]>(`${baseUrl}/api/v3/ticker/24hr`);
    return forkJoin([price$, change$]);
  }

  updateTickerData(priceData: any[], changeData: any[]) {
    this.tickerData.forEach(item => {
      const priceEntry = priceData.find(p => p.symbol === `${item.symbol}USDT`);
      const changeEntry = changeData.find(c => c.symbol === `${item.symbol}USDT`);

      if (priceEntry) {
        item.price = parseFloat(priceEntry.price).toFixed(2);
      }
      if (changeEntry) {
        const changePercent = parseFloat(changeEntry.priceChangePercent);
        item.change = `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
      }
    });
  }

  // Navigate to TradeComponent with the selected symbol
  navigateToTrade(symbol: string) {
    this.router.navigate(['/trade']);
  }
}