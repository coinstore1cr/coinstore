import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { TickerComponent } from '../../components/ticker/ticker.component';
import { MarketQuotationComponent } from '../../components/market-quotation/market-quotation.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, TickerComponent, MarketQuotationComponent,HeaderComponent],
  template: `
    <app-header />
    <app-banner />
    <app-ticker />
    <div class="quick-deposit">Quick Deposit</div>
    <app-market-quotation />
  `,
  styles: [`
    .quick-deposit {
      padding: 1rem;
      text-align: center;
      color: #8e98a7;
    }
  `]
})
export class HomeComponent {}