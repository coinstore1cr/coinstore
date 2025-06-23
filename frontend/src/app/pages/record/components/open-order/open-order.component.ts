import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { OrderService, OrderResponse } from '../../../../services/order.service';
import { CryptoService } from '../../../../services/crypto.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-open-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './open-order.component.html',
  styleUrls: ['./open-order.component.css']
})
export class OpenOrderComponent implements OnInit, OnDestroy {
  orderData: OrderResponse | null = null;
  timeLeft: number = 0;
  timerInterval: any;
  closingBtcPrice: number = 0;

  constructor(
    private sharedService: SharedService,
    private orderService: OrderService,
    private router: Router,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    this.orderData = this.sharedService.getorderData();
    if (!this.orderData) {
      return;
    }

    // Calculate time left using expiryTime
    if (this.orderData.expiryTime) {
      const now = Date.now();
      this.timeLeft = Math.max(0, Math.floor((this.orderData.expiryTime - now) / 1000));

      // Start timer
      this.timerInterval = setInterval(() => {
        this.timeLeft = Math.max(0, this.timeLeft - 1);
        if (this.timeLeft === 0) {
          clearInterval(this.timerInterval);
          this.router.navigate(['/record/open-order']);
        }
      }, 1000);
    } else {
      console.error('No expiry time found for order');
      return;
    }

    // Get current BTC price
    this.updateBTCPrice();
  }

  private async updateBTCPrice() {
    try {
      const price = await firstValueFrom(this.cryptoService.getBTCPrice());
      if (price !== undefined) {
        this.closingBtcPrice = price;
      }
    } catch (error) {
      console.error('Error getting BTC price:', error);
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}