import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface MarketData {
  icon: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
}

@Component({
  selector: 'app-market-quotation',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="market-container">
      <h2 class="title">Market Quotation</h2>
      <div class="market-table">
        <div class="table-header">
          <div>Name</div>
          <div>Latest Price</div>
          <div>24h Change</div>
        </div>
        <div *ngFor="let item of marketData" class="table-row">
          <div class="name-cell" (click)="navigateToTrade(item.symbol)">
            <img [src]="item.icon" [alt]="item.name" class="crypto-icon">
            <span>{{item.symbol}}</span>
          </div>
          <div class="price-cell">{{item.price}}</div>
          <div class="change-cell" [ngClass]="{'positive': item.change.startsWith('+'), 'negative': !item.change.startsWith('+')}">
            <span class="price">{{item.change}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .market-container {
      padding: 1rem;
    }
    .title {
      color: #ffd700;
      margin-bottom: 1rem;
      position: relative; /* Needed for pseudo-element positioning */
      display: inline-block; /* Keeps the title inline with the underline */
    }
    .title::after {
      content: '';
      position: absolute;
      left: 10%;
      bottom: -5px; /* Adjusts the distance below the text */
      width: 80%; /* Underline width set to 80% of the text */
      height: 4px; /* Underline thickness */
      background-color: #ffd700; /* Yellow color */
      border-radius: 15%;
    }
    .market-table {
      background-color: #1a1f2a;
    }
    .table-header {
      display: grid;
      grid-template-columns: 1.5fr 1.5fr 1fr;
      padding: 1rem;
      color: #8e98a7;
      border-bottom: 1px solid #2a2f3a;
    }
    .table-row {
      display: grid;
      grid-template-columns: 1.5fr 1.5fr 1fr;
      padding: 1rem;
      border-bottom: 1px solid #2a2f3a;
    }
    .name-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .name-cell:hover {
      opacity: 0.8;
    }
    .crypto-icon {
      width: 24px;
      height: 24px;
    }
    .change-cell {
      border-radius: 5px;
      color: white;
      font-size: 18px;
    }
    .change-cell.positive {
      background-color: #4caf50;
    }
    .change-cell.negative {
      background-color: #ff4d4d;
    }
    .price {
      margin-left: 20%;
    }
  `]
})
export class MarketQuotationComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  marketData: MarketData[] = [
    { icon: 'assets/images/btc.png', name: 'Bitcoin', symbol: 'BTC', price: '0', change: '0%' },
    { icon: 'assets/images/xrp.png', name: 'Ripple', symbol: 'XRP', price: '0', change: '0%' },
    { icon: 'assets/images/eth.png', name: 'Ethereum', symbol: 'ETH', price: '0', change: '0%' },
    { icon: 'assets/images/trx.png', name: 'Tron', symbol: 'TRX', price: '0', change: '0%' },
    { icon: 'assets/images/doge.png', name: 'Doge', symbol: 'DOGE', price: '0', change: '0%' },
    { icon: 'assets/images/ltc.png', name: 'Litecoin', symbol: 'LTC', price: '0', change: '0%' },
    { icon: 'assets/images/sol.jpeg', name: 'Solana', symbol: 'SOL', price: '0', change: '0%' },
    { icon: 'assets/images/kmd.png', name: 'Komodo', symbol: 'KMD', price: '0', change: '0%' },
    { icon: 'assets/images/bch.png', name: 'Bitcoin Cash', symbol: 'BCH', price: '0', change: '0%' },
    { icon: 'assets/images/etc.png', name: 'Ethereum Classic', symbol: 'ETC', price: '0', change: '0%' },
    { icon: 'assets/images/mln.png', name: 'Enzyme', symbol: 'MLN', price: '0', change: '0%' },
    { icon: 'assets/images/bnb.png', name: 'Binance', symbol: 'BNB', price: '0', change: '0%' },
    { icon: 'assets/images/ens.png', name: 'Ethereum Name Service', symbol: 'ENS', price: '0', change: '0%' },
    { icon: 'assets/images/ada.png', name: 'Ada', symbol: 'ADA', price: '0', change: '0%' }
  ];

  ngOnInit() {
    this.fetchMarketData().subscribe(([priceData, changeData]) => {
      this.updateMarketData(priceData, changeData);
    });

    this.subscription = interval(30000).pipe(
      switchMap(() => this.fetchMarketData())
    ).subscribe(([priceData, changeData]) => {
      this.updateMarketData(priceData, changeData);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchMarketData() {
    const baseUrl = 'https://api.binance.com';
    const price$ = this.http.get<any[]>(`${baseUrl}/api/v3/ticker/price`);
    const change$ = this.http.get<any[]>(`${baseUrl}/api/v3/ticker/24hr`);
    return forkJoin([price$, change$]);
  }

  updateMarketData(priceData: any[], changeData: any[]) {
    this.marketData.forEach(item => {
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

  navigateToTrade(symbol: string) {
    this.router.navigate(['/trade']);
  }
}