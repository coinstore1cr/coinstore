// open-order.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { orderService } from '../../../../services/order.service';
import { CryptoService } from '../../../../services/crypto.service';

@Component({
  selector: 'open-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './open-order.component.html',
  styleUrls: ['./open-order.component.css'],
})
export class OpenOrderComponent implements OnInit, OnDestroy {
  orderData: any;
  
  countdown: number = 0; // Initialize to 0
  countdownInterval: any;
  closingBtcPrice: number = 0;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private orderService: orderService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    // Retrieve orderData from SharedService
    this.orderData = this.sharedService.getorderData();
    

    if (!this.orderData) {
      console.error('No order data found.');
      return;
    }

    this.startCountdown();
  }

  startCountdown(): void {
    this.countdown = this.orderData.time;

    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.onCountdownEnd();
      }
    }, 1000);
  }

  async onCountdownEnd(): Promise<void> {
    // Fetch closing BTC price
    this.closingBtcPrice = await this.getCurrentBTCPrice();

    // Add closing time and price to orderData
    const finalOrderData = {
      ...this.orderData,
      closingTime: new Date().toISOString(),
      closingBtcPrice: this.closingBtcPrice,
    };

    try {
      const createdOrder = await this.orderService.createOrder(finalOrderData).toPromise();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  }

  private async getCurrentBTCPrice(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.cryptoService.getBTCPrice().subscribe({
        next: (price) => resolve(price),
        error: (err) => reject(err),
      });
    });
  }

  ngOnDestroy(): void {
    // Clear the orderData from SharedService when the component is destroyed
    this.sharedService.updateorderData(null);
    // Clear the interval if it exists
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  // New method to format countdown in HH:MM:SS
  formatCountdown(seconds: number): string {
    if (seconds < 0) return '00:00:00'; // Handle negative values

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}