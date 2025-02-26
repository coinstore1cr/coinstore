import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trading-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div *ngIf="isLoading" class="loader">
        <div class="spinner"></div>
      </div>
      <div #tradingViewContainer id="tradingview-widget"></div>
    </div>
  `,
  styles: [`
    .chart-container {
      padding: 1rem;
      background-color: #1a1f2a;
      position: relative;
    }

    .loader {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 600px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10;
    }

    .spinner {
      border: 4px solid #ccc;
      border-top: 4px solid #1E88E5;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    #tradingview-widget {
      width: 100%;
      height: 600px;
    }
  `]
})
export class TradingViewComponent implements AfterViewInit {
  @ViewChild('tradingViewContainer', { static: false }) tradingViewContainer!: ElementRef;
  isLoading: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTradingViewWidget();
    }
  }

  initTradingViewWidget() {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Exit if not running in the browser
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      const container = this.tradingViewContainer?.nativeElement;
      if (container) {
        new (window as any).TradingView.widget({
          container_id: container.id,
          symbol: 'NASDAQ:AAPL',
          interval: '15',
          theme: 'dark',
          style: '1',
          locale: 'en',
          width: '100%',
          height: '600vh',
          enable_publishing: false,
          allow_symbol_change: true,
        });

        setTimeout(() => {
          this.isLoading = false;
        }, 1000); // Short delay for smooth transition
      } else {
        console.error('TradingView container not found!');
      }
    };

    document.body.appendChild(script);
  }
}
