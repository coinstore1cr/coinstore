import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

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
  imports: [NgFor],
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
          <div class="name-cell">
            <img [src]="item.icon" [alt]="item.name" class="crypto-icon">
            <span>{{item.symbol}}</span>
          </div>
          <div class="price-cell">{{item.price}}</div>
          <div class="change-cell negative">
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
    }
    .crypto-icon {
      width: 24px;
      height: 24px;
    }
    .change-cell.negative {
      border-radius:5px;
      color: white;
      font-size: 18px;
      background-color:#ff4d4d;
    }
    .price{
      margin-left:20%;
    }
  `]
})
export class MarketQuotationComponent {
  marketData: MarketData[] = [
    { icon: 'assets/images/btc.png', name: 'Bitcoin', symbol: 'BTC', price: '95559.98', change: '-1.49%' },
    { icon: 'assets/images/xrp.png', name: 'Ripple', symbol: 'XRP', price: '2.40055', change: '-2.81%' },
    { icon: 'assets/images/eth.png', name: 'Ethereum', symbol: 'ETH', price: '2596.54', change: '-2.48%' },
    { icon: 'assets/images/trx.png', name: 'Tron', symbol: 'TRX', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/doge.png', name: 'Doge', symbol: 'DOGE', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/ltc.png', name: 'Litecoin', symbol: 'LTC', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/sol.jpeg', name: 'Solana', symbol: 'SOL', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/kmd.png', name: 'Komodo', symbol: 'KMD', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/bch.png', name: 'Bitcoin Cash', symbol: 'BCH', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/etc.png', name: 'Ethereum Classic', symbol: 'ETC', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/mln.png', name: 'Enzyme', symbol: 'MLN', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/bnb.png', name: 'Binance', symbol: 'BNB', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/ens.png', name: 'Ethereum Name Service', symbol: 'ENS', price: '0.237309', change: '-3.34%' },
    { icon: 'assets/images/ada.png', name: 'Ada', symbol: 'ADA', price: '0.237309', change: '-3.34%' }
  ];
}