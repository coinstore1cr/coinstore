// trading-popup.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { OrderService, OrderData, OrderResponse } from '../../../../services/order.service';
import { CryptoService } from '../../../../services/crypto.service';
import { SharedService } from '../../../../services/shared.service';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-trading-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule
  ],
  templateUrl: './trading-popup.component.html',
  styleUrls: ['./trading-popup.component.css'],
  providers: [MessageService]
})
export class TradingPopupComponent implements OnInit {
  selectedScale: number = 180;
  amount: number = 0;
  minimumAmount: number = 100;
  balance: number = 0;
  estimatedEarnings: number = 0;
  btcPrice: number = 0;
  errorMessage: string = '';
  isLoading: boolean = false;

  currentDirection: 'up' | 'down' = 'up';
  symbol: string = 'BTC';
  name: string = 'Bitcoin';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
    private cryptoService: CryptoService,
    private sharedService: SharedService,
    private messageService: MessageService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.currentDirection = params['direction'] || 'up';
      this.symbol = params['symbol'] || 'BTC';
      this.name = params['name'] || 'Bitcoin';
    });
  }

  async ngOnInit() {
    await this.refreshBalance();
    await this.getCurrentBTCPrice();
  }

  private async refreshBalance() {
    try {
      const updatedUser = await lastValueFrom(this.userService.getUserData());
      this.balance = updatedUser.balance || 0;
      this.calculateEstimatedEarnings();
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      this.errorMessage = 'Failed to refresh balance. Please try again.';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage });
    }
  }

  private async getCurrentBTCPrice() {
    try {
      this.btcPrice = await lastValueFrom(this.cryptoService.getBTCPrice());
    } catch (error) {
      console.error('Failed to get BTC price:', error);
      this.errorMessage = 'Failed to get current BTC price. Please try again.';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage });
    }
  }

  calculateEstimatedEarnings() {
    if (this.amount && this.amount >= this.minimumAmount) {
      this.estimatedEarnings = this.amount * 0.3;
    } else {
      this.estimatedEarnings = 0;
    }
  }

  selectScale(scale: number): void {
    this.selectedScale = scale;
    this.calculateEstimatedEarnings();
  }

  validateAmount(): boolean {
    this.errorMessage = '';

    if (!this.amount || this.amount < this.minimumAmount) {
      this.errorMessage = `Amount must be at least ${this.minimumAmount}`;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Invalid Amount', 
        detail: this.errorMessage 
      });
      return false;
    }

    if (this.amount > this.balance) {
      this.errorMessage = `Your balance (${this.balance}) is insufficient for this trade`;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Insufficient Balance', 
        detail: this.errorMessage 
      });
      return false;
    }

    return true;
  }

  onSubmit() {
    if (!this.validateAmount()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const orderData = {
      amount: Number(this.amount),
      time: Number(this.selectedScale),
      direction: this.currentDirection,
      name: `${this.symbol}-Second Contract`
    };

    console.log('Submitting order:', orderData);
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Order created successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order created successfully' });

        const orderWithExpiry = {
          ...response,
          expiryTime: Date.now() + (this.selectedScale * 1000),
          name: `${this.symbol}-Second Contract`,
          estimatedEarnings: this.estimatedEarnings
        };
        
        localStorage.setItem(`order_${response.orderId}`, JSON.stringify(orderWithExpiry));

        setTimeout(() => {
          this.checkAndCompleteOrder(response.orderId);
        }, this.selectedScale * 1000);

        this.sharedService.updateorderData(orderWithExpiry);

        this.router.navigate(['record/open-order']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating order:', error);
        this.errorMessage = error.message || 'Failed to create order. Please try again.';
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: this.errorMessage 
        });
      }
    });
  }

  private async checkAndCompleteOrder(orderId: string) {
    try {
      const storedOrder = localStorage.getItem(`order_${orderId}`);
      if (!storedOrder) {
        console.error('Order not found in localStorage');
        return;
      }

      const order: OrderResponse = JSON.parse(storedOrder);
      
      const currentBtcPrice = await lastValueFrom(this.cryptoService.getBTCPrice());
      if (!currentBtcPrice) {
        throw new Error('Failed to get current BTC price');
      }
      
      const priceChange = currentBtcPrice - order.openingPrice;
      const isWin = (order.direction === 'up' && priceChange > 0) || 
                    (order.direction === 'down' && priceChange < 0);
      const profitLoss = isWin ? order.amount * 0.3 : -order.amount;

      const updatedOrder = await lastValueFrom(this.orderService.updateOrder(orderId, {
        closingPrice: currentBtcPrice,
        profitLoss,
        status: 'completed'
      }));

      if (!updatedOrder) {
        throw new Error('Failed to update order in database');
      }

      try {
        await lastValueFrom(this.userService.updateBalance(profitLoss));
        console.log('Balance updated successfully');
        
        await this.refreshBalance();
        
        this.messageService.add({
          severity: 'success',
          summary: isWin ? 'Trade Won!' : 'Trade Lost',
          detail: isWin 
            ? `You won ${profitLoss} USDT!` 
            : `You lost ${Math.abs(profitLoss)} USDT.`
        });
      } catch (error) {
        console.error('Failed to update balance:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Balance Update Failed',
          detail: 'Please contact support to update your balance.'
        });
      }

      localStorage.removeItem(`order_${orderId}`);

      this.sharedService.updateorderData({
        ...updatedOrder,
        name: `${this.symbol}-Second Contract`,
        estimatedEarnings: this.estimatedEarnings
      });

      setTimeout(() => {
        this.router.navigate(['/record/history']);
      }, 2000);
    } catch (error) {
      console.error('Error completing order:', error);
      this.errorMessage = 'Failed to complete order. Please contact support.';
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: this.errorMessage 
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/trade']);
  }
}