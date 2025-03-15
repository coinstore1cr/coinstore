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
      width: 100%;
    }

    .loader {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
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
      height: 400px; /* Default height for smaller screens */
    }

    /* Media query for larger screens */
    @media (min-width: 768px) {
      #tradingview-widget {
        height: 600px;
      }
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
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      const container = this.tradingViewContainer?.nativeElement;
      if (container) {
        // Get the current viewport width to set initial height
        const isLargeScreen = window.innerWidth >= 768;
        const widgetHeight = isLargeScreen ? '600px' : '400px';

        new (window as any).TradingView.widget({
          container_id: container.id,
          symbol: 'NASDAQ:AAPL',
          interval: '15',
          theme: 'dark',
          style: '1',
          locale: 'en',
          width: '100%',
          height: widgetHeight, // Set initial height based on screen size
          enable_publishing: false,
          allow_symbol_change: true,
        });

        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      } else {
        console.error('TradingView container not found!');
      }
    };

    document.body.appendChild(script);

    // Optional: Add resize listener for dynamic updates
    window.addEventListener('resize', () => {
      const widget = (window as any).TradingView?.widget;
      if (widget && widget.length > 0) {
        const isLargeScreen = window.innerWidth >= 768;
        const newHeight = isLargeScreen ? '600px' : '400px';
        widget[0].setHeight(newHeight);
      }
    });
  }
}