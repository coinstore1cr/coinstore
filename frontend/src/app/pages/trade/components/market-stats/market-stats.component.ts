import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-market-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <div class="current-price">2.39661</div>
      <div class="stats-items horizontal">
        <div class="stat-item">
          <span class="label">High</span>
          <span class="value">2.39738</span>
        </div>
        <div class="stat-item">
          <span class="label">Low</span>
          <span class="value">2.39485</span>
        </div>
        <div class="stat-item">
          <span class="label">24H Volume</span>
          <span class="value">17016039.38818</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: #212631;
    }

    .current-price {
      font-size: 1.5rem;
      color: #ffffff;
      font-weight: bold;
    }

    .stats-items {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .stats-items.horizontal .stat-item {
      display: flex;
      flex-direction: row; /* Horizontal layout */
      gap: 0.5rem;
      align-items: center;
    }

    .stats-items.vertical .stat-item {
      flex-direction: column; /* Column layout */
      align-items: flex-start;
    }

    .label {
      font-size: 0.75rem;
      color: #8e98a7;
    }

    .value {
    
      font-size: 0.875rem;
      color: #ffffff;
      font-weight: bold;
      margin-left: auto; 
      text-align: right;
   
    }
  `]
})
export class MarketStatsComponent {}
