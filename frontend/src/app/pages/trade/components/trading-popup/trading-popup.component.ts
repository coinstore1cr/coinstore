// trading-popup.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { orderService } from '../../../../services/order.service';
import { CryptoService } from '../../../../services/crypto.service';
import { SharedService } from '../../../../services/shared.service';
import { lastValueFrom } from 'rxjs'; // For converting observables to promises

@Component({
  selector: 'app-trading-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trading-popup.component.html',
  styleUrls: ['./trading-popup.component.css'],
})
export class TradingPopupComponent {
  selectedScale: number = 180; // Default scale
  amount: number = 0;
  minimumAmount: number = 100;
  balance: number = 0;
  estimatedEarnings: number = 0;
  btcPrice: number = 0;
  name: string = 'BTC-Second Contract';
  errorMessage: string = ''; // For displaying error messages

  currentDirection: 'up' | 'down' = 'up';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private orderService: orderService,
    private cryptoService: CryptoService,
    private sharedService: SharedService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.currentDirection = params['direction'] || 'up';
    });
  }

  async ngOnInit() {
    await this.refreshBalance();
  }

  private async refreshBalance() {
    try {
      const updatedUser = await lastValueFrom(this.userService.getUserData());
      this.balance = updatedUser.balance;
      this.calculateEstimatedEarnings();
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }

  calculateEstimatedEarnings() {
    if (this.amount && this.amount >= this.minimumAmount) {
      this.estimatedEarnings = this.amount * 0.3; // 30% calculation
    } else {
      this.estimatedEarnings = 0;
    }
  }

  // Add this method to handle scale selection
  selectScale(scale: number): void {
    this.selectedScale = scale;
    this.calculateEstimatedEarnings(); // Recalculate earnings if needed
  }

  async onSubmit() {
    this.errorMessage = ''; // Reset error message

    if (this.amount > this.balance) {
      this.errorMessage = 'Insufficient balance: Entered amount exceeds available balance.';
      return;
    }

    if (this.amount < this.minimumAmount) {
      this.errorMessage = `Minimum amount required: ${this.minimumAmount}`;
      return;
    }

    const openingTime: string = this.formatDate(new Date());

    const orderData = {
      name: this.name,
      openingTime: openingTime,
      amount: this.amount,
      time: this.selectedScale,
      estimatedEarnings: this.estimatedEarnings,
      btcPrice: await this.getCurrentBTCPrice(),
      direction: this.currentDirection,
    };

    // Update orderData in SharedService
    this.sharedService.updateorderData(orderData);

    // Navigate to OpenOrderComponent
    this.router.navigate(['record/open-order']);
  }

  private async getCurrentBTCPrice(): Promise<number> {
    return lastValueFrom(this.cryptoService.getBTCPrice());
  }

  onCancel(): void {
    this.router.navigate(['/trade']);
  }

  // Utility function to format date as yyyy/mm/dd hh:mm:ss
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
}